const dbConnection = require("../db/connection");

exports.createCommentByArticleId = (userCommentObj, articleIdObj) => {
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

exports.fetchCommentsByArticleId = (querysObj, articleObj) => {
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

exports.updateCommentById = (queryObj, commentIdObj) => {
  if (queryObj.inc_votes != undefined) {
    return dbConnection
      .increment("votes", queryObj.inc_votes || 0)
      .from("comments")
      .where(commentIdObj)
      .returning("*")
      .then(([comment]) => {
        return { comment: comment };
      });
  } else if (queryObj.new_Text != undefined) {
    return dbConnection
      .update({ body: queryObj.new_Text })
      .from("comments")
      .where(commentIdObj)
      .returning("*")
      .then(([comment]) => {
        return { comment: comment };
      });
  } else {
    return dbConnection
      .select("*")
      .from("comments")
      .where(commentIdObj)
      .returning("*")
      .then(([comment]) => {
        return { comment: comment };
      });
  }
};

exports.eraseCommentById = (commentId) => {
  return dbConnection

    .select("*")
    .from("comments")
    .where("comment_id", commentId.comment_id)
    .del()
    .returning("*")
    .then((dbRes) => {
      if (!dbRes.length) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
        });
      }
    });
};
