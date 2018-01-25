'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { User } = require('./model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.get('/', (req, res) => {
    return res.json({ data: 'ROUTER SUCCESS'})
})

router.post('/', jsonParser, (req, res) => {
    let { username, firstname, lastname, families, email, password } = req.body; 
    return User.create({ 
        username, firstname, lastname, families, email, password 
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