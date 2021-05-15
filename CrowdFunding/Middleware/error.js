module.exports = function (err, req, res, next) {
  res.status(400).send({ status_code: 2, message: err.message, result: [] });
  console.log("Login Post", err.message);
};
