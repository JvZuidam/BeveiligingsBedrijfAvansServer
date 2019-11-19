const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require("../src/user");
const Camera = require("../src/company");

describe('Delete Endpoints', () => {
    it('Delete User', (done) => {
        request(app)
            .post('/user')
            .send({
                "username": "Jim",
                "email": "jimvanzuidam@gmail.com",
                "password": "Admin123"
            })
            .end((err, res) => {
                request(app).del('/user/Jim/Admin123').expect(204).end(done);
            });
    });

    it('Delete User that has no permission to do so', (done) => {
        request(app)
            .post('/user')
            .send({
                "username": "Jim",
                "email": "jimvanzuidam@gmail.com",
                "password": "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .del('/user/Jim/Admin1234').expect(401).end(done);
            });
    });


    it('Delete User that does not exist', (done) => {
        request(app).del('/user/Jim/Admin123').expect(422).end(done);

    });

    it('Delete Camera', (done) => {
        request(app)
            .post('/user')
            .send({
                "username": "Jim",
                "email": "jimvanzuidam@gmail.com",
                "password": "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .post('/camera')
                    .send({
                        "username": "Jim",
                        "cameraName": "Camera1",
                        "location": "Sleeuwijk"
                    })
                    .end((err, res) => {
                        request(app)
                            .del('/camera/Jim/Camera1').expect(204).end(done);
                    });
            });
    });

    it('Delete Camera that does not exist', (done) => {
        request(app).del('/user/Jim/Camera1').expect(422).end(done);

    });

    //TODO: This test currently doesn't run since you need the Id of alarm which you cannot get via test
    it('Delete an Alarm of a Camera', (done) => {
        request(app)
            .post('/user')
            .send({
                "username": "Jim",
                "email": "jimvanzuidam@gmail.com",
                "password": "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .post('/camera')
                    .send({
                        "username": "Jim",
                        "cameraName": "Camera1",
                        "location": "Sleeuwijk"
                    })
                    .end((err, res) => {
                        request(app)
                            .post('/alarm')
                            .send({
                                "username" : "Jim",
                                "cameraName" : "Camera1",
                                "alarmName" : "alarm1",
                                "description" : "This is a test alarm",
                                "alarmType" : "intrusion",
                                "alarmLevel" : "High"
                            })
                            .end((err, res) => {
                                request(app).del('/user/Jim/Camera1/alarm1').expect(404).end(done);
                            })
                    })
            });
    });

    it('Delete Alarm that does not exist', (done) => {
        request(app).del('/user/Jim/Camera1/5c0972be1a00385a0ccc00e9').expect(404).end(done);

    });

    it('Delete Alarm With wrong params', (done) => {
        request(app)
            .post('/user')
            .send({
                "username": "Jim",
                "email": "jimvanzuidam@gmail.com",
                "password": "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .post('/camera')
                    .send({
                        "username": "Jim",
                        "cameraName": "Camera1",
                        "location": "Sleeuwijk"
                    })
                    .end((err, res) => {
                        request(app)
                            .post('/alarm')
                            .send({
                                "username" : "Jim",
                                "cameraName" : "Camera1",
                                "alarmName" : "alarm1",
                                "description" : "This is a test alarm",
                                "alarmType" : "intrusion",
                                "alarmLevel" : "High"
                            })
                            .end((err, res) => {
                                request(app).del('/user/Jim/Camera1/alarm1').expect(404).end(done);
                            })
                    })
            });
    });
});