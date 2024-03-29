const apiRouter = require("express").Router();

const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { endpointDescribe } = require("../controllers/apiController");
apiRouter.get("", endpointDescribe);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
module.exports = apiRouter;
