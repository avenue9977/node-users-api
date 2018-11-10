var express = require('express');
var router = express.Router();
var Joi = require('joi');

// database
var users = require('../db/database');

// api routes 

// get all users
router.get('/users', function(req, res) {
    // responce with all users
    res.send(users);
});

// get specific user
router.get('/users/:id', function(req, res) {

    // find the requested user
    var user = users.find(function(user) {
        return user.id === req.params.id;
    });

    if (!user) {
        return res.status(404).send("User with the given ID not found");
    }

    // responce with the user
    res.send(user);

});

// create an user 
router.post('/users', function(req, res) {

    // validate the requests user
    var result = validateUser(req.body);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    //create the user
    var user = {
        "id": generateID(users), 
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "username": req.body.username,
        "email": req.body.email,
        "address": req.body.address,
        "jobTitle": req.body.jobTitle,
        "company": req.body.company
    };

    // add to database (users array)
    users.push(user);

    // responce with all users
    res.json(users);

});

// updare an user
router.put('/users/:id', function(req, res) {

    // find the requests user
    var user = users.find(function(user) {
        return user.id === req.params.id;
    });

    if (!user) {
        return res.status(404).send("The user with the given ID not found");
    }

    // validate the request
    var result = validateUser(req.body);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    // update the user
    user.firstName = req.body.firstName,
    user.lastName = req.body.lastName,
    user.username = req.body.username,
    user.email = req.body.email,
    user.address = req.body.address,
    user.jobTitle = req.body.jobTitle,
    user.company = req.body.company

    // responce with the updated user
    res.send(user);

});

// delete an user
router.delete('/users/:id', function(req, res) {
    // find the requested user
    var user = users.find(function(user) {
        return user.id === req.params.id;
    });

    if (!user) {
        return res.status(404).send("The user with the given ID not found");
    }

    // remove user from database 
    var index = users.indexOf(user);
    users.splice(index, 1);

    // responce with the deleted user
    res.send(user);
});

// validating function
function validateUser(user) {
    var schema = {
        "firstName": Joi.string(),
        "lastName": Joi.string(),
        "username": Joi.string(),
        "email": Joi.string().email(),
        "address": Joi.string().trim(),
        "jobTitle": Joi.string().trim(),
        "company": Joi.string().trim()
    };

    var result = Joi.validate(user, schema);
    return result;
}

// filtering function
function filterUsers(item, type, array) {
    if (item.type === type) {
        array.push(item);
    }
}

// generate ID for the user with pattern **-***-****
function generateID(array) {
    let firstNumber = Math.floor(Math.random() * 100),
        secondNumber = Math.floor(Math.random() * 10000);

    firstNumber > 10 ? firstNumber : firstNumber + 10;
    secondNumber > 1000 ? secondNumber : secondNumber + 1000;

    return firstNumber + "-" + (array.length + 1) + "-" + secondNumber;
}

module.exports = router;