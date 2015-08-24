var app = angular.module('newstalk',[])
app.controller("articleCtrl",function($scope,$http){
	$scope.a = 1;
	$http.get('/api/articles/1').
	  success(function(response) {
	    $scope.articles = response;
	    console.log(response);
	  });
});