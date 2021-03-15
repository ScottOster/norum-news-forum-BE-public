const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById,
} = require("../controllers/commentsController");
const { invalidMethodHandler } = require("../errorHandlers");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(invalidMethodHandler);

module.exports = commentsRouter;
