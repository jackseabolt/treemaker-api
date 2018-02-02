'use strict';
 
require('dotenv').load(); 

module.exports = {
    PORT: process.env.PORT || 8080, 
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:4200', 
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/treemaker-database',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/treemaker-test'
}