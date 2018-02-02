'use strict'; 

const { TEST_DATABASE_URL } = require('../config'); 
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const { app, runServer, closeServer } = require('../index'); 
const { Family } = require('../families/model');  

const expect = chai.expect; 
process.env.NODE_ENV = 'test'; 

chai.use(chaiHttp); 

describe('/families', function() {
    const family_name = 'exampleFamilyName'; 
    const password = 'examplePassword';
    const username = 'exampleUsername';  

    before(() => {
        return runServer(); 
    }); 

    after(() => {
        return closeServer(); 
    })

    afterEach(() => {
        return Family.remove({}); 
    }); 

    describe('/new', (req, res) => {
        it('rejects families without family_name', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ password, username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Missing field'); 
                    expect(res.body.location).to.equal('family_name'); 
                    expect(res.body.code).to.equal(422); 
                })
        }); 
        it('rejects families without password', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ family_name, username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Missing field'); 
                    expect(res.body.location).to.equal('password'); 
                    expect(res.body.code).to.equal(422); 
                });
        });
        it('rejects families without username', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ family_name, password })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Missing field'); 
                    expect(res.body.location).to.equal('username'); 
                    expect(res.body.code).to.equal(422); 
                });
        });
        it('rejects families with non-string family_names', () => { 
            return chai
                .request(app)
                .post('/families')
                .send({ family_name: 12345, password, username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Incorrect field type: expected string'); 
                    expect(res.body.location).to.equal('family_name'); 
                    expect(res.body.code).to.equal(422);  
                }); 
        }); 
        it('rejects families with non-string usernames', () => { 
            return chai
                .request(app)
                .post('/families')
                .send({ family_name, password, username: 12345 })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Incorrect field type: expected string'); 
                    expect(res.body.location).to.equal('username'); 
                    expect(res.body.code).to.equal(422);  
                }); 
        }); 
        it('reject families non non-trimmed passwords', () => {
            return chai 
                .request(app)
                .post('/families')
                .send({ family_name, password: ' password ', username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed') 
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response;
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Cannot start or end with whitespace'); 
                    expect(res.body.location).to.equal('password'); 
                    expect(res.body.code).to.equal(422);   
                }); 
        });
        it('rejects families with non-trimmed family_names', () => {
            return chai 
                .request(app)
                .post('/families')
                .send({ family_name: ' example ' , password, username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed') 
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response;
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Cannot start or end with whitespace'); 
                    expect(res.body.location).to.equal('family_name'); 
                    expect(res.body.code).to.equal(422);   
                }); 
        });
        it('rejects families with non-trimmed usernames', () => {
            return chai 
                .request(app)
                .post('/families')
                .send({ family_name, password, username: ' example ' })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed') 
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response;
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Cannot start or end with whitespace'); 
                    expect(res.body.location).to.equal('username'); 
                    expect(res.body.code).to.equal(422);   
                }); 
        });
        it('rejects families with family_names less than 1 character', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ password, family_name: '', username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if(err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Must be at least 1 characters long'); 
                    expect(res.body.location).to.equal('family_name'); 
                    expect(res.body.code).to.equal(422); 
                }); 
        });
        it('rejects families with passwords less than 10 character', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ password: "test", family_name, username })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if(err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Must be at least 10 characters long'); 
                    expect(res.body.location).to.equal('password'); 
                    expect(res.body.code).to.equal(422); 
                }); 
        }); 
        it('rejects families with usernames less than 10 character', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ password, family_name, username: "test" })
                .then(() => {
                    expect.fail(null, null, 'Request should not succeed')
                })
                .catch(err => {
                    if(err instanceof chai.AssertionError) {
                        throw err; 
                    }
                    const res = err.response; 
                    expect(res).to.have.status(422); 
                    expect(res.body.reason).to.equal('Validation Error'); 
                    expect(res.body.message).to.equal('Must be at least 10 characters long'); 
                    expect(res.body.location).to.equal('username'); 
                    expect(res.body.code).to.equal(422); 
                }); 
        }); 
 

    });
});
