var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var dbUrl = 'mongodb://localhost:27017/test';

var dbase;
var schoolCollection;
var classCollection;

MongoClient.connect(dbUrl, function (err, db) {
    debugger;
    if (!err) {
        debugger;
        console.log('connection is OK : ' + dbUrl);
        dbase = db;

        var school = require('./api/school')(app, dbase, mongodb);
        var classApi = require('./api/class')(app, dbase, mongodb);
        console.log('schoool module loaded :: ' + school);
        console.log('classApi module loaded :: ' + classApi);

    } else {
        console.log('Unable to connect to : ' + dbUrl + ' error: ' + err);
    }
});

app.use(express.static('public'));
console.log("__dirname:" + __dirname);

app.use(bodyParser.json()); // for parsing application/json


app.get('/', function (req, res) {
    console.log("app.get(/*) =========== " + req.url);
    res.sendFile(__dirname + '/public/' + req.url + '.html');
});

app.get('/api/maps/*', function (req, res) {
    console.log("app.get(/*) =========== " + req.url);
    debugger;
    var filePath = req.url.substring(req.url.indexOf('/maps/') + 6, req.url.length)
    console.log("app.get filePath(/*) =========== " + filePath);
    res.sendFile(__dirname + '/public/responses/' + filePath + '.json');
})


app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});
