const {
  fetchArticleById,
  patchArticleById,
  fetchMultipleArticles,
} = require('../models/articleModels.js');

const { checkUserByUsername } = require('../models/userModels');
const { checkTopicBySlug } = require('../models/topicModels');
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
  const checkTopic = checkTopicBySlug(req.query.topic);
  const checkUser = checkUserByUsername(req.query.author);
  const dbResults = fetchMultipleArticles(req.query);

  const promises = Promise.all([checkTopic, checkUser, dbResults]);

  promises
    .then(([checkTopic, checkUser, articles]) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
