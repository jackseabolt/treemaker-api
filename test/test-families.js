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
                .send({ password })
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
                .send({ family_name })
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
        it('rejects families with non-string family_names', () => { 
            return chai
                .request(app)
                .post('/families')
                .send({ family_name: 12345, password })
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
        it('rejects families with non-string passwords', () => { 
            return chai
                .request(app)
                .post('/families')
                .send({ family_name, password: 12345 })
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
                    expect(res.body.location).to.equal('password'); 
                    expect(res.body.code).to.equal(422);  
                }); 
        }); 
        it('reject families non non-trimmed passwords', () => {
            return chai 
                .request(app)
                .post('/families')
                .send({ family_name, password: ' password ' })
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
        it('rejects families with non-trimmed passwords', () => {
            return chai 
                .request(app)
                .post('/families')
                .send({ family_name: ' example ' , password })
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
        it('rejects families with family_names less than 1 character', () => {
            return chai
                .request(app)
                .post('/families')
                .send({ password, family_name: '' })
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
                })
        })

    });
});
