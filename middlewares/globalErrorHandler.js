// const notFound = (request, response, next) => {
//     const error = new Error(`Not Found - ${request.originUrl}`);
//     response.status(404);
//     next(error);
//   };
  
//   const errorHandler = (error, request, response, next) => {
//     let statusCode = response.statusCode === 200 ? 500 : response.statusCode;
//     let message = error.message;
  
//     if (error.name === "CastError" && error.kind === "ObjectId") {
//       statusCode === 404;
//       message = "Resource not Found";
//     }
  
//     response.status(statusCode).json({
//       message,
//       stack: process.env.NODE_ENV === "production" ? null : error.stack,
//     });
//   };
  
//   module.exports = { notFound, errorHandler };

// globalErrorHandler.js

const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
    status,
  });
};

module.exports = { notFound, errorHandler };
