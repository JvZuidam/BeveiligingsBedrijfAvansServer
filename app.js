const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const db = require("./dbcon");

app.use("/user", require("./routes/user"));
app.use("/camera", require("./routes/camera"));
app.use("/alarm", require("./routes/alarm"));
app.use(cors());

app.get("*", (request, result) => {
    result.status(404);
    result.json("Unknown route");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => {
    console.log('Running on port ' + port);
    console.log("*******************************************************");
    console.log("* Copyright (C) 2018-2019 Jim van Zuidam 2127317");
    console.log("*");
    console.log("* This file is part of ClientSideProgrammingIndividueel.");
    console.log("*");
    console.log("* ClientSideProgrammingIndividueel can not be copied and/or distributed without the express");
    console.log("* permission of Jim van Zuidam");
    console.log("*******************************************************");
});

module.exports = app;