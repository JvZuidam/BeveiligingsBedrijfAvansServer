const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../src/user');
const Camera = require('../src/company');

describe('Updating Endpoints', () => {
    it('Update User', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .put('/user')
                    .send({
                        "username" : "Jim",
                        "password" : "Admin123",
                        "newPassword" : "NewAdmin123"
                    })
                    .end((err, res) => {
                        User.findOne({ "name" : "Jim" })
                            .then((user) => {
                                assert(user.password === "NewAdmin123");
                                done();
                            });
                    })
            })
    });

    it('Update User where old and new values are the same', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .put('/user')
                    .send({
                        "username" : "Jim",
                        "password" : "NewAdmin123",
                        "newPassword" : "NewAdmin123"
                    }).expect(412).end(done);
            })
    });

    it('Update User where user does not exist', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .put('/user')
                    .send({
                        "username" : "Jamie",
                        "password" : "Admin123",
                        "newPassword" : "NewAdmin123"
                    }).expect(422).end(done);
            })
    });

    it('Update User who does not have permission to do so', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .put('/user')
                    .send({
                        "username" : "Jim",
                        "password" : "Admin1234",
                        "newPassword" : "NewAdmin123"
                    }).expect(401).end(done);
            })
    });


    it('Update Camera', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .post('/camera')
                    .send({
                        "username" : "Jim",
                        "cameraName" : "Camera2",
                        "location": "Sleeuwijk"
                    })
                    .end((err, res) => {
                        request(app)
                            .put('/camera')
                            .send({
                                "username" : "Jim",
                                "cameraName" : "Camera2",
                                "newCameraName" : "Camera3",
                                "newLocation" : "Gorinchem"
                            })
                            .end((err, res) => {
                                Camera.findOne({ "cameraName" : "Camera3" })
                                    .then((user) => {
                                        assert(user.cameraName === "Camera3");
                                        assert(user.location === "Gorinchem");
                                        done();
                                    });
                            })
                    })
            })
    });

    it('Update Camera where old and new values are the same', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .post('/camera')
                    .send({
                        "username" : "Jim",
                        "cameraName" : "Camera2",
                        "location": "Sleeuwijk"
                    })
                    .end((err, res) => {
                        request(app)
                            .put('/camera')
                            .send({
                                "username" : "Jim",
                                "cameraName" : "Camera2",
                                "newCameraName" : "Camera2",
                                "newLocation" : "Sleeuwijk"
                            }).expect(412).end(done);
                    })
            })
    });

    it('Update Camera where camera does not exist', (done) => {
        request(app)
            .post('/user')
            .send({
                "username" : "Jim",
                "email" : "jimvanzuidam@gmail.com",
                "password" : "Admin123"
            })
            .end((err, res) => {
                request(app)
                    .post('/camera')
                    .send({
                        "username" : "Jim",
                        "cameraName" : "Camera2",
                        "location": "Sleeuwijk"
                    })
                    .end((err, res) => {
                        request(app)
                            .put('/camera')
                            .send({
                                "username" : "Jim",
                                "cameraName" : "Camera3",
                                "newCameraName" : "Camera4",
                                "newLocation" : "Gorinchem"
                            }).expect(422).end(done);
                    })
            })
    });
});
