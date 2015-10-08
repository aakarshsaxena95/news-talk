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
		console.log($scope.articles.articles);
	}

	$scope.addToReadingList = function(id,userid){
		console.log("Clicked on add to reading list");
		dataService.addToReadingList(id,userid);
	};

	$scope.removeFromReadingList = function(id,userid){
		dataService.removeFromReadingList(id,userid);
	}

	$scope.upvote = function(id){
		upvoteIncrementer(id);
		console.log("in upvote ",id);
		dataService.upvote(id);
	}

	var upvoteIncrementer = function(id){
		console.log(id);
		$scope.articles.articles.forEach(function(article){
			console.log(article);
			if(article && article._id === id && !article.votes.set){
				console.log(article);
				article.votes.up++;
				article.votes.set = true;
			}
		});
	}


	$scope.downvote = function(id){
		downvoteIncrementer(id);
		console.log("in downvote ",id);
		dataService.downvote(id);
	}

	var downvoteIncrementer = function(id){
		console.log(id);
		$scope.articles.articles.forEach(function(article){
			console.log(article);
			if(article && article._id === id && !article.votes.set){
				console.log(article);
				article.votes.down++;
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