'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { Family } = require('./model'); 
const { User } = require('../users/model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false }); 

router.post('/', jwtAuth, jsonParser, (req, res) => {

    // checking that given id is valid
    let { family_name, password, username, id } = req.body; 

    User.findOne({ _id: id})
        .count()
        .then(count => {
            if (count < 1) {
                return Promise.reject({
                    code: 422, 
                    reason: 'Validation Error', 
                    message: 'Family must be created by a user', 
                    location: 'id'
                })
            } 
            return Promise.resolve();  
        })
        .catch(err => {
            return res.sendStatus(422).json({code: err.code, message: err.message, reason: err.reason, location: err.location })
        }); 

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

    // checking existance of family with same username


    return Family.find({ username })
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
            
    // creating family

            return Family.hashPassword(password); 
        })
        .then(hash => {
            console.log("CHECKOUTPOINT AAA")
            console.log(`Username: ${username}`)
            console.log(`FamilyName: ${family_name}`)
            console.log(`Password: ${hash}`)
            return Family.create({
                family_name, 
                password: hash, 
                username: "something else"
            })
        })
        .then(family => {
            return res.status(201).json(family.apiRepr()); 
        })
        .catch(err => {
            console.error(err); 
            return res.status(err.code).json({code: err.code, message: err.message, reason: err.reason, location: err.location })
        }); 
});


router.get('/:id', jsonParser, (req, res) => {
    return Family.findOne({_id: req.params.id })
        .then(family => {
            res.status(200).json(family.apiRepr())
        })
        .catch(err => {
            return res.status(404).json({
                code: 404, 
                reason: "Not Found Error", 
                message: "Family could not be found", 
                location: 'params :id' 
            })
        }); 
})


router.post('/:id/members', jsonParser, (req, res) => {

    // validates presence of relative data

    let parents, children, siblings, pictures; 

    if (!(req.body.parents || 
        req.body.children || 
        req.body.siblings || 
        req.body.pictures)) {
        res.status(404).json({
            code: 422, 
            reason: "Validation Error", 
            message: "Must supply parent, child or sibling",   
        })
    }

    // creates variables for optional data

    if(req.body.parents) {
        parents = [
            { parent_id: req.body.parents }
        ]
    }

    if(req.body.siblings) {
        siblings = [
            { sibling_id: req.body.siblings }
        ]
    }

    if(req.body.children) {
        children = [
            { children_id: req.body.children }
        ]
    }

    if(req.body.url) {
        url = [
            { url: req.body.url }
        ]
    }

    const newMember = {
        fname: req.body.fname, 
        lname: req.body.lname, 
        mname: req.body.mname, 
        birth_date: req.body.birth_date,
        birth_town: req.body.birth_town, 
        birth_state: req.body.birth_state,  
        death_date: req.body.death_date, 
        death_town: req.body.death_town, 
        death_state: req.body.death_state, 
        short_bio: req.body.short_bio, 
        long_bio: req.body.long_bio, 
        parents, 
        siblings, 
        children,
        pictures
    }

    console.log("NEW MEMBER", newMember, req.params.id)

    Family
        .update(
            { _id: req.params.id }, 
            { $push: { members: newMember }}
        )
        .then(family => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({err}); 
        });
})


module.exports = { router }; 