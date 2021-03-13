const {
  createCommentByArticleId,
  fetchCommentsByArticleId,
  updateCommentVotesById,
} = require("../models/commentsModels.js");

exports.postCommentByArticleId = (req, res, next) => {
  createCommentByArticleId(req.body, req.params)
    .then((comment) => {
      res.status(201).send({ postedComment: comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.body, req.params)
    .then((commentsArray) => {
      res.status(200).send(commentsArray);
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  updateCommentVotesById(req.body, req.params)
    .then((comment) => {
      res.status(200).send(comment);
    })
    .catch(next);
};
