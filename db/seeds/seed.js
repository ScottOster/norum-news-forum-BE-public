const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

exports.seed = function (knex) {
  return knex.migrate.rollback().then(() => {
    knex.migrate.latest();
  });
  //

  // add seeding functionality here
};
