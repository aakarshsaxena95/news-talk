angular.module('newstalk')
	.controller("ReadingListController",['$scope','$http','dataService',function($scope,$http,dataService){
			dataService.getReadingList($scope.userid)
			.then(getArticlesSuccess);
		function getArticlesSuccess(articles){
			$scope.articles = articles.articles;
			console.log(articles);
	}
	$scope.removeFromReadingList = function(id,userid){
		console.log("In remove");
		popArticle(id);
		dataService.removeFromReadingList(id,userid);
	}
	var popArticle = function(id){
		$scope.articles.forEach(function(article){
			if(article && article._id === id){
				$scope.articles.splice($scope.articles.indexOf(article),1);
			}
		});
	}
}]);