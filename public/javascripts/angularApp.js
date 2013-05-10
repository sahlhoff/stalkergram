angular.module('ngView', [], function($routeProvider, $locationProvider) {
$routeProvider.when('/', {
      templateUrl: 'partials/stalkers.html',
      controller: StalkerCtrl
    });
   
 
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});



function StalkerCtrl($scope, $route, $routeParams, $location, $http) {
  $scope.stalkers = [];
  $http({method: 'GET', url: '/mystalkers'}).
    success(function(data, status, headers, config) {
      
    setTimeout(function(){  
          $("tr:first").foggy({blurRadius:9, opacity:0.8, cssFilterSupport:true})
          $('tr:eq(1)').foggy({blurRadius:9, opacity:0.8, cssFilterSupport:true})
          $('tr:eq(2)').foggy({blurRadius:9, opacity:0.8, cssFilterSupport:true})

          $('#tweetTo').show();
        },10);


      $scope.stalkers = data.users;
    });
}


function MainCntl($scope, $route, $routeParams, $location) {
  console.log('in MainCntl')
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}