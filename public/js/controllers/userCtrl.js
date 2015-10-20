angular.module("newstalk")
	.controller("UserController",["$scope","$http",function($scope,$http){
		
		$scope.readinglist = [];
		
		$http.get('/api/readinglistlinks')
			.then(function(response){
				console.log("ashfjsahd");
			response.data.articles.forEach(function(article){
				$scope.readinglist.push(article);
			});
			console.log($scope.readinglist);
			});
		
		$scope.recentcomments = [];
		
		$http.get('/api/commentsforprofile').then(function(response){
			console.log(response);
			response.data.forEach(function(comment){
				$scope.recentcomments.push(comment);
				console.log(comment);				
			});
			$scope.recentcomments.sort(function(o1,o2){
				var d1 = new Date(o1.timestamp);
				var d2 = new Date(o2.timestamp);
				return d2-d1;
			});
		});
	}]);