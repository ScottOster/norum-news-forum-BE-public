const dbConnection = require("../db/connection");

exports.createCommentByArticleId = (userCommentObj, articleIdObj) => {
  // console.log("in the model", userCommentObj, articleIdObj);
  if (typeof userCommentObj.body != "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  } else {
    return dbConnection

      .select("comments")
      .insert({
        body: userCommentObj.body,
        author: userCommentObj.username,
        ...articleIdObj,
      })
      .into("comments")
      .where(articleIdObj)
      .returning("*")
      .then((dbResponse) => {
        return dbResponse;
      });
  }
};
