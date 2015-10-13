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
		//TODO: Modify this to call it for recent comments by the user
		/*
			COMMENT STRUCTURE:
			{
				user._id: string,
				comment content(truncated),
				comment on article link(on my page)
			}
		
		*/
//		$http.get('/api/commentsforprofile').then(function(response){
//			response.data.comments.forEach(function(comment){
//				$scope.recentcomments.push(comment);				
//			});
//		});
				$scope.recentcomments.push({
					content:'asfasyudfbsdah kuawsgfkuya gsdkf',
					article:{
						link:'skudhfksdf.com',
						title:'sjdhfadfkjahgsdhbsd'
					}
				});
	}]);