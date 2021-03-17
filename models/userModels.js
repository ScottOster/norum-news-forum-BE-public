const connection = require("../db/connection");

exports.fetchUserByUsername = (user) => {
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where("username", user.username)
    .then((userArray) => {
      if (!userArray.length) {
        return Promise.reject({
          status: 404,
          msg: "user not found",
        });
      } else {
        return userArray;
      }
    });
};
exports.checkUserByUsername = (user) => {
  if (user != undefined) {
    return connection
      .select("username")
      .from("users")
      .where("username", user)
      .then((userArray) => {
        if (!userArray.length) {
          return Promise.reject({
            status: 404,
            msg: "user not found",
          });
        } else {
          return userArray;
        }
      });
  } else return user;
};
