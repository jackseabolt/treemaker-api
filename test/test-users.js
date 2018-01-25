'use strict'; 

const { DATABASE_URL } = require('../config'); 
// 'mongodb://localhost/treemaker-database';
process.env.NODE_ENV = 'test'; 
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const { app, runServer, closeServer } = require('../index'); 
const { User } = require('../users/model'); 

const expect = chai.expect; 

chai.use(chaiHttp); 

describe('/users/', function() {
    const username = 'exampleUsername'; 
    const password = 'examplePassword'; 
    const email = 'exampleEmail'; 
    const usernameB = 'exampleUsernameB'; 
    const passwordB = 'examplePasswordB'; 

    before(function () {
        return runServer(); 
    });

    after(function() {
        return closeServer(); 
    });

    afterEach(function() {
        return User.remove({}); 
    }); 

    describe('/users/', function() {
        describe('POST', function() {
            it('should reject users without a username', function() {
                return chai
                    .request(app)
                    .post('/users/')
                    .send({ password, email })
                    .then(() => {
                        expect.fail(null, null, 'Request should not succeed')
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err; 
                        }
                        const res = err.response; 
                        expect(res).to.have.status(422); 
                    })
                    
            })
        })
    })
})