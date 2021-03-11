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
