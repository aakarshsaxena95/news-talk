/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('newstalk')
	.controller("tabscontroller",
		['$scope',function($scope){
			$scope.tabs = [{
				title: 'Day',
				url: 'topDay.tpl.html'
			},
			{
				title: 'Week',
				url: 'topWeek.tpl.html'
			},
			{
				title: 'Month',
				url: 'topMonth.tpl.html'
			},
			{
				title: 'All-Time',
				url: 'topAllTime.tpl.html'
			}];
			$scope.currentTab = 'topDay.tpl.html';
			$scope.onClickTab = function(Tab){
				$scope.currentTab = Tab.url;
			};		
			$scope.isActiveTab = function(tabUrl){
				return $scope.currentTab === tabUrl;
			};
			}		
		]
	)
	.controller("dayStoriesCtrl",['$scope','$http','dataService',function($scope,$http,dataService){
		
	}])
	;
	