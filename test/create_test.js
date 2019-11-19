const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../src/user');
const Camera = require('../src/company');

describe('Create Endpoints', () => {
    it('Create a User', (done) => {
        request(app)
            .post('/user')
            .send({
                "username": "Jim",
                "email": "jimvanzuidam@gmail.com",
                "password": "Admin123"
            })
            .end((err, res) => {
                User.find()
                    .then((user) => {
                        assert(user[0].name === 'Jim');
                        assert(user[0].email === "jimvanzuidam@gmail.com");
                        assert(user[0].password === "Admin123");
                        done();
                    })
            });
    });

    it('Create a User with no body params', (done) => {
        request(app)
            .post('/user')
            .send({}).expect(412).end(done);

    });

    it('Create a User with wrong body params', (done) => {
        request(app)
            .post('/user')
            .send({
                "": "test",
                "email": "henkie@ henkie",
                "password": "123456",
            }).expect(412).end(done);

    });

    it('Create a Camera', (done) => {
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
                        Camera.find()
                            .then((camera) => {
                                assert(camera[0].cameraName === "Camera1");
                                assert(camera[0].location === "Sleeuwijk");
                                done();
                            })
                    })
            });
    });

    it('Create a Camera with no body params', (done) => {
        request(app)
            .post('/camera')
            .send({}).expect(412).end(done);

    });

    it('Create a Camera with wrong body paramss', (done) => {
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
                        "cameraName": "Camera1",
                        "location": "Sleeuwijk"
                    }).expect(412).end(done);
            });
    });

    it('Create a Alarm on a Camera', (done) => {
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
                                "username": "Jim",
                                "cameraName": "Camera1",
                                "alarmName": "Alarm1",
                                "description": "This is a test alarm",
                                "alarmType": "intrusion",
                                "alarmLevel": "High"
                            })
                            .end((err, res) => {
                                Camera.find()
                                    .then((camera) => {
                                        assert(camera[0].cameraName === "Camera1");
                                        assert(camera[0].alarm[0].description === "This is a test alarm");
                                        assert(camera[0].alarm[0].alarmType === "intrusion");
                                        assert(camera[0].alarm[0].alarmLevel === "High");
                                        done();
                                    }).catch((err) => {
                                    console.error("Handling promise rejection", err);
                                });
                            })
                    })
            });
    });

    it('Create a Alarm on a Camera With no body params', (done) => {
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
                            .send({}).expect(412).end(done);

                    })
            });
    });

    it('Create a Alarm on a Camera With wrong body params', (done) => {
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
                                "username": "",
                                "cameraName": "Camera1",
                                "alarmName": "Alarm1",
                                "description": "This is a test alarm",
                                "alarmType": "intrusion",
                                "alarmLevel": "High"
                            }).expect(422).end(done);

                    })
            });
    });


});
