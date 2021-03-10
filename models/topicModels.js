const connection = require("../db/connection");

exports.fetchTopics = () => {
  //console.log('in model');
  return connection.select("*").from("topics");
};
