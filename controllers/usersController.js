const { fetchUserByUsername } = require("../models/userModels");

exports.getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
