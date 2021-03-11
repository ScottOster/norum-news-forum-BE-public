const express = require("express");
const apiRouter = require("./routes/apiRouter.js");
const {psqlThrownErrorHandler, customErrorHandler} = require('./errorHandlers')
const app = express();

app.use("/api", apiRouter);

//comes back here when path fails
app.use(psqlThrownErrorHandler)
app.use(customErrorHandler);
//app.use(errorhandler2?)
module.exports = app;
