const { getEndpointDescription } = require("../models/apiModels.js");

exports.endpointDescribe = (req, res, next) => {
  res.status(200).send(getEndpointDescription());
};
