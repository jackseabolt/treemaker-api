'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const { Family } = require('./model'); 
const router = express.Router(); 
const jsonParser = bodyParser.json(); 

router.get('/', (req, res) => {
    return res.json({test: "Worked"})
})


module.exports = { router }; 