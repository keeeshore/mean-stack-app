/**
 * Created by balank on 07/12/2016.
 */
controllers.controller('mapController', ['$route','$scope', '$location', '$http', function ($route, $scope, $location, $http) {

    console.log('mapController loaded');

    $scope.mapData = {};

    $scope.selectedMapIndex = 1,

    $scope.maps = [
        {
            'url': 'test',
            'name': 'Test',
            'center': {lat: 0, lng: 0}
        },
        {
            'url': 'africa',
            'name': 'Africa',
            'center': {lat: 6, lng: 6}
        },
        {
            'url': 'google-map-data',
            'name': 'Google',
            'center': {lat: -28, lng: 137 }
        },
        {
            'url': 'australia',
            'name': 'Aus',
            'center': {lat: -23, lng: 132 }
        },
        {
            'url': 'world',
            'name': 'world',
            'center': {lat: 0, lng: 0}
        }
    ];

    $scope.axisPoints = [];

    var i = 0;
    while (i < 70) {
        $scope.axisPoints.push({
            'val': i
        });
        i++;
    };


    return {

        'context': null,

        'canvas': null,

        'minX': 0,

        'maxX': 0,

        'minY': 0,

        'maxY': 0,

        'getMapData': function (mapIndex) {
            var options = angular.merge({'zoom': 2}, $scope.maps[mapIndex]);
            $http.get('api/maps/' + options.url).then(function (response, err) {
                $scope.mapData = response.data;
                this.drawMap(options);
            }.bind(this));
        },

        'drawMap': function (options) {
            debugger;

            this.canvas = document.getElementById('canvas');
            this.context = this.canvas.getContext("2d");

            var context = this.context;
            this.getBoundings();

            console.log('minX:', this.minX ,'maxX:', this.maxX);
            console.log('minY:', this.minY ,'maxY:', this.maxY);

            //context.rotate(25 * Math.PI / 180);
            var scale = 4;
            var startX = this.minX < 0 ? this.minX * (scale * -1) : this.minX * scale;
            var startY = this.minY < 0 ? this.minY * (scale * -1) : this.minY * scale;

            startX = this.minX * scale;
            if (startX < 0) {
                startX = startX * -1;
            }
            if (startX > this.minX) {
                startX = 0;
            }

            startY = this.minY * scale;
            if (startY < 0) {
                startY = startY * -1;
            }

            if (startY > this.minY) {
                startY = 0;
            }

            console.log('startX:', startX ,'startY:', startY);

            //context.translate(startX, startY);
            //context.scale(scale, scale * -1);

            //context.translate(-380, -180);
            //context.scale(0, 0);


            //context.translate(200, 200);

            /*context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.moveTo(this.minX , this.minY);
            context.lineTo(this.maxX , this.maxY);
            context.stroke();*/

            //context.fillStyle="#CCC";
            //context.fillRect(0,0,this.canvas.width, this.canvas.height);

            angular.forEach($scope.mapData.features, function (feature, key) {
                var coordinates = feature.geometry.coordinates;

                angular.forEach(coordinates, function (coordinate) {
                    context.beginPath();
                    context.lineWidth = 1;
                    context.strokeStyle = 'black';
                    angular.forEach(coordinate, function (point, indexId) {
                        var x = point[0];
                        var y = point[1];

                        x = x/190 * 600;
                        y = y/90 * 300;

                        console.log(x + ' : ' + y);
                        context.font = "14px serif";
                        context.fillText(x + ' <> ' + y, x.toFixed(2) , y.toFixed(2));

                        if (indexId === 0) {
                            context.moveTo(x , y);
                        } else {
                            context.lineTo(x , y);
                        }


                        context.stroke();
                    });
                    context.closePath();
                });

            });





        },

        'getBoundings': function () {
            var scope = this;
            angular.forEach($scope.mapData.features, function (feature, key) {
                angular.forEach(feature.geometry.coordinates, function (coordinate) {
                    angular.forEach(coordinate, function (point, indexId) {
                        var x = point[0];
                        var y = point[1];
                        if (indexId === 0) {
                            if (!scope.minX) {
                                scope.minX = x;
                            }
                            if (!scope.minY) {
                                scope.minY = y;
                            }
                            if (!scope.maxX) {
                                scope.maxX = x;
                            }
                            if (!scope.maxY) {
                                scope.maxY = y;
                            }
                        }
                        scope.minX = x < scope.minX ? x : scope.minX;
                        scope.minY = y < scope.minY ? y : scope.minY;
                        scope.maxX = x > scope.maxX ? x : scope.maxX;
                        scope.maxY = y > scope.maxY ? y : scope.maxY;
                    });
                });

            });
        }

    }

}]);