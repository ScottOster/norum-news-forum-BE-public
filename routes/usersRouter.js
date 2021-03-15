const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/usersController.js");
const { invalidMethodHandler } = require("../errorHandlers.js");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethodHandler);

module.exports = usersRouter;
