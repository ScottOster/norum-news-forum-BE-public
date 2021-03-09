process.env.NODE_ENV = 'test';
const app = require('../app.js');
const request = require('supertest');
const connection = require('../db/connection.js')


describe('/api', () => {
    describe('/topics', () => {
        describe('get', () => {

            it('provide a 200 status code  ', () => {
                
                   

            });
            
        });
    });
    
});