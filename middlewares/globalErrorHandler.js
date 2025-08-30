

const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found!!!" });
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
