const fetchArticleById = require("../models/articleModels.js");

exports.getArticleById = (req, res, next) => {
  console.log(req.params, "req params here");
  fetchArticleById(req.params).then((article) => {
    console.log(req.params);
  });
};
