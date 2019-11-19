const moment = require("moment");

function ErrorCode401(result) {
    result.status(401).json({
        code: 401,
        message: "Unauthorized to execute this action",
        datetime: moment().format()
    });
}

function ErrorCode401Auth(result) {
    result.status(401).json({
        code: 401,
        message: "Authentication failed",
        datetime: moment().format()
    });
}

function ErrorCode404(result) {
    result.status(404).json({
        code: 404,
        message: "Not found, Document does not exist",
        datetime: moment().format()});
}

function ErrorCode409DuplicateUser(result) {
    result.status(409).json({
        code: 409,
        message: "Conflict, User already exists",
        datetime: moment().format()})
}

function ErrorCode409DuplicateCamera(result) {
    result.status(409).json({
        code: 409,
        message: "Conflict, Camera already exists",
        datetime: moment().format()})
}

function ErrorCode412(result) {
    result.status(412).json({
        code: 412,
        message: "Een of meer properties in de request body ontbreken of zijn foutief",
        datetime: moment().format("Y-mm-D:hh:mm:ss")
    });
}

function ErrorCode412SameValues(result) {
    result.status(412).json({
        code: 412,
        message: "Current and new values are not allowed to the be same",
        datetime: moment().format()
    });
}

function ErrorCode422(result) {
    result.status(422).json({
        code: 422,
        message: "Unprocessable entity",
        datetime: moment().format()
    });
}

function SuccessCode200User(result, username, newPassword) {
    result.status(200).json({
        code: 200,
        message: {username: username, password: newPassword,},
        datetime: moment().format()
    });
}

function SuccessCode200GetAll(result, docs) {
    result.status(200).json({
        code: 200,
        results: docs,
        datetime: moment().format()
    });
}

function SuccessCode200Auth(result, token, docs) {
    result.status(200).json({
        code: 200,
        results: docs,
        token: token,
        datetime: moment().format()
    });
}

function SuccessCode200UpdateCamera(result, cameraName, location) {
    result.status(200).json({
        code: 200,
        message: {cameraName: cameraName, location: location,},
        datetime: moment().format()
    });
}

function SuccessCode200UpdateAlarm(result, newAlarmName, newDescription, newAlarmType, newAlarmLevel) {
    result.status(200).json({
        code: 200,
        message: {newAlarmName: newAlarmName, newDescription: newDescription, newAlarmType: newAlarmType, newAlarmLevel: newAlarmLevel,},
        datetime: moment().format()
    });
}


function SuccessCode201User(result, username, password) {
    result.status(201).json({
        code: 201,
        message: {username: username, password: password,},
        datetime: moment().format()
    });
}

function SuccessCode201Camera(result, cameraName, location, company, building, angle) {
    result.status(201).json({
        code: 201,
        message: {cameraName: cameraName, location: location, company: company, building: building, angle: angle,},
        datetime: moment().format()});
}

function SuccessCode201Alarm(result, alarmName, cameraName, alarmType, alarmLevel) {
    result.status(201).json({
        code: 201,
        message: {cameraName: cameraName, alarmName: alarmName, alarmType: alarmType, alarmLevel: alarmLevel ,},
        datetime: moment().format()
    });
}

function SuccessCode204(result) {
    result.status(204).end();
}

module.exports = {
    ErrorCode401,
    ErrorCode401Auth,
    ErrorCode404,
    ErrorCode409DuplicateUser,
    ErrorCode409DuplicateCamera,
    ErrorCode412,
    ErrorCode412SameValues,
    ErrorCode422,
    SuccessCode200User,
    SuccessCode201Camera,
    SuccessCode200GetAll,
    SuccessCode200Auth,
    SuccessCode200UpdateCamera,
    SuccessCode200UpdateAlarm,
    SuccessCode201User,
    SuccessCode201Alarm,
    SuccessCode204
};