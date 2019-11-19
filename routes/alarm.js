const express = require("express");
const bodyParser = require("body-parser");
const Camera = require("../src/company");
const User = require("../src/user");
const router = express.Router();
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

//Create alarm
router.post("", checkAuth, (request, result) => {
    const userName = request.body.username;
    const cameraName = request.body.cameraName;
    const alarmName = request.body.alarmName;
    const description = request.body.description;
    const alarmType = request.body.alarmType;
    const alarmLevel = request.body.alarmLevel;

    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result);
    } else if (userName != null || cameraName != null && alarmName != null && description != null || alarmType != null || alarmLevel != null) {
        //Get created user and create Thread in MongoDB
        User.findOne({name: userName}, function (err, userDocs) {
            if (err || userDocs === null) {
                responseMessages.ErrorCode422(result);
            } else {
                Camera.findOne({cameraName: cameraName}, function (err, cameraDocs) {
                    if (err || cameraDocs === null) {
                        responseMessages.ErrorCode422(result);
                    } else {
                        cameraDocs.alarm.push({
                            title: alarmName,
                            camera: cameraDocs._id,
                            description: description,
                            alarmType: alarmType,
                            alarmLevel: alarmLevel
                        });
                        responseMessages.SuccessCode201Alarm(result, alarmName, cameraName, alarmType, alarmLevel);
                        cameraDocs.save();
                    }
                });
            }
        });
    } else {
        responseMessages.ErrorCode412(result);
    }

});
//Get all alarms
router.get("/:userName/:cameraName", checkAuth, (request, result) => {
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
                    responseMessages.SuccessCode200GetAll(result, docs);
                }
            });
        }
    });
});
//Get an alarm
router.get("/:userName/:cameraName/:alarmId", checkAuth, (request, result) => {
    const userName = request.params.userName;
    const cameraName = request.params.cameraName;
    const alarmId = request.params.alarmId;

    User.findOne({name: userName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {

            Camera.findOne({cameraName: cameraName}, function (err, cameraDocs) {
                if (err || cameraDocs.alarm.length == 0) {
                    responseMessages.ErrorCode422(result);
                } else {
                    for (let i = 0; i < cameraDocs.alarm.length; i++) {
                        if (cameraDocs.alarm[i]._id.toString() === alarmId) {
                            responseMessages.SuccessCode200GetAll(result, cameraDocs.alarm[i]);
                        } else {
                            responseMessages.ErrorCode422(result);
                        }
                    }
                }
            });
        }
    });

});
//Update an alarm
router.put("", checkAuth, (request, result) => {
    const userName = request.body.userName;
    const cameraName = request.body.cameraName;
    const alarmId = request.body.alarmId;
    let newAlarmName = request.body.newAlarmName;
    let newDescription = request.body.newDescription;
    let newAlarmType = request.body.newAlarmType;
    let newAlarmLevel = request.body.newAlarmLevel;

    if (Object.keys(request.body).length === 0) {
        responseMessages.ErrorCode412(result);
    } else if (userName != null || cameraName != null || alarmId != null) {
        //Check if user
        User.findOne({name: userName}, function (err, docs) {
            if (err || docs === null) {
                responseMessages.ErrorCode412(result);
            } else {
                //check if camera
                Camera.findOne({cameraName: cameraName}, function (err, cameraDocs) {
                    if (err || !docs) {
                        responseMessages.ErrorCode422(result);
                    } else {
                        for (let i = 0; i < cameraDocs.alarm.length; i++) {
                            if (cameraDocs.alarm[i]._id.toString() === alarmId) {
                                console.log(cameraDocs.alarm[i]);
                                cameraDocs.alarm[i].alarmName = newAlarmName;
                                cameraDocs.alarm[i].description = newDescription;
                                cameraDocs.alarm[i].alarmType = newAlarmType;
                                cameraDocs.alarm[i].alarmLevel = newAlarmLevel;
                                cameraDocs.alarm[i].save()
                                    .then(() => {
                                        responseMessages.SuccessCode200UpdateAlarm(result, newAlarmName, newDescription, newAlarmType, newAlarmLevel);
                                    })
                                    .catch(err => {
                                        console.warn(err);
                                        responseMessages.ErrorCode409DuplicateCamera(result);
                                    });
                            } else {
                                console.log("inside inside");
                                responseMessages.ErrorCode422(result);
                            }
                        }


                    }
                });
            }
        });
    } else {
        responseMessages.ErrorCode412(result);
    }
});
//Delete an alarm
router.delete("/:userName/:cameraName/:alarmId", checkAuth, (request, result) => {
    const userName = request.params.userName;
    const cameraName = request.params.cameraName;
    const alarmId = request.params.alarmId;

    User.findOne({name: userName}, function (err, docs) {
        if (err || docs === null) {
            responseMessages.ErrorCode412(result);
        } else {

            Camera.findOne({cameraName: cameraName}, function (err, cameraDocs) {
                if (err || cameraDocs.alarm.length == 0) {
                    console.log("inside");
                    responseMessages.ErrorCode422(result);
                } else {
                    for (let i = 0; i < cameraDocs.alarm.length; i++) {
                        console.log(cameraDocs.alarm[i]);
                        if (cameraDocs.alarm[i]._id.toString() === alarmId) {
                            cameraDocs.alarm.pull({
                                _id: alarmId,
                            });
                            responseMessages.SuccessCode204(result);
                            cameraDocs.save();
                        } else {
                            console.log("inside inside");
                            responseMessages.ErrorCode422(result);
                        }
                    }
                }
            });
        }
    });
});

module.exports = router;