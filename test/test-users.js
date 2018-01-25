'use strict'; 

global.DATABASE_URL = 'mongodb://localhost/treemaker-database';
procss.env.NODE_ENV = 'test'; 
const chai = require('chai'); 
const chaiHttp = require('chai-http'); 