const { fetchUserByUsername } = require("../models/userModels");

exports.getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params).then((user) => {
    if (!user.length) {
      res.status(404).send({ msg: "user not found" });
    } else {
      console.log("hi this is the controller", user);
      res.status(200).send({ user });
    }
  });
};
