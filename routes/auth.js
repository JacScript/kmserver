const router = require("express").Router();
const User = require('../models/User');
const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const  generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { getPasswordResetTemplate, getPasswordChangedTemplate } = require("../utils/emailTemplates");

// Register new user
router.post("/register", async (request, response, next) => {
  const { username, password, email} = request.body;

  try {
    if (!username || !password || !email) {
      return next(createHttpError(400, 'All fields are required'));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(createHttpError(400, 'User already exists'));
    }

    const user = await User.create({ username, email, password });

     // Generate token and set cookie

     await generateToken(response, user._id);
    // const accessToken = jwt.sign(
    //   { id: user._id, isAdmin: user.role === 'admin' },
    //   process.env.JWT_SEC,
    //   { expiresIn: "30d" }
    // );

    // response.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: true, // Enable only if using HTTPS
    //   sameSite: 'none', // Set based on frontend deployment
    //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // });

    const { password: _, ...others } = user.toObject();
    response.status(201).json({ success: true, message: "User created", data: others });
  } catch (err) {
    console.error(err);
    return next(createHttpError(500, 'Internal server error'));
  }
});

// Login route
router.post("/login", async (request, response, next) => {
  const { email, password } = request.body;

  try {
    if (!email || !password) {
      const error = createHttpError(400, 'All fields are required');
        return next (error);
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      const error = createHttpError(401, 'Invalid email or password');
      return next(error);
    }


    // Generate token and set cookie
    await generateToken(response, user._id);

    // const accessToken = jwt.sign(
    //   { id: user._id, isAdmin: user.role === 'admin' },
    //   process.env.JWT_SEC,
    //   { expiresIn: "30d" }
    // );

    // response.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // });

    const { password: _, ...others } = user.toObject();
    response.status(200).json({ success: true, message: "Logged in successfully", data: others });
  } catch (err) {
    // console.error(err);
    return next(createHttpError(500, 'Internal server error'));
  }
});

// Logout route
router.post("/logout", async (request, response, next) => {
  try {
    response.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Enable only if using HTTPS
      sameSite: 'strict', // Set based on frontend deployment
      expires: new Date(0), // Set expiration to the past to clear the cookie
    }); 
    // response.clearCookie('jwt');
    response.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    return next(createHttpError(500, "Logout failed"));
  }
});

// Forgot Password - Send reset email
router.post("/forgot-password", async (request, response, next) => {
  const { email } = request.body;

  try {
    if (!email) {
      return next(createHttpError(400, 'Email is required'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return response.status(200).json({ 
        success: true, 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (10 minutes)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetURL}</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      response.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Clear reset token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(createHttpError(500, 'Email could not be sent'));
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return next(createHttpError(500, 'Internal server error'));
  }
});



// Reset Password - Verify token and update password
router.post("/reset-password/:token", async (request, response, next) => {
  const { token } = request.params;
  const { password, confirmPassword } = request.body;

  try {
    if (!password || !confirmPassword) {
      return next(createHttpError(400, 'Password and confirm password are required'));
    }

    if (password !== confirmPassword) {
      return next(createHttpError(400, 'Passwords do not match'));
    }

    if (password.length < 6) {
      return next(createHttpError(400, 'Password must be at least 6 characters long'));
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(createHttpError(400, 'Invalid or expired reset token'));
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date();
    
    await user.save();

    // Generate new token and set cookie for automatic login
    await generateToken(response, user._id);

    const { password: _, ...others } = user.toObject();
    response.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: others
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return next(createHttpError(500, 'Internal server error'));
  }
});

// Verify reset token (optional - to check if token is valid before showing reset form)
router.get("/verify-reset-token/:token", async (request, response, next) => {
  const { token } = request.params;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(createHttpError(400, 'Invalid or expired reset token'));
    }

    response.status(200).json({
      success: true,
      message: 'Reset token is valid',
      data: {
        email: user.email,
        expiresAt: user.passwordResetExpires
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    return next(createHttpError(500, 'Internal server error'));
  }
});

// Change password for authenticated users
router.post("/change-password", verifyTokenAndAdmin, async (request, response, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = request.body;
  const userId = request.user.id;

  try {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return next(createHttpError(400, 'All password fields are required'));
    }

    if (newPassword !== confirmNewPassword) {
      return next(createHttpError(400, 'New passwords do not match'));
    }

    if (newPassword.length < 6) {
      return next(createHttpError(400, 'New password must be at least 6 charactears long'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(createHttpError(400, 'Current password is incorrect'));
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    response.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return next(createHttpError(500, 'Internal server error'));
  }
});

module.exports = router;
