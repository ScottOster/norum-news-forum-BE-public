const {
  fetchArticleById,
  patchArticleById,
  fetchMultipleArticles,
} = require("../models/articleModels.js");

const { checkUserByUsername } = require("../models/userModels");

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
  const checkUser = checkUserByUsername(req.body.author);
  const dbResults = fetchMultipleArticles(req.body);

  const promises = Promise.all([checkUser, dbResults]);

  console.log(promises);

  promises
    .then(([checkUser, articles]) => {
      console.log(articles, "ggggggggggggggggg");

      res.status(200).send(articles);
    })
    .catch(next);
};
/*exports.getMultipleArticles = (req, res, next) => {
  fetchMultipleArticles(req.body)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);




    if ((mystery[0].status = 404)) {
      res.status(404).send({ msg: "user not found" });
    } else {
      res.status(200).send(mystery[1]);
    }
    console.log(mystery).catch(next);
}; */
