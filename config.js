'use strict';
 
require('dotenv').load(); 

module.exports = {
    PORT: process.env.PORT || 8080, 
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
}