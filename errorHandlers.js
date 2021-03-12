exports.psqlThrownErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err);
  } else if ((err.status = 400)) {
    res.status(400).send(err);
  }
};
