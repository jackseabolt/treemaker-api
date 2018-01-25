const express = require('express'); 
const app = express(); 
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const cors = require('cors');  
const { CLIENT_ORIGIN, PORT } = require('./config'); 
const { router: usersRouter } = require('./users/router'); 

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

app.get('/', (req, res) => {
    return res.json({ data: 'TEST SUCESSFUL' })
}); 

let server; 
function runServer() {
    server = app.listen(PORT, () => {
        console.log(`The API is listening on ${PORT}`); 
    })
}

function closeServer() {
    return server.close(err => {
        if(err) {
            return console.error(err); 
        }
    })
}

if(require.main === module) {
    runServer()
}