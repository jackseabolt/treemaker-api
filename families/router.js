'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { Family } = require('./model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.post('/', jsonParser, (req, res) => {
    
    // checking that required fields are present

    const requiredFields = ['family_name', 'username', 'password']; 
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

    const stringFields = ['family_name', 'password', 'username']; 
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    ); 

    if (nonStringField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: 'Incorrect field type: expected string', 
            location: nonStringField
        }); 
    }

    // checking the trimming on fields 

    const trimmedFields = ['family_name', 'password', 'username']; 
    const nonTrimmedField = trimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    ); 

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: 'Cannot start or end with whitespace', 
            location: nonTrimmedField
        }); 
    }

    // checking the length of fields 

    const sizedFields = {
        family_name: { min: 1 }, 
        password: { min: 10, max: 72 }, 
        username: { min: 10, max: 72 }
    }; 

    const tooSmallField = Object.keys(sizedFields).find(field => 
        'min' in sizedFields[field] && 
        req.body[field].trim().length < sizedFields[field].min
    )

    const tooLargeField = Object.keys(sizedFields).find(field => 
        'max' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    )

    if ( tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
            : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        })
    }

    // creating the family

    let { family_name, firstname } = req.body; 
    return Family.find({ family_name })
        .count()



});


module.exports = { router }; 