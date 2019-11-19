const express = require("express");
const bodyParser = require("body-parser");
const User = require("../src/user");
const router = express.Router();
const responseMessages = require("../responseMessages");
const jwt = require('jsonwebtoken');
const checkAuth = require("../middelware/check-auth");

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true}));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Login
router.post("/login", (request, result) => {
    const email = request.body.email;
    const password = request.body.password;

    User.findOne({email: email, password: password}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode401Auth(result);
        } else {
           const token = jwt.sign(
                {
                name: docs.name,
                email: docs.email
                },
                "secret",
                {
                    expiresIn: "1h"
                }
                );
            responseMessages.SuccessCode200Auth(result, token, docs);
        }
    })
});

//Create user
router.post("", (request, result) => {
    const userName = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result);
    } else if (request.body.username != null && request.body.email != null && request.body.password != null) {

        //Create a  new instance of User
        const newUser = new User({name: userName, email: email, password: password});
        //Save the instance of user
        newUser.save()
        //Check if the user already exists
            .then(() => {
                //If no; Create new user
                responseMessages.SuccessCode201User(result, userName, password);
            })
            //If yes Return errorCode.
            .catch(err => {
                responseMessages.ErrorCode409DuplicateUser(result);
            });

    } else {
        responseMessages.ErrorCode412(result);
    }
});

//Get all users
router.get("", (request, result) => {
    User.find({}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Get a user
router.get("/:username", (request, result) => {
    const userName = request.params.username;

    User.findOne({name: userName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode422(result);
        } else {
            responseMessages.SuccessCode200GetAll(result, docs);
        }
    })
});

//Update a users
router.put("", checkAuth, (request, result) => {
        const userName = request.body.username;
        const password = request.body.password;
        const newPassword = request.body.newPassword;

        if (Object.keys(request.body).length === 0) {
            responseMessages.ErrorCode412(result);
        } else if (userName != null || password != null || newPassword != null) {
            if (password == newPassword) {
                responseMessages.ErrorCode412SameValues(result);
            } else {
                User.findOne({name: userName}, function (err, docs) {
                    if (!docs) {
                        responseMessages.ErrorCode422(result);
                    } else if (docs.password !== password) {
                        responseMessages.ErrorCode401(result);
                    } else {
                        User.updateOne({"name": userName}, {$set: {password: newPassword}}).then(() => {
                            responseMessages.SuccessCode200User(result, userName, newPassword);
                        });
                    }
                });
            }
        } else {
            responseMessages.ErrorCode412(result);
        }
    }
);

//Delete a users
router.delete("/:username/:password", checkAuth, (request, result) => {
    const username = request.params.username;
    const password = request.params.password;

    User.findOne({name: username}, function (err, docs) {
        if (!docs) {
            console.log(docs);
            console.log(err);
            responseMessages.ErrorCode422(result);
        } else if (docs.password !== password) {
            responseMessages.ErrorCode401(result);
        } else {
            User.deleteOne({"name": username}).then(() => {
                responseMessages.SuccessCode204(result);
            });
        }
    });
});

module.exports = router;