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
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getMultipleArticles = (req, res, next) => {
  //console.log("hi from the get articles controller");
  fetchMultipleArticles(req.body)
    .then((articlesArray) => {
      res.status(200).send({ articles: articlesArray });
    })
    .catch(next);
};
