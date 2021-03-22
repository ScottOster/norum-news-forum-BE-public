const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");
const {
  reFormatTimeStamp,
  renameKeys,
  formatObj,
  createRef,
  formatComments,
} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topicData).returning("*");
    })
    .then(() => {
      return knex("users").insert(userData).returning("*");
    })
    .then(() => {
      const newArticleData = [...articleData].map((article) => {
        const newArticle = { ...article };
        newArticle.created_at = reFormatTimeStamp(newArticle.created_at);
        return newArticle;
      }); /// make a function to do this in utils and test

      return knex("articles").insert(newArticleData).returning("*");
    })
    .then((articleRows) => {
      const commentsRefObj = createRef(articleRows, "title", "article_id");

      let newCommentData = [...commentData].map((comment) => {
        const newComment = { ...comment };
        newComment.created_at = reFormatTimeStamp(newComment.created_at);
        return newComment;
      });
      newCommentData = renameKeys(newCommentData, "created_by", "author");

      const dbReadyComments = formatComments(
        newCommentData,
        commentsRefObj,
        "belongs_to",
        "article_id"
      );

      return knex("comments")
        .insert(dbReadyComments)
        .returning("*")
        .then((comments) => {});
    });
};
