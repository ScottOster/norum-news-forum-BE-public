const { createCommentByArticleId } = require("../models/commentsModels.js");

exports.postCommentByArticleId = (req, res, next) => {
  createCommentByArticleId(req.body, req.params)
    .then((comment) => {
      res.status(201).send({ postedComment: comment });
    })
    .catch(next);
};
