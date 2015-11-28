/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('newstalk')
	.controller("topStoriesController",["$scope","$http","dataService",function($scope,$http,dataService){
		$scope.content = {
			day:{articles:[]},
			week:{articles:[]},
			month:{articles:[]},
			all:{articles:[]}
		};
		$scope.addToReadingList = function(id,userid){
		dataService.addToReadingList(id,userid);
		toastr.success("Article added to your reading list!");
	};

	$scope.removeFromReadingList = function(id,userid){
		dataService.removeFromReadingList(id,userid);
	};

	$scope.upvote = function(id,userid){
		upvoteIncrementer(id,userid);
		dataService.upvote(id);
	};
	
	var upvoteIncrementerComment = function(commentId,articleId,userid){
		$scope.articles.articles.forEach(function(article){
			if(article._id === articleId){
				article.fetchedComments.forEach(function(comment){
					if(comment._id === commentId && comment.votes.up.indexOf(userid)<0)
						comment.votes.down.splice(comment.votes.down.indexOf(userid),1);
						comment.votes.up.push(userid);
				});
			}
		});
	};	
	
	var downvoteIncrementerComment = function(commentId,articleId,userid){
		$scope.articles.articles.forEach(function(article){
			if(article._id === articleId){
				article.fetchedComments.forEach(function(comment){
					if(comment._id === commentId && comment.votes.down.indexOf(userid)<0)
						comment.votes.up.splice(comment.votes.up.indexOf(userid),1);
						comment.votes.down.push(userid);
				});
			}
		});
	};	
	
	$scope.upvoteComment = function(commentId,articleId,userid){
		upvoteIncrementerComment(commentId,userid);
		dataService.upvoteComment(commentId);
	};
	
	$scope.downvoteComment = function(commentId,articleId,userid){
		downvoteIncrementerComment(commentId,userid);
		dataService.downvoteComment(commentId);
	};
	
	$scope.deleteComment = function(commentId,articleId){
		dataService.deleteComment(commentId,articleId);
		$scope.articles.articles.forEach(function(article){
			if(article._id === articleId){
				article.fetchedComments.forEach(function(comment){
					if(comment._id === commentId)
						article.fetchedComments.splice(article.fetchedComments.indexOf(comment,1));
				});
			}
		});
		
	};

	var upvoteIncrementer = function(id,userid){
		$scope.content[$scope.timeLimit].articles.forEach(function(article){
			if(article.votes.up.indexOf(userid)>-1){
				article.votes.set = true;
			}
			if(article && article._id === id && !article.votes.set){
				if(article.votes.down.indexOf(userid)>-1){
					article.votes.down.splice(article.votes.down.indexOf(userid));
				}
				article.votes.up.push(userid);
				article.votes.set = true;
			}
		});
	};	

	$scope.downvote = function(id,userid){
		downvoteIncrementer(id,userid);
		dataService.downvote(id);
	}

	var downvoteIncrementer = function(id,userid){
		$scope.content[$scope.timeLimit].articles.forEach(function(article){
			if(article.votes.down.indexOf(userid)>-1){
				article.votes.set = true;
			}
			if(article && article._id === id && !article.votes.set){
				if(userid in article.votes.up){
					article.votes.up.splice(article.votes.up.indexOf(userid));
				}
				article.votes.down.push(userid);
				article.votes.set = true;
			}
		});
	};


	$scope.showComments = function(id){
		dataService.getComments(id).then(function(data){
			$scope.content[$scope.timeLimit].articles.forEach(function(article){
				if(article._id === id ){
					article.fetchedComments = data.comments;
				}
			});
		});
	}

	$scope.commentForm = function(id,user,contents) {
		dataService.postComments(id,user,contents).then(function(x){
			$scope.contrnts = null;
		$scope.content[$scope.timeLimit].articles.forEach(function(article){
				if(article._id === id ){
					article.fetchedComments.push(x);
				}
			});
		});
	}
	
	$scope.showNestedComments = function(cId){
		$http.get('/api/comments/'+cId,function(){
			
		}).then(function(response){
			
		});
		$('#'+cId+' .col-md-10').after("")
	};
		$scope.changeState = function(state){
			switch(state){
				case 0:
					console.log("yolo");
					$scope.timeLimit = "day";
					$scope.timeLimitHeader = "Day";
					break;
				case 1:
					$scope.timeLimit = "week";
					$scope.timeLimitHeader = "Week";
					break;
				case 2:
					$scope.timeLimit = "month";
					$scope.timeLimitHeader = "Month";
					break;
				case 3:
					$scope.timeLimit = "all";
					$scope.timeLimitHeader = "All Time";
					break;
			}
			var url = '/api/top/'+$scope.timeLimit+'/0';
			if(!$scope.content[$scope.timeLimit].articles.length){
				$http.get(url).then(function(response){
					console.log("get request to url: "+url);
					$scope.content[$scope.timeLimit].articles = response.data;
				});
			}
		};
	}]);
	