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

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(invalidMethodHandler);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(invalidMethodHandler);

articlesRouter.route("").get(getMultipleArticles).all(invalidMethodHandler);

module.exports = articlesRouter;
