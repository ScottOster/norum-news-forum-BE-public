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
      //console.log("DB RES>>>>", { article: dbRes });
      return { article: dbRes };
    });
  //.catch((err) => {
  //console.log(err.code, "ERROR RETURNED FROM DB TO MODEL");
  // });
  /// insert return db connect here with query
};
