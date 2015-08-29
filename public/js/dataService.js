(function(){

	angular.module('newstalk')
		.factory('dataService',['$http','$q',dataService]);
	
	function dataService($http,$q){
		return {
			getArticles : getArticles
			// getComments : getComments
		};

		function getArticles(){
			console.log("yolo");
			return $http({
				method:'get',
				url:'/api/articles/0'
			})
			.then(sendResponse);
		}

		function sendResponse(response){
			console.log(response.data);
			return response.data;
		}
	}

})()