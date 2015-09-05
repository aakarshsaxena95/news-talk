var app = angular.module('newstalk',['infinite-scroll']);

app.controller("ArticleController",['$scope','$http','dataService',function($scope,$http,dataService){

	$scope.comments={};
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
	$scope.upvote = function(id){
		dataService.upvote(id);
	}

	$scope.showComments = function(id){
		dataService.getComments(id).then(function(data){
			$scope.comments[id] = data.comments;
			console.log($scope.comments);
		});
	}

	$scope.commentForm = function(id,user,contents) {
		dataService.postComments(id,user,contents);
	}
}]);

app.filter('filterId', function(){
    return function(collection, id) {
        var output = [];
        angular.forEach(collection, function(item) {
            if(item.id == id) {
                output.push(item[id])
            }
        })
        return output;
    }
});