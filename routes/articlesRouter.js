const articlesRouter = require("express").Router();
const {
  postCommentByArticleId,
  getCommentsByArticleId,
} = require("../controllers/commentsController");
const {
  getArticleById,
  patchArticleById,
  getMultipleArticles,
} = require("../controllers/articlesController");

const { invalidMethodHandler } = require("../errorHandlers");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.get("", getMultipleArticles);
articlesRouter.all(invalidMethodHandler);

module.exports = articlesRouter;
