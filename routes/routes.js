const express = require('express');
const router = express.Router();
const Joi = require('joi');

// database
let users = require('../db/database'); 

// GET 

// get all users
router.get('/users', function(req, res) {
    res.send(users);
});

// get specific user
router.get('/users/:id', function(req, res) {

    // find the requested user
    const user = users.find(function(user) {
        return user.id === req.params.id;
    });

    if (!user) {
        return res.status(404).send("Can`t find user with the given ID");
    }

    // responce with the user
    res.send(user);

});

//POST

// create an user 
router.post('/users', function(req, res) {

    // validate the requests user
    const result = validateUser(req.body);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    //create the user
    const user = {
        "id": generateID(users), 
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "username": req.body.username,
        "email": req.body.email,
        "address": req.body.address,
        "jobTitle": req.body.jobTitle,
        "company": req.body.company
    };

    // add to database
    users.push(user);

    // responce with all users
    res.json(users);

});

//PUT

// update an user
router.put('/users/:id', function(req, res) {

    // find the requests user
    const user = users.find(function(user) {
        return user.id === req.params.id;
    });

    if (!user) {
        return res.status(404).send("The user with the given ID not found");
    }

    // validate the request
    const result = validateUser(req.body);

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

// DELETE

// delete an user
router.delete('/users/:id', function(req, res) {
    // find the requested user
    const user = users.find(function(user) {
        return user.id === req.params.id;
    });

    if (!user) {
        return res.status(404).send("The user with the given ID not found");
    }

    // remove user from database 
    users.splice(users.indexOf(user), 1);

    // responce with the deleted user
    res.send(user);
});

// UTILS

// validating function
const validateUser = (user) => {
    const schema = {
        "firstName": Joi.string(),
        "lastName": Joi.string(),
        "username": Joi.string(),
        "email": Joi.string().email(),
        "address": Joi.string().trim(),
        "jobTitle": Joi.string().trim(),
        "company": Joi.string().trim()
    };

    return Joi.validate(user, schema);
}

// generate ID for the user with pattern **-***-****
const generateID = (array) => {
    let firstNumber = Math.floor(Math.random() * 100),
        secondNumber = Math.floor(Math.random() * 10000);

    firstNumber > 10 ? firstNumber : firstNumber + 10;
    secondNumber > 1000 ? secondNumber : secondNumber + 1000;

    return firstNumber + "-" + (array.length + 1) + "-" + secondNumber;
}

module.exports = router;