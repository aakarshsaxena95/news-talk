/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function(){

	angular.module('newstalk')
		.factory('userService',['$http','$q',userService]);

	function userService($http,$q){
		return {
			getArticles : getArticles,
		};
		
		function getArticles(numsRecieved){
			return $http({
				method:'get',
				url:'/api/articles/'+parseInt(numsRecieved/10)
			})
			.then(sendResponse);
		}

		function sendResponse(response){
				return response.data;
		}
})()