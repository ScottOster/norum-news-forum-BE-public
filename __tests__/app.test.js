process.env.NODE_ENV = "test";
const app = require("../app.js");
const request = require("supertest");
const connection = require("../db/connection.js");

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  connection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("get", () => {
      it("provides a 200 status code  ", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics[0]).toHaveProperty("description");
            expect(body.topics[0]).toHaveProperty("slug");
            expect(body.topics[0].description).toBe(
              "The man, the Mitch, the legend"
            );
          });
      });
    });
  });

  describe("/users", () => {
    describe("/:username", () => {
      it("responds with a status 200 and a user when user exists", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user[0].name).toEqual("jonny");
          });
      });

      it("responds with a 404 when no such user exists", () => {
        return request(app)
          .get("/api/users/nonexistentusername")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("user not found");
          });
      });
    });
  });
});

describe("/articles", () => {
  describe.only("GET article by id", () => {
    it("returns a 200 and correct object when succesfull", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body.article).toHaveProperty("author");
          expect(body.article).toHaveProperty("title");
          expect(body.article).toHaveProperty("article_id");
          expect(body.article).toHaveProperty("body");
          expect(body.article).toHaveProperty("topic");
          expect(body.article).toHaveProperty("created_at");
          expect(body.article).toHaveProperty("votes");
          expect(body.article).toHaveProperty("comment_count");
        });
    });

    it("returns a 400 when user inputs incorrect req type(string not article int)", () => {
      return request(app)
        .get("/api/articles/jhcjhsh")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
  });

  describe("PATCH article by id", () => {
    it("returns an updated article with new vote value, with all the correct keys", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 100 })
        .expect(200)
        .then((response) => {
          console.log(response.body.article);
          expect(response.body.article[0].votes).toEqual(200);
          expect(response.body.article[0]).toHaveProperty("article_id");
          expect(response.body.article[0]).toHaveProperty("title");
          expect(response.body.article[0]).toHaveProperty("body");
          expect(response.body.article[0]).toHaveProperty("votes");
          expect(response.body.article[0]).toHaveProperty("topic");
          expect(response.body.article[0]).toHaveProperty("author");
          expect(response.body.article[0]).toHaveProperty("created_at");
        });
    });

    it("responds with 400 bad request when article id value is invalid (not a num)", () => {
      return request(app)
        .patch("/api/articles/gdhgshdgdh")
        .send({ inc_votes: 100 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("api/articles/:article_id/comments", () => {
    describe("POST article by username", () => {
      it("recieves a 201 and copy of comment with correct properties when post is successful", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars",
            body: "if this comment makes it in ill eat my hat",
          })
          .expect(201)
          .then(({ body }) => {
            console.log(body);
            expect(body.postedComment[0]).toHaveProperty("comment_id");
            expect(body.postedComment[0]).toHaveProperty("author");
            expect(body.postedComment[0]).toHaveProperty("article_id");
            expect(body.postedComment[0]).toHaveProperty("votes");
            expect(body.postedComment[0]).toHaveProperty("created_at");
            expect(body.postedComment[0]).toHaveProperty("body");
          });
      });
      it("returns a 400 bad request when article id is invalid (not an integer)", () => {
        return request(app)
          .post("/api/articles/invalidentry/comments")
          .send({
            username: "icellusedkars",
            body: "if this comment makes it in ill eat my hat",
          })
          .expect(400)
          .then((response) => {
            console.log(response.body);
            expect(response.body.msg).toBe("Bad Request");
          });
      });

      it("returns a 400 bad request when body not a string", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars",
            body: 66454654654,
          })
          .expect(400)
          .then((response) => {
            console.log(response.body);
            expect(response.body.msg).toBe("Bad Request");
          });
      });
    });

    it("returns a 404 not found when author is a string but doesnt exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "iceljdhfdjhdfjfh",
          body: "doesnt matter what i write here, it wont make it in",
        })
        .expect(404)
        .then((response) => {
          console.log(response.body);
          expect(response.body.msg).toBe("not found");
        });
    });
  });
});

describe("GET comments by article id", () => {
  describe("GET /api/articles/:article_id/comments", () => {
    it("should respond with status 200 and array of of all comments for given id, sorted in correct order  ", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .send({ sort_by: "comment_id", order: "asc" })
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatchObject({
            comment_id: 2,
            author: "butter_bridge",
            article_id: 1,
            votes: 14,
            created_at: "2016-11-22T12:36:03.000Z",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          });

          expect(body[0].comment_id < body[1].comment_id).toBe(true);
        });
    });

    it("should respond with array of of all comments for given id, sorted in correct order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .send({ sort_by: "votes", order: "asc" })
        .expect(200)
        .then(({ body }) => {
          expect(body[0].votes < body[body.length - 1].votes).toBe(true);
        });
    });

    it("should respond with 400 bad req when incorrect format article id passed", () => {
      return request(app)
        .get("/api/articles/hxbhx/comments")
        .send({ sort_by: "votes", order: "asc" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad Request");
        });
    });

    it("should respond with 404 bad req when article id passed but does not exist", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .send({ sort_by: "votes", order: "asc" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("article does not exist");
        });
    });
  });
});

describe("GET articles", () => {
  describe("/api/articles", () => {
    it("returns an array of Articles with correct props when no queries applied ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          console.log(body);

          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles[0]).toHaveProperty("author");
          expect(body.articles[0]).toHaveProperty("title");
          expect(body.articles[0]).toHaveProperty("article_id");
          expect(body.articles[0]).toHaveProperty("topic");
          expect(body.articles[0]).toHaveProperty("created_at");
          expect(body.articles[0]).toHaveProperty("votes");
          expect(body.articles[0]).toHaveProperty("comment_count");
        });
    });

    it("returns correctly filtered array of articles when queries applied", () => {
      return request(app)
        .get("/api/articles")
        .send({
          sort_by: " article_id",
          order: "asc",
          author: "rogersop",
          topic: "cats",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toEqual(1);
          expect(body.articles[0].author).toBe("rogersop");
          expect(body.articles[0].topic).toBe("cats");
        });
    });

    it("returns correctly filtered sorted and ordered array of articles when all queries applied", () => {
      return request(app)
        .get("/api/articles")
        .send({
          sort_by: " article_id",
          order: "asc",
          author: "icellusedkars",
          topic: "mitch",
        })
        .expect(200)
        .then(({ body }) => {
          console.log(body);

          expect(body.articles.length).toEqual(6);
          expect(body.articles[0].author).toBe("icellusedkars");
          expect(body.articles[0].topic).toBe("mitch");
          expect(
            body.articles[0].article_id <
              body.articles[body.articles.length - 1].article_id
          ).toBe(true);
        });
    });
    it("returns 400 bad request when trying to sort by a column that doesnt exist ", () => {
      return request(app)
        .get("/api/articles")
        .send({
          sort_by: "blood_type",
          order: "asc",
          author: "icellusedkars",
          topic: "mitch",
        })
        .expect(400)
        .then(({ body }) => {
          console.log(body);
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("PATCH votes by comment id", () => {
  describe("/api/comments/:comment_id", () => {
    it("responds with updated comment with new vote value when positive value passed", () => {
      return request(app)
        .patch("/api/comments/18")
        .send({ inc_votes: 10 })
        .then(({ body }) => {
          expect(body[0].votes).toBe(26);
        });
    });

    it("responds with updated comment with new vote value when negative value passed", () => {
      return request(app)
        .patch("/api/comments/18")
        .send({ inc_votes: -10 })
        .then(({ body }) => {
          expect(body[0].votes).toBe(6);
        });
    });
    it("returns a 400 and does not change vote, when no new vote value is passed", () => {
      return request(app)
        .patch("/api/comments/18")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("must enter valid vote amount");
        });
    });
  });
});

describe("Delete comment by ID", () => {
  describe("/api/comments/:comment_id", () => {
    it("should delete given comment and return status 204", () => {
      return request(app).delete("/api/comments/14").expect(204);
    });
    it("should delete given comment and return status 204", () => {
      return request(app).delete("/api/comments/7").expect(204);
    });
    it("should delete given comment and return status 204", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then((res) => {});
    });
  });
});

/* 

DELETE /api/comments/:comment_id
Should
delete the given comment by comment_id
Responds with
status 204 and no content


*/