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
  }
};

//possibly one error handling funct for errors thrown by psql

//one for custom

///promise reject is a way to manually create a rejection so custom errors can then be handled with
//catch in the same way as they can for psql thrown errors.
//probably cleaner to do promise rejects in models so controllers can be succint and free of logic
