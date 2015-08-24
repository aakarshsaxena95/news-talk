var app = angular.module('newstalk',[])
app.controller("articleCtrl",function($scope,$http){
	$scope.a = 1;
	$http.get('/api/articles/0').
	  success(function(response) {
	    $scope.articles = response;
	    console.log(response);
	  });
});

app.directive("singlearticle",function(){
	return{
		restrict:'E',
		templateUrl:'views/one-article.html'
	}
})