const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlarmSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    camera: {
        type: mongoose.Schema.ObjectId,
        ref: 'camera',
        required: [true, 'Company is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    DateTime: {
        type: Date,
        required: [true, 'Date is required']
    },
    alarmType: {
        type: String,
        required: [true, 'The type of alarm is required']
    },
    alarmLevel: {
        type: String,
        required: [true, 'The level of the alarm is required']
    },
    resolved: {
        type: Number,
        required: [true, 'Resolved is required'],
        default: 0

    }
});

const CameraSchema = new Schema({
    cameraName: {
        type: String,
        unique: [true, 'CameraName must be unique'],
        required: [true, 'CameraName is required']
    },
    location: {
      type: String,
        required: [true, "Location is required"]
    },
    building: {
        type: String,
        required: [true, "Building is required"]
    },
    angle: {
        type: Number,
        required: [true, "Angle is required"]
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'company'
    },
    alarm: [AlarmSchema],
});

const CompanySchema = new Schema({
    companyName: {
        type: String,
        unique: [true, 'companyName must be unique'],
        required: [true, 'companyName is required']
    },
    companyAddress: {
        type: String,
        required: [true, "companyAddress is required"]
    },
    Descripion: {
        type: String,
        required: [true, "Descripion is required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    alarm: [CameraSchema],
});

const Company = mongoose.model('company', CompanySchema);

module.exports = Company;