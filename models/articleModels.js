const { default: knex } = require("knex");
const dbConnection = require("../db/connection");

exports.fetchArticleById = (articleObj) => {
  // console.log(articleObj, "<<<<IN MODEL");

  return dbConnection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id", { as: "comment_count" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where("articles.article_id", "=", articleObj.article_id)
    .groupBy("articles.article_id")
    .then((dbRes) => {
      return { article: dbRes };
    });
};

exports.patchArticleById = (incVotesObj, articleIdObj) => {
  return dbConnection
    .increment("votes", incVotesObj.inc_votes)
    .from("articles")
    .where(articleIdObj)
    .returning("*");
};
