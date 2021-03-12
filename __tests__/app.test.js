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
  describe("GET article by id", () => {
    it("returns a 200 and correct object when succesfull", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0]).toHaveProperty("author");
          expect(body.article[0]).toHaveProperty("title");
          expect(body.article[0]).toHaveProperty("article_id");
          expect(body.article[0]).toHaveProperty("body");
          expect(body.article[0]).toHaveProperty("topic");
          expect(body.article[0]).toHaveProperty("created_at");
          expect(body.article[0]).toHaveProperty("votes");
          expect(body.article[0]).toHaveProperty("comment_count");
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

      it.only("returns a 400 bad request when body not a string", () => {
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
  });
});

//POSSIBLE ERRORS

//22p02 400 bad request when article id is invalid (not num)

//22p02 400 bad request when body is not a string value

//404 not found when author/username is  a string but that user deosnt exist
