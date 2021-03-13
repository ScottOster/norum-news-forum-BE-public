const dbConnection = require("../db/connection");

exports.createCommentByArticleId = (userCommentObj, articleIdObj) => {
  if (typeof userCommentObj.body != "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  } else {
    console.log("Hi");
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

exports.fetchCommentsByArticleId = (querysObj, articleObj) => {
  console.log(articleObj, "in model");
  const order = querysObj.order;
  const sort_by = querysObj.sort_by;

  return dbConnection
    .select("*")
    .from("comments")
    .where(articleObj)
    .orderBy(sort_by || "created_at", order || "desc")
    .then((commenstArray) => {
      if (!commenstArray.length) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist",
        });
      }
      return commenstArray;
    });
};

exports.updateCommentVotesById = (votesObj, commentIdObj) => {
  if (votesObj.inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "must enter valid vote amount" });
  } else {
    return dbConnection
      .increment("votes", votesObj.inc_votes)
      .from("comments")
      .where(commentIdObj)
      .returning("*");
  }
};
