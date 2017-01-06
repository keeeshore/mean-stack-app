/**
 * Created by balank on 29/11/2016.
 */
controllers.controller('schoolController', ['$route','$scope', '$location',  '$http', 'API', function ($route,$scope, $location, $http, API) {

    console.log('schoolController loaded');

    $scope.schools = [];

    $scope.school = {
        'action': 'ADD'
    };

    return {
		
		'facebookUpdate': function () {
			console.log('facebook update test');
			$http.get('api/update/posts').then(function (response) {
		 		console.log('response --- ' + response);
		 	});
		},

        'submitSchool': function (obj) {
            debugger;
            console.log('submit school called');
            //$scope.schools.push($scope.school);
            //TODO: validations;
            if ($scope.school.action === 'UPDATE')  {
                this.updateSchool();
            } else {
                this.addSchool();
            }

        },

        'onEditSchool': function (schoolObj) {
            $scope.school = angular.copy(schoolObj);
            $scope.school.action = 'UPDATE';
        },

        'addSchool': function () {
            $http.post(API.SCHOOL_ADD_URL, $scope.school).then(function (response, err) {
                console.log('ADD school response ::' + response);
                if (response.data.success) {
                    $scope.school = {};
                    this.getSchools();
                }
            }.bind(this));
        },

        'deleteSchool': function (schoolObj) {
            console.log('calling DELETE schoolAPI ::' + JSON.stringify(schoolObj));
            $http.post(API.SCHOOL_DELETE_URL, schoolObj).then(function (response, err) {
                if (response.data.success) {
                    $scope.school = {};
                    this.getSchools();
                }
            }.bind(this));
        },

        'updateSchool': function () {
            $http.post(API.SCHOOL_UPDATE_URL, $scope.school).then(function (response, err) {
                console.log('UPDATE school response ::' + response);
                if (response.data.success) {
                    $scope.school = {};
                    this.getSchools();
                }
            }.bind(this));
        },

        'getSchools': function () {
            $http.get(API.SCHOOL_GET_URL).then(function (response, err) {
                debugger;
                console.log('GET school response ::' + response.data);
                $scope.schools = response.data.schools;
				$scope.facebookData = response.data.facebookData[0];
            });
        }
    };

}]);
