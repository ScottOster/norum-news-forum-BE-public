const {
  fetchArticleById,
  patchArticleById,
  fetchMultipleArticles,
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
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getMultipleArticles = (req, res, next) => {
  fetchMultipleArticles(req.body)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
