(function(){

	angular.module('newstalk')
		.factory('dataService',['$http','$q',dataService]);
	
	function dataService($http,$q){
		return {
			getArticles : getArticles,
			postComments : postComments,
			addToReadingList : addToReadingList,
			getReadingList : getReadingList
		};

		function getArticles(numsRecieved){
			//console.log(numsRecieved);
			return $http({
				method:'get',
				url:'/api/articles/'+parseInt(numsRecieved/10)
			})
			.then(sendResponse);
		}

		function sendResponse(response){
				return response.data;
		}

		function postComments(id,userid,contents){
			console.log(userid);
			var uid = userid;
			var c =  contents;
			var data = {
				content: c,
				user: uid
			};
			console.log(data);
			$http.post('/api/article/'+id,data);
		}
		function addToReadingList(id,userid){
			var data = {
				id: id,
				user: userid
			};
			$http.post('/api/user/'+userid,data);	
		}
		function getReadingList(userid){
			console.log('/api/readinglist/0');
			return $http({
				method:'get',
				url:'/api/readinglist/0'
			})
			.then(sendResponse);
		}			
		
	}
})()