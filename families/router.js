'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { Family } = require('./model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['family_name', 'password']; 
    const missingField = requiredFields.find(field => !(field in req.body)); 

    if(missingField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: 'Missing field', 
            location: missingField
        }); 
    }

    res.sendStatus(201); 
});


module.exports = { router }; 