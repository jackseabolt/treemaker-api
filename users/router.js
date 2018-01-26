'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { User } = require('./model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.post('/', jsonParser, (req, res) => {

    // checking that required fields are present

    const requiredFields = ['username', 'password', 'email']; 
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

    const stringFields = ['username', 'password', 'email', 'lastname', 'firstname']; 
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

    const trimmedFields = ['username', 'password', 'email']; 
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

    // checking length of fields with required length

    const sizedFields = {
        username: { min: 1 }, 
        password: { min: 10, max: 72 }
    };
    const tooSmallField = Object.keys(sizedFields).find(field => 
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(field => 
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    ); 

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422, 
            reason: 'Validation Error', 
            message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
            : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        }); 
    }

    // creating the user

    let { username, firstname, lastname, families, email, password } = req.body; 
    return User.find({ username })
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422, 
                    reason: 'Validation Error', 
                    message: 'Username already taken', 
                    location: 'username'
                }); 
            }
            return User.hashPassword(password); 
        })
        .then(hash => {
            return User.create({ username, firstname, lastname, families, email, password: hash })
        })
        .then(user => {
            return res.status(201).json(user.apiRepr()); 
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ code: 500, message: 'Internal server error'})
        })
})

module.exports = { router }