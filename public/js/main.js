/// <reference path="../../typings/angularjs/angular.d.ts"/>


var app = angular.module('newstalk',['infinite-scroll']);

app.controller("ArticleController",['$scope','$http','dataService',function($scope,$http,dataService){

	$scope.comments={};
	$scope.articles = {articles:[]};
	$scope.reachedEnd = false;
	$scope.getArticles = function(){
		if(!$scope.reachedEnd)
		dataService.getArticles($scope.articles.articles.length)
			.then(getArticlesSuccess);
		};

	function getArticlesSuccess(articles){
		articles.articles.forEach(function(article){
			$scope.articles.articles.push(article);
		});
		$scope.reachedEnd = articles.reachedEnd;
	}

	$scope.addToReadingList = function(id,userid){
		dataService.addToReadingList(id,userid);
	};

	$scope.removeFromReadingList = function(id,userid){
		dataService.removeFromReadingList(id,userid);
	};

	$scope.upvote = function(id,userid){
		upvoteIncrementer(id,userid);
		dataService.upvote(id);
	};
	
	$scope.deleteComment = function(commentId){
		dataService.deleteComment(commentId);
	};

	var upvoteIncrementer = function(id,userid){
		console.log(id);
		$scope.articles.articles.forEach(function(article){
			console.log(article);
			if(article && article._id === id && !article.votes.set){
				if(article.votes.down.indexOf(userid)>-1){
					article.votes.down.splice(article.votes.down.indexOf(userid));
					console.log('removed vote');
				}
				article.votes.up.push(userid);
				article.votes.set = true;
			}
		});
	}


	$scope.downvote = function(id,userid){
		downvoteIncrementer(id,userid);
		dataService.downvote(id);
	}

	var downvoteIncrementer = function(id,userid){
		console.log(id);
		$scope.articles.articles.forEach(function(article){
			console.log(article);
			if(article && article._id === id && !article.votes.set){
				console.log(article);
				if(userid in article.votes.up){
					article.votes.up.splice(article.votes.up.indexOf(userid));
					console.log('removed vote');
				}
				article.votes.down.push(userid);
				article.votes.set = true;
			}
		});
	}


	$scope.showComments = function(id){
		dataService.getComments(id).then(function(data){
			$scope.articles.articles.forEach(function(article){
				if(article._id === id ){
					article.fetchedComments = data.comments;
				}
			});
			console.log($scope.fetchedComments);
		});
	}

	$scope.commentForm = function(id,user,contents) {
		dataService.postComments(id,user,contents).then(function(x){
			$scope.contrnts = null;
		$scope.articles.articles.forEach(function(article){
				if(article._id === id ){
					article.fetchedComments.push(x);
					console.log(article.fetchedComments);
				}
			});
		});
	}
}]);


//FILTERS
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

app.filter('datefilter',function(){
	return function(timestr){
		if(parseInt(timestr.substring(0,2))>12){
			return (parseInt(timestr.substring(0,2))-12)+timestr.substring(2)+" PM";
		}
		else if(parseInt(timestr.substring(0,2))===0){
			return (12)+timestr.substring(2)+" AM";
		}
		else if(parseInt(timestr.substring(0,2))===12){
			return (12)+timestr.substring(2)+" PM";
		}
		else return timestr+" AM";
	}
});

app.filter('timestampFilter',function(){
	return function(text){
			var day = new Date(text.substring(0,19)+'Z');
			console.log(text.substring(0,19)+'Z');
			var returned = relativeDate(day);
			console.log(returned);
			return returned;
		};
	});

app.filter('articleDateFilter',function(){
	return function(text){
		var month = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		return text[0]+" "+month[parseInt(text[1])]+", "+text[2];
	};
});

app.filter('commentShortener',function(){
	return function(text){
		if(text.length>35){
			console.log(text);
			return(text.substring(0,35)+"... ");
		}
		return text;
	};
});