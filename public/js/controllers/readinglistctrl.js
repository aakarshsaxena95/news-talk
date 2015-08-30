angular.module('newstalk')
	.controller("ReadingListController",['$scope','$http','dataService',function($scope,$http,dataService){
			dataService.getReadingList($scope.userid)
			.then(getArticlesSuccess);
		function getArticlesSuccess(articles){
			$scope.articles = articles.articles;
			console.log(articles);
	}
}]);