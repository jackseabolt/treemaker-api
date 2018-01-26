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
        })
    })

})
