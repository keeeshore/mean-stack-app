/**
 * Created by balank on 29/11/2016.
 */
var angularApp = angular.module('angularApp', ['ngRoute', 'controllers']);
var controllers = angular.module('controllers', []);

angularApp.constant('API', {
    "SCHOOL_GET_URL": "api/schools/get",
    "SCHOOL_ADD_URL": "api/schools/add",
    "SCHOOL_UPDATE_URL": "api/schools/update",
    "SCHOOL_DELETE_URL": "api/schools/delete",
    "CLASS_GET_URL": "api/class/get",
    "CLASS_ADD_URL": "api/class/add",
    "CLASS_UPDATE_URL": "api/class/update",
    "CLASS_DELETE_URL": "api/class/delete"
});

angularApp.config(['$routeProvider', function ($routeProvider) {
    console.log('route provider init');
    $routeProvider.
        when('/school', {
            templateUrl: 'views/school-form.html',
            controller: 'schoolController'
        }).
        when('/class', {
            templateUrl: 'views/class-form.html',
            controller: 'classController'
        })
}]);