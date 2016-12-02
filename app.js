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
        schoolCollection = dbase.collection('schoolcollection');
        classCollection = dbase.collection('classcollection');
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


app.post('/api/schools/add', function (req, res) {
    console.log("POST----------------- api/schools/add =========== " + req.body);
    schoolCollection.insert({
        'name': req.body.name,
        'type': req.body.type,
        'head': req.body.head
    }, function (err, db){
        if (err) {
            console.log('failed to add school');
        }
        res.json({'success': true});
    });
});

app.post('/api/schools/delete', function (req, res) {
    console.log("POST----------------- api/schools/delete =========== " + JSON.stringify(req.body));
    var _id = new mongodb.ObjectId(req.body._id);
    schoolCollection.findOneAndDelete({'_id': _id }, function (err, db){
        if (err) {
            console.log('failed to add school');
        }
        res.json({'success': true});
    });
});

app.post('/api/schools/update', function (req, res) {
    console.log("POST----------------- api/schools/update =========== " + req.body);
    var _id = new mongodb.ObjectId(req.body._id);
    schoolCollection.update(
        {'_id': _id },
        {
            $set: {
                'name': req.body.name,
                'type': req.body.type,
                'head': req.body.head
            }
        },
        function (err, db){
            if (err) {
                console.log('failed to update school' + err);
            }
            res.json({'success': true});
        }
    );
});

app.get('/api/schools/get', function (req, res) {
    console.log("GET----------------- api/schools/add =========== " + req.body);
    schoolCollection.find().toArray(function(err, docs) {
        console.log('console.log::schoolCollection find().toArray()-----------' + docs);
        res.json({'schools': docs});
    });
});

app.get('/api/class/get', function (req, res) {
    debugger;
    console.log("GET CLASS----------------- api/class/get =========== " + JSON.stringify(req.params) + " ::: " + JSON.stringify(req.query));
    var schoolId = new mongodb.ObjectId(req.query.schoolId);
    classCollection.find({'schoolId': req.query.schoolId}).sort({'std': 1}).toArray(function(err, docs) {
        console.log('console.log::schoolCollection find().toArray()-----------' + docs);
        res.json({'classes': docs});
    });
});

app.post('/api/class/add', function (req, res) {
    console.log("ADD CLASS----------------- api/class/add =========== " + JSON.stringify(req.body));
    //var schoolId = new mongodb.ObjectId(req.body.schoolId);
    classCollection.insert({
        'std': req.body.std,
        'teacherId': req.body.teacherId,
        'schoolId': req.body.schoolId
    }, function (err, db){
        if (err) {
            console.log('failed to add school');
        }
        res.json({'success': true});
    });
});

app.post('/api/class/update', function (req, res) {
    console.log("UPDATE CLASS----------------- api/class/add =========== " + JSON.stringify(req.body));
    var _id = new mongodb.ObjectId(req.body._id);
    classCollection.update(
        {
            'schoolId': req.body.schoolId,
            '_id': _id
        },
        {
            $set: {
                'std': req.body.std,
                'teacherId': req.body.teacherId
            }
        }, function (err, db){
            if (err) {
                console.log('failed to edit school');
            }
            res.json({'success': true});
        }
    );
});

app.post('/api/class/delete', function (req, res) {
    console.log('DELETE CLASS----------------- api/class/add =========== ' + JSON.stringify(req.body));
    var _id = new mongodb.ObjectId(req.body._id);
    classCollection.findOneAndDelete(
        {
            '_id': _id
        }, function (err, db){
            if (err) {
                console.log('failed to edit school');
            }
            res.json({'success': true});
        }
    );
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
