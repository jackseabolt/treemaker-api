const express = require('express'); 
const app = express(); 
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const cors = require('cors');  
const { CLIENT_ORIGIN, PORT, DATABASE_URL } = require('./config'); 
const { router: usersRouter } = require('./users/router'); 
const { router: familyRouter } = require('./families/router'); 

mongoose.Promise = global.Promise; 

app.use(
    morgan(process.env.NODE_ENV === 'poduction' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
); 

app.use(
    cors({ 
        origin: CLIENT_ORIGIN
    })
);

app.use('/users', usersRouter ); 
app.use('/families', familyRouter); 

app.get('/', (req, res) => {
    return res.json({ data: 'TEST SUCESSFUL' })
}); 

let server; 
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, err => {
            if(err) {
                return reject(err)
            }
            server = app.listen(PORT, () => {
                console.log(`The API is listening on ${PORT}`); 
                resolve(); 
            })
            .on('error', err => {
                mongoose.disconnect(); 
                reject(err); 
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server'); 
            server.close(err => {
                if(err) {
                    return reject(err); 
                }
            });
            resolve();  
        }); 
    }); 
}

if(require.main === module) {
    runServer().catch(err => console.error(err)); 
}

module.exports = { app, runServer, closeServer }; 