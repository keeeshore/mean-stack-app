/**
 * Created by balank on 5/12/2016.
 */
module.exports = function (app, dbase, mongodb) {


    var schoolCollection = dbase.collection('schoolcollection');
    var postsCollection = dbase.collection('postscollection');
    var classCollection = dbase.collection('classcollection');

    return function () {

        console.log('INIT SCHOOL API');
		
		app.get('/api/update/posts', function (req, res) {
			console.log("GET----------------- api/update/get =========== " + req.body);
			var https = require('https');

			var optionsget = {
				host : 'graph.facebook.com',
				port : 443,
				path : '/v2.8/vimonishaExhibitions?access_token=EAAG6qlC4FlIBAOS6Wr3U21yYYy8cE84MqiycZAQ84Bhx2wn7NxKjZAVdsQXLwG0QxPnpba13WxChQmESmgFdwnvxR77qmuprryZAXkvPlRewpqnh4uX7AhZAQVdhrK3nhnvITrp6yXgPZBHqMZBDkVpxHcKQH9QvnDjXiA7yVoIwZDZD&debug=all&fields=app_id%2Cposts&format=json&method=get&pretty=0&suppress_http_code=1', // the rest of the url with parameters if needed
				method : 'GET'
			};

			console.info('Options prepared:');
			console.info(optionsget);

			var rawData = '';

			// do the GET request
			var reqGet = https.request(optionsget, function(resp) {
				console.log("statusCode: ", resp.statusCode);
				resp.on('data', function(chunk) {
					console.log("chunk=========: ", chunk);
					rawData += chunk;
				});

				resp.on('end', function(chunk) {
					console.log("full rawData =========: ", rawData);
					
					try {
						var jsonData = JSON.parse(rawData);
						res.json(jsonData);
						postsCollection.insert(jsonData);
					} catch (error) {
						res.json({'error': 'unable to parse...custom error'});
					}
				});

			});

			reqGet.end();
			reqGet.on('error', function(e) {
				console.error(e);
			});

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
			var schools = {};
			var posts = {};
            schoolCollection.find().toArray(function(err, docs) {
                console.log('console.log::schoolCollection find().toArray()-----------' + docs);
				var schools = docs;
                //res.json({'schools': docs});
				postsCollection.find().toArray(function(err, docs) {
					console.log('console.log::postsCollection find().toArray()-----------' + docs);
					var posts = docs;
					//res.json({'posts': docs});
					res.json({'schools': schools, 'facebookData': posts});
				});
            });
			
			 
			
			
        });

    }();



};