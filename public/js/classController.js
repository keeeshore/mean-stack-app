/**
 * Created by balank on 29/11/2016.
 */
controllers.controller('classController', ['$route','$scope', '$location',  '$http', 'API', function ($route,$scope, $location, $http, API) {

    console.log('classController loaded');

    var self = this;

    $scope.schools = [];

    $scope.classes = [];

    $scope.action = 'ADD';

    return {

        'getClasses': function (schoolId) {
            $scope.action = 'ADD';
            $scope.classes = [];
            $http.get(API.CLASS_GET_URL + '?schoolId='+schoolId).then(function (response, err) {
                console.log('get classes response ::' + response);
                if (response.data.classes.length > 0) {
                    $scope.classes = response.data.classes;
                } else {
                    $scope.classes = [];
                }
            }.bind(this));
        },

        'getSchools': function () {
            $http.get(API.SCHOOL_GET_URL).then(function (response, err) {
                console.log('api user get called' + response);
                $scope.schools = response.data.schools;
            });
        },

        'onEditClass': function (classObj) {
            $scope.class = angular.copy(classObj);
            $scope.action = 'UPDATE';
        },

        'deleteClass': function (classObj) {
            console.log('CLASS DELETE CALLED');
            $http.post(API.CLASS_DELETE_URL, classObj).then(function (response, err) {
                if (response.data.success) {
                    this.getClasses($scope.class.schoolId);
                    $scope.class.std = null;
                    $scope.class.teacherId = null;
                }
            }.bind(this));
        },

        'submitClass': function () {
            var ACTION_URL = $scope.action === 'UPDATE' ? API.CLASS_UPDATE_URL : API.CLASS_ADD_URL;
            if (!$scope.class.schoolId) {
                alert('no school selected!');
                return;
            }
            $scope.class.schoolId = $scope.class.schoolId;
            console.log('CLASS ADD CALLED');
            $http.post(ACTION_URL, $scope.class).then(function (response, err) {
                if (response.data.success) {
                    this.getClasses($scope.class.schoolId);
                    $scope.class.std = null;
                    $scope.class.teacherId = null;
                }
            }.bind(this));
        }
    }

}]);
