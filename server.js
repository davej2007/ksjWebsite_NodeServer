// **** Node JS Server.
const http = require('http');

const express = require ('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./API/config/database'); 
const jwt = require('jsonwebtoken');
const app = express();
// const server = http.createServer(app);
// **** Port Variables
// const hostname = 'localhost';
const PORT = process.env.PORT || 8080;
const dbURI = process.env.MONGODB_URI || config.heroku;
// **** API Routes
const authRoute = require('./API/routes/auth');
const operatorRoute = require('./API/routes/operator');
const partyRoute = require('./API/routes/party');
const teamRoute = require('./API/routes/team');

// **** Database Connection
mongoose.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err){
        console.log('DataBase Connection Error :', err);
    } else {
        console.log('Successfully Connected to Database : ',dbURI);
    }
});
// **** Middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// **** Token Decode Middleware
    // operator_id
    // operatorID
    // operatorname
    // team_id
    // teamID
    // teamName
    // admin:
app.use((req, res,next)=>{
    if (!req.headers['xtoken']){
        req.decoded = {valid:false, decoded:null, admin:null, message: 'No Token Supplied'};
        next();
    } else {
        let token = req.headers['xtoken'].split(' ');
        let TOKEN = token[1] || 'false'
        if(TOKEN !='false'){
            jwt.verify(TOKEN, config.tokenKey, function(err, user) {
                if(err){
                    req.decoded = {valid:false, decoded:null, admin:null, message: 'Token Error '+ err};
                    next();
                } else {
                    req.decoded = {valid:true, decoded:user, admin:user.admin, message: 'Token Decoded'};
                    next();
                }
            });
        } else {
            req.decoded = {valid:false, decoded:null, admin:null, message:  'No Token Supplied'};
            next();
        }
    }
});
// **** Router routes
app.use('/api/auth', authRoute);
app.use('/api/operator', operatorRoute);
app.use('/api/party', partyRoute);
app.use('/api/team', teamRoute);
// **** Main routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// **** Start Server
// server.listen(PORT, hostname, () => {
//   console.log(`Server running at http://${hostname}:${PORT}/`);
// });

// start server
app.listen(PORT, () => {
    console.log('Server Running .... on port :'+PORT);
});