var app = angular.module('newstalk',[])
app.controller("articleCtrl",function($scope,$http){
	$http.get('/api/articles/0').
	  success(function(response) {
	    $scope.articles = response;
	    console.log($scope.articles);
	  });
	$scope.commentForm = function(id,userid){
		console.log(userid);
		var uid = userid;
		var c =  this.contents;
		var data = {
			content: c,
			user: uid
		};
		console.log(data);
		$http.post('/api/article/'+id,data);
	};
});


app.directive("singlearticle",function(){
	return{
		restrict:'E',
		templateUrl:'views/one-article.html'
	}
});
