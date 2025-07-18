const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const User = require("../models/User");

// Middleware to verify access token from cookies
const verifyToken = async (request, response, next) => {
  let  token = await request.cookies.jwt;
    // console.log(token);


  try {
    // console.log(token);

    if (!token) {
      return next(createHttpError(401, 'Access token missing'));
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    
    const user = await User.findById(decoded.id).select("-password -__v"); 
    if (!user) {
      return next(createHttpError(401, 'User does not exist'));
    }

    request.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, 'Invalid or expired token'));
  }
};

// Middleware to verify token and check if the user is an admin
const verifyTokenAndAdmin = async (request, response, next) => {
  await verifyToken(request, response, async (err) => {
    if (err) return next(err);

    if (request.user?.role === 'admin') {
      return next();
    } else {
      return next(createHttpError(403, 'Admin privileges required'));
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};
