const express = require('express');
const apiRouter = require('./routes/apiRouter.js');
const cors = require('cors');

const {
  psqlThrownErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errorHandlers');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.use(psqlThrownErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
