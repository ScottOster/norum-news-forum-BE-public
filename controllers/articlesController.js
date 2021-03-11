const { fetchArticleById } = require("../models/articleModels.js");

exports.getArticleById = (req, res, next) => {
  //console.log({}, "req params here");
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};
