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
  console.log(querysObj, "in model");
  const order = querysObj.order;
  const sort_by = querysObj.sort_by;

  return dbConnection
    .select("*")
    .from("comments")
    .where(articleObj)
    .orderBy(sort_by || "created_at", order || "desc")
    .then((commenstArray) => {
      //console.log(commenstArray);
      return commenstArray;
    });
};
