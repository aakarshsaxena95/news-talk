var app = angular.module('newstalk',[]);


app.controller("ArticleController",['$scope','$http','dataService',function($scope,$http,dataService){

	dataService.getArticles()
		.then(getArticlesSuccess);

	function getArticlesSuccess(articles){
		$scope.articles = articles;
	}
	console.log($scope.articles);
	$scope.commentForm = function(id,userid){
		console.log(userid);
		var uid = userid;
		var c =  this.contents;
		var data = {
			content: c,
			user: uid
		};
		console.log(data);
		$http.post('/api/article/'+id,data);
	};
}]);
