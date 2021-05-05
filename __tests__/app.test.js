process.env.NODE_ENV = 'test';
const app = require('../app.js');
const request = require('supertest');
const connection = require('../db/connection.js');

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  connection.destroy();
});

describe('/api', () => {
  describe('/topics', () => {
    describe('get', () => {
      it('provides a 200 status code  ', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics[0]).toHaveProperty('description');
            expect(body.topics[0]).toHaveProperty('slug');
            expect(body.topics[0].description).toBe(
              'The man, the Mitch, the legend'
            );
          });
      });
    });
  });

  describe('/users', () => {
    describe('/:username', () => {
      it('responds with a status 200 and a user when user exists', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.user.name).toEqual('jonny');
          });
      });

      it('responds with a 404 when no such user exists', () => {
        return request(app)
          .get('/api/users/nonexistentusername')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('user not found');
          });
      });
    });
  });
});

describe('/articles', () => {
  describe('GET article by id', () => {
    it('returns a 200 and correct object when succesfull', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveProperty('author');
          expect(body.article).toHaveProperty('title');
          expect(body.article).toHaveProperty('article_id');
          expect(body.article).toHaveProperty('body');
          expect(body.article).toHaveProperty('topic');
          expect(body.article.created_at.toString()).toEqual(
            '2018-11-15T12:21:54.171Z'
          );
          expect(body.article).toHaveProperty('votes');
          expect(body.article).toHaveProperty('comment_count');
        });
    });

    it('returns a 400 when user inputs incorrect req type(string not article int)', () => {
      return request(app)
        .get('/api/articles/jhcjhsh')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual('Bad Request');
        });
    });
  });

  describe('PATCH article by id', () => {
    it('returns an updated article with new vote value, with all the correct keys', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 100 })
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toEqual(200);
          expect(response.body.article).toHaveProperty('article_id');
          expect(response.body.article).toHaveProperty('title');
          expect(response.body.article).toHaveProperty('body');
          expect(response.body.article).toHaveProperty('votes');
          expect(response.body.article).toHaveProperty('topic');
          expect(response.body.article).toHaveProperty('author');
          expect(response.body.article).toHaveProperty('created_at');
        });
    });

    it('responds with 400 bad request when article id value is invalid (not a num)', () => {
      return request(app)
        .patch('/api/articles/gdhgshdgdh')
        .send({ inc_votes: 100 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
        });
    });

    it('returns unchanged article when no vote value is specified (negating increment auto increment when value is 0)', () => {
      return request(app)
        .patch('/api/articles/1')
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toEqual(100);
        });
    });
  });

  describe('api/articles/:article_id/comments', () => {
    describe('POST comment by article id', () => {
      it('recieves a 201 and copy of comment with correct properties when post is successful', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 'icellusedkars',
            body: 'if this comment makes it in ill eat my hat',
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.postedComment[0]).toHaveProperty('comment_id');
            expect(body.postedComment[0]).toHaveProperty('author');
            expect(body.postedComment[0]).toHaveProperty('article_id');
            expect(body.postedComment[0]).toHaveProperty('votes');
            expect(body.postedComment[0]).toHaveProperty('created_at');
            expect(body.postedComment[0]).toHaveProperty('body');
          });
      });
      it('returns a 400 bad request when article id is invalid (not an integer)', () => {
        return request(app)
          .post('/api/articles/invalidentry/comments')
          .send({
            username: 'icellusedkars',
            body: 'if this comment makes it in ill eat my hat',
          })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
          });
      });

      it('returns a 400 bad request when body not a string', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 'icellusedkars',
            body: 66454654654,
          })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
          });
      });
    });

    it('returns a 404 not found when author is a string but doesnt exist', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 'iceljdhfdjhdfjfh',
          body: 'doesnt matter what i write here, it wont make it in',
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('not found');
        });
    });
  });
});

describe('GET comments by article id', () => {
  describe('GET /api/articles/:article_id/comments', () => {
    it('should respond with status 200 and array of of all comments for given id, sorted in correct order  ', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=comment_id&order=asc')

        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatchObject({
            comment_id: 2,
            author: 'butter_bridge',
            article_id: 1,
            votes: 14,
            created_at: '2016-11-22T12:36:03.389Z',
            body:
              'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
          });

          expect(body[0].comment_id < body[1].comment_id).toBe(true);
        });
    });

    it('should respond with array of of all comments for given id, sorted in correct order', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .query({ sort_by: 'votes', order: 'asc' })
        .expect(200)
        .then(({ body }) => {
          expect(body[0].votes < body[body.length - 1].votes).toBe(true);
        });
    });

    it('should respond with 400 bad req when incorrect format article id passed', () => {
      return request(app)
        .get('/api/articles/hxbhx/comments')
        .query({ sort_by: 'votes', order: 'asc' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad Request');
        });
    });

    it('should respond with 404 bad req when article id passed but does not exist', () => {
      return request(app)
        .get('/api/articles/9999/comments')
        .query({ sort_by: 'votes', order: 'asc' })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('article does not exist');
        });
    });
  });
});

describe('PAGINATION TESTS GET comments by ID', () => {
  describe('/api/articles/:article_id/comments', () => {
    it('should respond with status 200 and limited number of comments  ', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .query({ sort_by: 'comment_id', order: 'asc', limit: 2, p: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body[0].comment_id).toEqual(4);
        });
    });

    it('should respond with status 200 and limited number of comments  ', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .query({ sort_by: 'comment_id', order: 'asc', limit: 3, p: 3 })
        .expect(200)
        .then(({ body }) => {
          expect(body[0].comment_id).toEqual(8);
          expect(body[1].comment_id).toEqual(9);
          expect(body[2].comment_id).toEqual(10);
        });
    });
  });
});

describe.only('GET articles', () => {
  describe('/api/articles', () => {
    it('returns an array of Articles with correct props when no queries applied ', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles[0]).toHaveProperty('author');
          expect(body.articles[0]).toHaveProperty('title');
          expect(body.articles[0]).toHaveProperty('article_id');
          expect(body.articles[0]).toHaveProperty('topic');
          expect(body.articles[0]).toHaveProperty('created_at');
          expect(body.articles[0]).toHaveProperty('votes');
          expect(body.articles[0]).toHaveProperty('comment_count');
        });
    });

    it('returns correctly filtered array of articles when queries applied', () => {
      return request(app)
        .get('/api/articles')
        .query({
          sort_by: ' article_id',
          order: 'asc',
          author: 'rogersop',
          topic: 'cats',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toEqual(1);
          expect(body.articles[0].author).toBe('rogersop');
          expect(body.articles[0].topic).toBe('cats');
        });
    });

    it('returns correctly filtered sorted and ordered array of articles when all queries applied', () => {
      return request(app)
        .get('/api/articles')
        .query({
          sort_by: ' article_id',
          order: 'asc',
          author: 'icellusedkars',
          topic: 'mitch',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toEqual(6);
          expect(body.articles[0].author).toBe('icellusedkars');
          expect(body.articles[0].topic).toBe('mitch');
          expect(
            body.articles[0].article_id <
              body.articles[body.articles.length - 1].article_id
          ).toBe(true);
        });
    });
    it('returns 400 bad request when trying to sort by a column that doesnt exist ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          sort_by: 'blood_type',
          order: 'asc',
          author: 'icellusedkars',
          topic: 'mitch',
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });

    it('returns correctly sorted array of articles by author', () => {
      return request(app)
        .get('/api/articles')
        .query({
          sort_by: 'author',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].author).toBe('rogersop');
        });
    });

    it('returns correctly sorted array when passed order ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          sort_by: 'author',
          order: 'asc',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].author).toBe('butter_bridge');
        });
    });

    it('returns correctly sorted array of articles by specific author where author exists ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'butter_bridge',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].author).toBe('butter_bridge');
          expect(body.articles.length).toBe(3);
        });
    });

    it('returns correctly sorted array of articles by specific topic where topic exists ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'rogersop',
          topic: 'cats',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].topic).toBe('cats');
          expect(body.articles.length).toBe(1);
        });
    });
    it('gives a 200 status and an empty array when topic does exist, but has no articles assoicated ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'rogersop',
          topic: 'paper',
        })
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(0);
        });
    });
    it('gives a 200 status and an empty array when user does exist, but has no articles assoicated ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'lurker',
          topic: 'mitch',
        })
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(0);
        });
    });

    it('throws a rejection when author/user does not exist  ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'ray_kay_jowling',
          topic: 'mitch',
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('user not found');
        });
    });

    it('throws a rejection when topic does not exist  ', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'icellusedkars',
          topic: 'nonexistentsubject',
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('topic not found');
        });
    });
  });
});

describe('GET articles - PAGINATION TESTS', () => {
  describe('api/articles', () => {
    it('should limit the number of articles returned when passed a limt and start page', () => {
      return request(app)
        .get('/api/articles')
        .query({ limit: 5, p: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(5);
        });
    });

    it('should limit the number of articles returned when applied along with filters, and offset correct pages/results', () => {
      return request(app)
        .get('/api/articles')
        .query({
          author: 'icellusedkars',
          limit: 2,
          p: 2,
          sort_by: 'article_id',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(2);
          expect(body.articles[0].author).toBe('icellusedkars');
          expect(body.articles[1].author).toBe('icellusedkars');
          expect(body.articles[0].title).toBe('Z');
        });
    });

    it('should work for multiple page/limit arguments', () => {
      return request(app)
        .get('/api/articles')
        .query({
          limit: 2,
          p: 3,
          sort_by: 'article_id',
          order: 'asc',
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(2);
          expect(body.articles[0].title).toBe(
            'UNCOVERED: catspiracy to bring down democracy'
          );
          expect(body.articles[1].title).toBe('A');
        });
    });

    it('should have a total count property that shows the total number of articles (after filter applied disregarding limit)', () => {
      return request(app)
        .get('/api/articles')
        .query({ author: 'icellusedkars', limit: 2, p: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(2);
          expect(body.articles[0].total_articles_count).toBe(6);
        });
    });
  });
});

describe('PATCH votes by comment id', () => {
  describe('/api/comments/:comment_id', () => {
    it('responds with updated comment with new vote value when positive value passed', () => {
      return request(app)
        .patch('/api/comments/18')
        .send({ inc_votes: 10 })
        .then(({ body }) => {
          expect(body.comment.votes).toBe(26);
        });
    });

    it('responds with updated comment with new vote value when negative value passed', () => {
      return request(app)
        .patch('/api/comments/18')
        .send({ inc_votes: -10 })
        .then(({ body }) => {
          expect(body.comment.votes).toBe(6);
        });
    });
    it('returns a 200 and does not change vote, when no new vote value is passed', () => {
      return request(app)
        .patch('/api/comments/18')
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).toBe(16);
        });
    });

    it('returns a 400 bad request when comment id not valid ', () => {
      return request(app)
        .patch('/api/comments/jdhjhdhj')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
  });
});

describe('PATCH comment body by comment ID', () => {
  describe('/api/comments/:comment_id', () => {
    it('sends status 200 and update comment when passed valid query', () => {
      return request(app)
        .patch('/api/comments/7')
        .send({ new_Text: 'I saved the lobster from the lobster pot' })
        .then(({ body }) => {
          expect(body.comment.body).toBe(
            'I saved the lobster from the lobster pot'
          );
        });
    });
    it('returns a 200 and does not change body, when no new text value is passed', () => {
      return request(app)
        .patch('/api/comments/7')
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.body).toBe('Lobster pot');
        });
    });
  });
});

describe('Delete comment by ID', () => {
  describe('/api/comments/:comment_id', () => {
    it('should delete given comment and return status 204', () => {
      return request(app).delete('/api/comments/14').expect(204);
    });
    it('should delete given comment and return status 204', () => {
      return request(app).delete('/api/comments/7').expect(204);
    });
    it('should delete given comment and return status 204', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then((res) => {});
    });

    it('should return a 400 bad request when delete contains invalid comment_id', () => {
      return request(app)
        .delete('/api/comments/9999')
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe('Bad Request');
        });
    });
  });
});

describe('PATCH article body by id', () => {
  describe('PATCH api/articles/:article_id', () => {
    it('should return a 200 with updated article ', () => {
      return request(app)
        .patch('/api/articles/3')
        .send({ new_Text: 'of pugs' })
        .then(({ body }) => {
          expect(body.article).toHaveProperty('article_id');
          expect(body.article).toHaveProperty('title');
          expect(body.article.body).toBe('of pugs');
          expect(body.article).toHaveProperty('votes');
          expect(body.article).toHaveProperty('topic');
          expect(body.article).toHaveProperty('author');
          expect(body.article).toHaveProperty('created_at');
        });
    });
  });

  it('responds with 400 bad request when article id value is invalid (not a num)', () => {
    return request(app)
      .patch('/api/articles/gdhgshdgdh')
      .send({ new_Text: 'of pugs' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });

  it('returns unchanged article when no body text is specified ', () => {
    return request(app)
      .patch('/api/articles/3')
      .expect(200)
      .then((response) => {
        expect(response.body.article.body).toBe('some gifs');
      });
  });
});

describe('handling 405 errors, all paths', () => {
  describe('405s api/topics', () => {
    it('invalidMethodHandler responds with 405 invalid method ', () => {
      return request(app)
        .del('/api/topics')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid Method');
        });
    });

    it('returns 405 for PATCH, POST, PUT requests', () => {
      const invalidMethods = ['patch', 'post', 'put'];

      const invMethPromises = invalidMethods.map((meth) => {
        return request(app)
          [meth]('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Method');
          });
      });

      return Promise.all(invMethPromises);
    });
  });

  describe('405s api/users', () => {
    it('returns 405 for PATCH, POST, PUT requests', () => {
      const invalidMethods = ['patch', 'post', 'put', 'delete'];

      const invMethPromises = invalidMethods.map((meth) => {
        return request(app)
          [meth]('/api/users/4')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Method');
          });
      });
      return Promise.all(invMethPromises);
    });
  });

  describe('405s api/comments/:comment_id', () => {
    it('returns 405 for POST, PUT requests', () => {
      const invalidMethods = ['post', 'put'];

      const invMethPromises = invalidMethods.map((meth) => {
        return request(app)
          [meth]('/api/comments/1')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Method');
          });
      });
      return Promise.all(invMethPromises);
    });
  });

  describe('405s api/articles/:article_id', () => {
    it('returns 405 for DELETE, PUT requests', () => {
      const invalidMethods = ['delete', 'put'];

      const invMethPromises = invalidMethods.map((meth) => {
        return request(app)
          [meth]('/api/articles/4')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Method');
          });
      });
      return Promise.all(invMethPromises);
    });
  });
  describe('405s api/articles/:article_id/comments', () => {
    it('returns 405 for DELETE, PUT requests', () => {
      const invalidMethods = ['delete', 'put'];

      const invMethPromises = invalidMethods.map((meth) => {
        return request(app)
          [meth]('/api/articles/4/comments')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Method');
          });
      });
      return Promise.all(invMethPromises);
    });
  });

  describe('405s api/articles', () => {
    it('returns 405 for DELETE, PUT requests', () => {
      const invalidMethods = ['delete', 'put'];

      const invMethPromises = invalidMethods.map((meth) => {
        return request(app)
          [meth]('/api/articles/')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Method');
          });
      });
      return Promise.all(invMethPromises);
    });
  });
});

describe('GET /api', () => {
  it('respond with detailed json file of all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe('object');
        expect(Object.keys(body).length).toEqual(10);
      });
  });
});
