exports.psqlThrownErrorHandler = (err, req, res, next) => {
  console.log("1", err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else if (err.code === "42703") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  console.log("2", err);
  if (err.status === 404) {
    res.status(404).send(err);
  } else if ((err.status = 400)) {
    res.status(400).send(err);
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.invalidMethodHandler = (req, res, next) => {
  res.status(405).send({ msg: "Invalid Method" });
};
