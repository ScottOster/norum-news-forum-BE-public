const {
  createCommentByArticleId,
  fetchCommentsByArticleId,
} = require("../models/commentsModels.js");

exports.postCommentByArticleId = (req, res, next) => {
  createCommentByArticleId(req.body, req.params)
    .then((comment) => {
      res.status(201).send({ postedComment: comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  //console.log("hi from the controller ", req.body, req.params);

  fetchCommentsByArticleId(req.body, req.params)
    .then((commentsArray) => {
      res.status(200).send(commentsArray);
    })
    .catch(next);
};
