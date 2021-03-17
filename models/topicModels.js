const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select("*").from("topics");
};

exports.checkTopicBySlug = (topic) => {
  if (topic != undefined) {
    return connection
      .select("slug")
      .from("topics")
      .where("slug", topic)
      .then((topicArray) => {
        if (!topicArray.length) {
          return Promise.reject({
            status: 404,
            msg: "topic not found",
          });
        } else {
          return topicArray;
        }
      });
  } else return topic;
};
