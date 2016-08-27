var app = angular.module('MeanApp',['ui.router','ui.bootstrap', 'ngAnimate','ngMaterial','ngFileUpload','angular-storage','angular-jwt','luegg.directives','ngAudio','UserController','DialogController','ChatController','GroupController','GroupUserListController', 'UserProfileController']);


app.config(['$stateProvider', '$urlRouterProvider','$locationProvider', 'jwtInterceptorProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$locationProvider, jwtInterceptorProvider, $httpProvider){
		$urlRouterProvider.otherwise("/");
		$stateProvider
		.state("home", {
          url: "/",
          templateUrl: 'view/chat.html',
          controller:'ChatController',
          data:{requireLogin:true}
      	})
      	.state("Login", {
          url: "/login",
          templateUrl: 'view/login.html',
          controller:'UserController',
          data:{requireLogin:false}
      	})
      	.state("Signup", {
          url: "/signup",
          templateUrl: 'view/signup.html',
          controller:'UserController',
          data:{requireLogin:false}
      	})
        .state("Profile", {
          url: "/profile",
          templateUrl: 'view/profile.html',
          controller:'UserController',
          data:{requireLogin:true}
        })
        .state("Chat", {
          url: "/chat",
          templateUrl: 'view/chat.html',
          controller:'ChatController',
          data:{requireLogin:true}
        })
        .state("Group", {
          url: "/group",
          templateUrl: 'view/group.html',
          controller:'GroupController',
          data:{requireLogin:true}
        })
            .state("SelectedUserProfile",{
                url: "/userProfile/:selectedUId",
                templateUrl: 'view/userProfile.html',
                controller:'UserProfileController',
                data:{requireLogin:true}
            });

        $locationProvider.html5Mode(true)

        jwtInterceptorProvider.tokenGetter = function(store) {
          return store.get('jwt');
        }

        $httpProvider.interceptors.push('jwtInterceptor');
}]);

app.run(['$rootScope','$state','$location','store','jwtHelper',function($rootScope,$state,$location, store, jwtHelper){
    var jwt = store.get('jwt') && jwtHelper.decodeToken(store.get('jwt'));
    //if(jwt){
        $rootScope.currentUser = jwt;
    //}


    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
        
        if (toState.data && toState.data.requireLogin) {
          if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
            e.preventDefault();
            $state.go('Login');
          }
        }else if(!toState.data.requireLogin){
            if (store.get('jwt')) {
              e.preventDefault();
              if(toState.name=='Login' || toState.name=='Signup'){
                $state.go('home');
              }
            }
              
         
        }
    });
}]);


app.directive('websiteHeader',function(){
   var webHeader={};
   webHeader.restrict='E';
   webHeader.replace=true;
   webHeader.templateUrl='view/directive/websiteHeader.html';
   webHeader.controller=function($scope,store,$window,$state, $http,onlineStatus){
       $scope.onlineStatus = onlineStatus;

       $scope.$watch('onlineStatus.isOnline()', function(online) {
           $scope.online_status_string = online ? 'online' : 'offline';
       });

       $scope.user=$scope.currentUser;
       $scope.matchItems=[];

       $scope.searchItem = function(){
            $http.get('/getSearchUserList/' + $scope.SearchItem + '/' + $scope.user._id)
                .success(function(data){
                    $scope.matchItems = data;
                })
       };

       $scope.SelectedUserProfile = function(selectedUserId){
           $state.go('SelectedUserProfile',{selectedUId:selectedUserId});
       };

      $scope.Logout=function(){
        store.set('jwt', false);
        $window.location.reload();
        $state.go('Login');
      }

      $scope.selected = 'item2';
    
      $scope.isSelected = function(item) {
          return item === $scope.selected ? 'active' : '';
      }
      
      
      $scope.selectItem = function (item) {
          $scope.selected = item;
      }

      $scope.keyDown = function (event) {
          var indx = $scope.matchItems.indexOf($scope.selected);
          switch(event.keyCode) {
              case 40:
                  var nIndx = indx === $scope.matchItems.length - 1 ? 0 : indx + 1;
                  var item = $scope.matchItems[nIndx];
                  $scope.selectItem(item);
                  event.preventDefault();
                  break;
              case 38:
                  var nIndx = indx ===  0 ? $scope.matchItems.length - 1 : indx - 1;
                  var item = $scope.matchItems[nIndx];
                  $scope.selectItem(item);
                  event.preventDefault();
                  break
          }
      }
   };
   return webHeader;
});

app.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    }

    $window.addEventListener("online", function () {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
        onlineStatus.onLine = false;
        $rootScope.$digest();
    }, true);

    return onlineStatus;
}]);