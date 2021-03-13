const commentsRouter = require("express").Router();
const { patchCommentById } = require("../controllers/commentsController");

commentsRouter.patch("/:comment_id", patchCommentById);

module.exports = commentsRouter;
