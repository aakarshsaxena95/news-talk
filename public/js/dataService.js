(function(){

	angular.module('newstalk')
		.factory('dataService',['$http','$q',dataService]);
	
	function dataService($http,$q){
		return {
			getArticles : getArticles,
			postComments : postComments,
			addToReadingList : addToReadingList,
			getReadingList : getReadingList,
			upvote : upvote,
			downvote : downvote,
			getComments : getComments,
			removeFromReadingList : removeFromReadingList,
			deleteComment : deleteComment,
			upvoteComment:upvoteComment,
			downvoteComment: downvoteComment,
			addCommentOnComment:addCommentOnComment
		};

		function getArticles(numsRecieved){
			return $http({
				method:'get',
				url:'/api/articles/'+parseInt(numsRecieved/10)
			})
			.then(sendResponse);
		}
		
		function deleteComment(commentId,articleId){
			$http.delete('/api/delete/comment/'+commentId+'/'+articleId)
				.then(function(response){console.log(response);});
		}
		
		function sendResponse(response){
				return response.data;
		}

		function sendResponseComments(response){
				return response.data;
		}

		function postComments(id,user,contents){
			var uid = user._id;
			var uname=user.name;
			var c =  contents;
			var data = {
				content: c,
				id: uid,
				name:uname
			};
			console.log(data);
			return $http.post('/api/article/'+id,data).then(sendResponse);
		}
		function addToReadingList(id,userid){
			var data = {
				id: id,
				user: userid
			};
			$http.post('/api/user/add/'+userid,data);	
		}

		function removeFromReadingList(id,userid){
			var data = {
				id: id,
				user: userid
			};
			$http.post('/api/user/rem/'+userid,data);	
		}

		function getReadingList(userid){
			console.log('/api/readinglist/0');
			return $http({
				method:'get',
				url:'/api/readinglist/0'
			})
			.then(sendResponse);
		}			
		function upvote(id){
			return $http({
				method:'post',
				url:'/api/article/up/'+id
			});
		}
		function upvoteComment(id){
			return $http({
				method:'post',
				url:'/api/comment/up/'+id
			});
		}
		function downvote(id){
			return $http({
				method:'post',
				url:'/api/article/down/'+id
			});
		}
		function downvoteComment(id){
			return $http({
				method:'post',
				url:'/api/comment/down/'+id
			});
		}
		function getComments(id){
			return $http({
				method:'get',
				url:'/api/article/comments/'+id
			})
			.then(sendResponseComments);
		}
		function addCommentOnComment(id,data){
			return $http({
				method:'post',
				url:'/api/comment/add/:id',
				data:data
			}).then(sendResponse);
		}
	}
})();