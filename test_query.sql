\c nc_news_test;

SELECT  articles.author, title, articles.body, topic, articles.created_at, articles.votes, COUNT (comments.article_id)
FROM articles 
LEFT JOIN comments ON articles.article_id=comments.article_id
WHERE articles.article_id = 5
GROUP BY articles.article_id;






--join comments but not select? just use for comment count?

--COMMENTS COUNT SHOULD BE 2

--SELECT * FROM users;

--SELECT * FROM topics;

--SELECT * FROM comments;