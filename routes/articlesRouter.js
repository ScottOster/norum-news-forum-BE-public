const articlesRouter = require("express").Router();
const { postCommentByUsername } = require("../controllers/commentsController");
const {
  getArticleById,
  patchArticleById,
} = require("../controllers/articlesController");

articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.post("/:article_id/comments", postCommentByUsername);
module.exports = articlesRouter;
