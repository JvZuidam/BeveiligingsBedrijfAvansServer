/*******************************************************
 * Copyright (C) 2018-2019 Jim van Zuidam 2127317
 *
 * This file is part of ClientSideProgrammingIndividueel.
 *
 * ClientSideProgrammingIndividueel can not be copied and/or distributed without the express
 * permission of Jim van Zuidam
 *******************************************************/

const mongoose = require('mongoose');
const envVar = 'production';

mongoose.Promise = global.Promise;

if (envVar === 'testCloud' ||envVar === 'production') {
    mongoose.connect('mongodb+srv://admin:MwQtYCZofQEsM7n6@beveiligingscluster0-74li9.mongodb.net/securitydb?retryWrites=true&w=majority',
        {useNewUrlParser: true})
        .then(() => {
            console.log("MongoDB Cloud connected")
        })
        .catch(err => console.log(err));
}
else if (envVar === 'test') {
    mongoose.connect('mongodb://localhost/alarmsystem',
        {useNewUrlParser: true})
        .then(() => {
            console.log("MongoDB Local connected")
        })
        .catch(err => console.log(err));
}

mongoose.connection
    .once('open', () => { 
        console.log('Connection opened');
    })
    .on('error', (error) => {
        console.warn('Warning', error);
    });

module.exports =  mongoose;