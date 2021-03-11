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
  describe("GET", () => {
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
});
