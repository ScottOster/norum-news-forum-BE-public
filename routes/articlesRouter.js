const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articlesController");

articlesRouter.get("/:article_id", getArticleById);

module.exports = articlesRouter;
