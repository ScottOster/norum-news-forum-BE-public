const {
  topicData,
  articleData,
  commentData,
  userData,
} = require( '../data/index.js' );


exports.seed = function ( knex ) {
  return knex.migrate.rollback().then( () => {
    
  })
  //





  // add seeding functionality here
};


/*
exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('houses')
        .insert(houseData)
        .returning('*');
    })
    .then((houseRows) => {
      // <-- do the rest of the 