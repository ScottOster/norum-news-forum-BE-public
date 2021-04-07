const {
  createCommentByArticleId,
  fetchCommentsByArticleId,
  updateCommentById,
  eraseCommentById,
} = require('../models/commentsModels.js');

exports.postCommentByArticleId = (req, res, next) => {
  createCommentByArticleId(req.body, req.params)
    .then((comment) => {
      res.status(201).send({ postedComment: comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  console.log(req.query, req.params);
  fetchCommentsByArticleId(req.query, req.params)
    .then((commentsArray) => {
      res.status(200).send(commentsArray);
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  updateCommentById(req.body, req.params)
    .then((comment) => {
      res.status(200).send(comment);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  eraseCommentById(req.params)
    .then((deletedComment) => {
      res.status(204).send(deletedComment);
    })
    .catch(next);
};
