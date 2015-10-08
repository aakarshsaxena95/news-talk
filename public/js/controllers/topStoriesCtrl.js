angular.module('newstalk')
	.controller("TopStoriesController",
		['$scope','$http','dataService',function($scope,$http,dataService){
				dataService.getTopStories()
					.then(getArticlesSuccess);
				function getArticlesSuccess(articles){
					$scope.articles = articles.articles;
					console.log(articles);
				}
			}
		]
	);