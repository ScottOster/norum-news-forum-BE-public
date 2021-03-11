const express = require("express");
const apiRouter = require("./routes/apiRouter.js");
const {
  psqlThrownErrorHandler,
  customErrorHandler,
} = require("./errorHandlers");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(psqlThrownErrorHandler);
app.use(customErrorHandler);

module.exports = app;
