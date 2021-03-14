const e = require("express");
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
    .then(([dbRes]) => {
      return { article: dbRes };
    });
};

exports.patchArticleById = (incVotesObj, articleIdObj) => {
  return dbConnection
    .increment("votes", incVotesObj.inc_votes)
    .from("articles")
    .where(articleIdObj)
    .returning("*")
    .then(([article]) => {
      return { article: article };
    });
};

exports.fetchMultipleArticles = (queryObj) => {
  console.log(queryObj, "in model");

  const sort_by = queryObj.sort_by;
  const order = queryObj.order;
  const author = queryObj.author;
  const topic = queryObj.topic;

  return dbConnection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.article_id", { as: "comment_count" })
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .modify((querySoFar) => {
      if (author !== undefined && topic !== undefined) {
        querySoFar.where("topic", topic).where("articles.author", author);
      } else if (author !== undefined && topic == undefined) {
        querySoFar.where("articles.author", author);
      } else {
        querySoFar.where("topic", topic);
      }
    })
    .orderBy(sort_by || "date", order || "desc")
    .then((dbRes) => {
      return dbRes;
    });
};
