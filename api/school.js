/**
 * Created by balank on 5/12/2016.
 */
module.exports = function (app, dbase, mongodb) {


    var schoolCollection = dbase.collection('schoolcollection');
    var classCollection = dbase.collection('classcollection');

    return function () {

        console.log('INIT SCHOOL API');

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

    }();



};