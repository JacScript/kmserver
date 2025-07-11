const jwt = require('jsonwebtoken');

const generateToken = (response, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SEC,
        { expiresIn: "30d" }
    );


    response.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Enable only if using HTTPS
      sameSite: 'strict', // Set based on frontend deployment
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
}

module.exports = generateToken;