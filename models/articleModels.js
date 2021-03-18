const e = require("express");
const dbConnection = require("../db/connection");

exports.fetchArticleById = (articleObj) => {
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

exports.patchArticleById = (queryObj, articleIdObj) => {
  if (queryObj.inc_votes != undefined) {
    return dbConnection
      .increment("votes", queryObj.inc_votes || 0)
      .from("articles")
      .where(articleIdObj)
      .returning("*")
      .then(([article]) => {
        return { article: article };
      });
  } else if (queryObj.new_Text != undefined) {
    return dbConnection
      .update({ body: queryObj.new_Text })
      .from("articles")
      .where(articleIdObj)
      .returning("*")
      .then(([article]) => {
        return { article: article };
      });
  } else {
    return dbConnection
      .select("*")
      .from("articles")
      .where(articleIdObj)
      .returning("*")
      .then(([article]) => {
        return { article: article };
      });
  }
};

exports.fetchMultipleArticles = (queryObj) => {
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
      } else if (author !== undefined && topic === undefined) {
        querySoFar.where("articles.author", author);
      } else if ((author === undefined) & (topic !== undefined)) {
        querySoFar.where("topic", topic);
      } else {
        querySoFar.then((articles) => {
          return articles;
        });
      }
    })
    .orderBy(sort_by || "created_at", order || "desc")
    .then((articles) => {
      return { articles: articles };
    });
};
