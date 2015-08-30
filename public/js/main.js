var app = angular.module('newstalk',['infinite-scroll']);


app.controller("ArticleController",['$scope','$http','dataService',function($scope,$http,dataService){
	$scope.articles = {articles:[]};
	$scope.reachedEnd = false;
	$scope.getArticles = function(){
		console.log($scope.reachedEnd)
		if(!$scope.reachedEnd)
		dataService.getArticles($scope.articles.articles.length)
			.then(getArticlesSuccess);
		};

	function getArticlesSuccess(articles){
		articles.articles.forEach(function(article){
			$scope.articles.articles.push(article);
		});
		$scope.reachedEnd = articles.reachedEnd;
		console.log($scope.reachedEnd+"in getArticlesSuccess");
	}

	$scope.addToReadingList = function(id,userid){
		console.log("Clicked on add to reading list");
		dataService.addToReadingList(id,userid);
	};

	$scope.commentForm = function(id,userid,contents) {
		dataService.postComments(id,userid,contents);
		console.info(contents);
	}	
}]);


