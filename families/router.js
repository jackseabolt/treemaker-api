'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { Family } = require('./model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.post('/', jsonParser, (req, res) => {
    
    // checking that required fields are present

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

    // checking the format of string fields 

    const stringFields = ['family_name', 'password']; 
    const nonStringField = stringFields.find(field => {
        field in stringFields && typeof req.body[field] !== 'string'
    }); 

    if (nonStringField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: 'Incorrect field type: expected string', 
            location: nonStringField
        }); 
    }


});


module.exports = { router }; 