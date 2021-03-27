const topicsRouter = require('express').Router();

const { getTopics } = require('../controllers/topicsController');
const { invalidMethodHandler } = require('../errorHandlers');

topicsRouter.route('/').get(getTopics).all(invalidMethodHandler);

module.exports = topicsRouter;
