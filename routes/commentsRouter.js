const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById,
} = require("../controllers/commentsController");

commentsRouter.patch("/:comment_id", patchCommentById);
commentsRouter.delete("/:comment_id", deleteCommentById);
module.exports = commentsRouter;
