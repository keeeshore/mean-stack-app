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
            'name': 'India',
            'zoom': 4,
            'center': {lat: 77, lng: 35}
        },
        {
            'url': 'africa',
            'name': 'Africa',
            'zoom': 2,
            'center': {lat: 6, lng: 6}
        },
        {
            'url': 'google-map-data',
            'name': 'Google',
            'zoom': 5,
            'center': {lat: -28, lng: 137 }
        },
        {
            'url': 'australia',
            'name': 'Aus',
            'zoom': 2,
            'center': {lat: -23, lng: 132 }
        },
        {
            'url': 'world',
            'name': 'world',
            'zoom': 4,
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

        'scaleMap': function (val) {
            $scope.mapData.options.zoom = $scope.mapData.options.zoom + val;
            this.drawMap($scope.mapData.options);
        },

        'getMapData': function (mapIndex) {
            var options = angular.merge({}, $scope.maps[mapIndex]);
            $http.get('api/maps/' + options.url).then(function (response, err) {
                if (response.data.features)
                $scope.mapData = response.data;
                $scope.mapData.options = options;
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

            var scale = options.zoom || 1;
            context.setTransform(1, 0, 0, 1, 0, 0);
            // Will always clear the right space
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //context.restore();
            context.translate(this.canvas.width/2, this.canvas.height/2);
            context.scale(scale, scale * -1);

            context.fillStyle="#CCC";
            context.fillRect(0, 0,this.canvas.width, this.canvas.height);

            angular.forEach($scope.mapData.features, function (feature, key) {
                var coordinates = feature.geometry.coordinates;

                angular.forEach(coordinates, function (coordinate) {
                    context.beginPath();
                    context.lineWidth = 1;
                    context.strokeStyle = 'black';
                    angular.forEach(coordinate, function (point, indexId) {
                        var x = point[0];
                        var y = point[1];
                        console.log(x + ' : ' + y);
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