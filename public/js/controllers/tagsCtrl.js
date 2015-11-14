
angular.module('newstalk')
	.controller("tagsController",["$scope","$http",function($scope,$http){
		
		$http.get('/api/tags/list')
		.then(function(response){
			console.log(response.data);
			$scope.tagsdata = response.data;
		});
	
	}]);