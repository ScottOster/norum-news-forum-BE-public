const articlesRouter = require("express").Router();
const {
  postCommentByArticleId,
  getCommentsByArticleId,
} = require("../controllers/commentsController");
const {
  getArticleById,
  patchArticleById,
} = require("../controllers/articlesController");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
module.exports = articlesRouter;
