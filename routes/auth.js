const router = require("express").Router();
const User = require('../models/User');
const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const  generateToken = require("../utils/generateToken");

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
    console.error(err);
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

module.exports = router;
