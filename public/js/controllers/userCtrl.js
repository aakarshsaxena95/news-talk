angular.module("newstalk")
	.controller("UserController",["$scope","$http",function($scope,$http){
		$http.get('/api/readinglistlinks').then(function(response){
			console.log(response);
		});
	}]);