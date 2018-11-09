// set up 
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// API files for interacting with fake database
const api = require('./routes/routes');

// Configuration 
app.use(morgan('dev')); // log every request to the console

// Parsers
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.json()); // parse application/json

app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use(methodOverride());

// API url 
app.use('/api', api);


// Send all other requests to 404
app.get('*', function(req, res) {
    res.status(404);
    res.send();
});

// Set port and listen (start app)
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log(`Running on localhost:${port}`);
});