'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const router = express.Router(); 

router.get('/', (req, res) => {
    return res.json({ data: 'ROUTER SUCCESS'})
})

module.exports = { router }