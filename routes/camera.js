const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Camera = require("../src/company");
const User = require("../src/user");
const responseMessages = require("../responseMessages");
const checkAuth = require("../middelware/check-auth");

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true}));

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Create camera
router.post("", checkAuth, (request, result) => {
    const userName = request.body.username;
    const cameraName = request.body.cameraName;
    const location = request.body.location;
    const company = request.body.company;
    const building = request.body.building;
    const angle = request.body.angle;


    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result);
    } else if (userName != null || cameraName != null || location != null || company != null || building != null || angle != null) {

        User.findOne({name: userName}, function (err, docs) {
            if (err || docs === null) {
                responseMessages.ErrorCode412(result);
            } else {
                const newCamera = new Camera({cameraName: cameraName, location: location, company: company, building: building, angle: angle, user: docs._id});
                //Save the instance of user
                newCamera.save()
                //Check if the user already exists
                    .then(() => {
                        //If no; Create new user
                        responseMessages.SuccessCode201Camera(result, cameraName, location, company, building, angle);
                    })
                    //If yes Return errorCode.
                    .catch(err => {
                        responseMessages.ErrorCode409DuplicateCamera(result);
                    });
            }
        });

    } else {
        responseMessages.ErrorCode412(result);
    }
});

//Get all cameras
router.get("/:userName", (request, result) => {
    const userName = request.params.userName;

    User.findOne({name: userName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            Camera.find({}, function (err, docs) {
                if (err || docs === null) {
                    responseMessages.ErrorCode412(result);
                } else {
                    responseMessages.SuccessCode200GetAll(result, docs);
                }
            })
        }
    });
});

//Read Camera Endpoint for 1 Camera
router.get("/:userName/:cameraName", (request, result) => {
    const userName = request.params.userName;
    const cameraName = request.params.cameraName;

    User.findOne({name: userName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            Camera.find({cameraName: cameraName}, function (err, docs) {
                if (err || docs === null) {
                    responseMessages.ErrorCode404(result);
                } else {
                    responseMessages.SuccessCode200GetAll(result, docs);
                }
            });
        }
    });
});

//Update a camera
router.put("", checkAuth, (request, result) => {
    const userName = request.body.username;
    const cameraName = request.body.cameraName;
    const location = request.body.location;
    const company = request.body.company;
    const building = request.body.building;
    const angle = request.body.angle;

    const newCameraName = request.body.newCameraName;
    const newLocation = request.body.newLocation;
    const newCompany = request.body.newCompany;
    const newBuilding = request.body.newBuilding;
    const newAngle = request.body.newAngle;

    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result);
    } else if (userName != null || cameraName != null || location != null || company != null || building != null || angle != null || newCameraName != null || newLocation != null  || newCompany != null || newBuilding != null || newAngle != null) {
        if (cameraName == newCameraName || location == newLocation || company == newCompany || building == newBuilding || angle == newAngle) {
            responseMessages.ErrorCode412SameValues(result);
        } else {
        User.findOne({name: userName}, function (err, docs) {
            if (err || docs === null) {
                responseMessages.ErrorCode412(result);
            } else {
                Camera.findOne({cameraName: cameraName}, function (err, docs) {
                    if (err || docs === null) {
                        responseMessages.ErrorCode422(result);
                    } else {
                        docs.cameraName = newCameraName;
                        docs.location = newLocation;
                        docs.company = newCompany;
                        docs.building = newBuilding;
                        docs.angle = newAngle;
                        docs.save()
                            .then(() => {
                                responseMessages.SuccessCode200UpdateCamera(result, newCameraName, newLocation, newCompany, newBuilding, newAngle);
                            })
                            .catch(err => {
                                responseMessages.ErrorCode409DuplicateCamera(result);
                            });
                    }
                });
            }
        });
    }
    } else {
        responseMessages.ErrorCode412(result);
    }
});

//TODO: Pass user to this request
//TODO: Check is user exists
//Delete a camera
router.delete("/:userName/:cameraName", checkAuth, (request, result) => {
    const userName = request.params.userName;
    const cameraName = request.params.cameraName;

    User.findOne({name: userName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {
            Camera.findOne({cameraName: cameraName}, function (err, docs) {
                if (err || !docs) {
                    responseMessages.ErrorCode422(result);
                } else {
                    Camera.deleteOne({"cameraName": cameraName})
                        .then(() => {
                            responseMessages.SuccessCode204(result);
                        });
                }
            });
        }
    });
});

module.exports = router;