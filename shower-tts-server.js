#!/usr/bin/env node
const say = require('say');
const express = require('express');

const argv = require('optimist').argv;

const app = express();

const PORT = argv.port || 23921;

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/say', (req, res) => {
    say.speak(req.query.text)
    res.send({ "status": "1" })
    console.log('i say text')
});

app.get('/stop', (req, res) => {
    say.stop();
    res.send({ "status": "0" })
    console.log('i shut upped')
});

app.listen(PORT, (err, res) => {
    console.log('server started. adress: http://127.0.0.1:' + PORT)

});