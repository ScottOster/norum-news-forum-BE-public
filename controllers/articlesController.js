const {
  fetchArticleById,
  patchArticleById,
} = require("../models/articleModels.js");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  patchArticleById(req.body, req.params)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};
