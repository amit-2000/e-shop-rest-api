module.exports.errorHandler = (err, req, res, next) => {
  // for unauthorized user
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ err });
  }
  //   for ValidationError
  if (err.name === "ValidationError") {
    return res.status(401).json({ err });
  }
  //   default error handler
  if (err) {
    return res.status(500).json({ err });
  }
};
