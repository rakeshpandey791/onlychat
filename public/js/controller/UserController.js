var userApp=angular.module('UserController',[]);
userApp.controller('UserController',['$scope','$rootScope','$mdDialog','$http','$state','store','$mdToast','$filter','$window','$q','Upload',function($scope,$rootScope,$mdDialog,$http,$state,store,$mdToast,$filter,$window,$q,Upload){
	$scope.user=$rootScope.currentUser;
  


  $scope.showTermAndCondition = function(ev) {
   $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'view/directive/termAndCondition.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false
    });
  };

  $scope.upload = function () {
        Upload.upload({
            url: 'uploadProfilePic',
            data: {file: $scope.picFile, userId:$scope.user._id}
        }).then(function (resp) {
            $mdToast.simple()
                  .content(resp.msg)
                  .position('right')
                  .hideDelay(3000)
        }, function (resp) {
            $mdToast.show(
                $mdToast.simple()
                  .content(resp.status)
                  .position('right')
                  .hideDelay(3000)
              );
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.uploadPercentage=progressPercentage;
        });
    };

  $scope.createNewUser=function(){
    $scope.signupRequest=true;
    $http.post('/createNewUser',$scope.user)
          .success(function(response){
            store.set('jwt', response.id_token);
            $window.location.reload();
            $state.go('home');
          })
          .error(function(status){
            $scope.signupRequest=false;
            $mdToast.show(
                $mdToast.simple()
                  .content(status)
                  .position('right')
                  .hideDelay(3000)
              );
          });
  }

  $scope.UpdateProfile=function(){
    $scope.user._id=$scope.currentUser._id;
    $scope.user.dob=new Date($filter('date')($scope.user.dob, 'dd/MM/yyyy'));
    $http.put('/UpdateProfile',$scope.user)
          .success(function(response){
            store.set('jwt', response.id_token);
            $mdToast.show(
                $mdToast.simple()
                  .content(response.msg)
                  .position('right')
                  .hideDelay(3000)
              );
          })
          .error(function(status){
            $mdToast.show(
                $mdToast.simple()
                  .content(status)
                  .position('right')
                  .hideDelay(3000)
              );
          });
  }

  $scope.UserLogin=function(){
    $scope.logginRequest=true;
    $http.post('/UserLogin',$scope.user)
          .success(function(response){
            store.set('jwt', response.id_token);
            $window.location.reload();
            $state.go('home');
          })
          .error(function(status){
            $scope.logginRequest=false;
              $mdToast.show({
              template: '<md-toast class="md-warn"><i class="fa fa-times-circle"></i>&nbsp;&nbsp;&nbsp;'+status+'</md-toast>',
              hideDelay: 3000,
              position: 'right'
            });
          });
  }

  $scope.LoginWithFB=function(){
      FB.login(function(response) {
          if (response.authResponse) {
           FB.api('/me', function(response) {
            console.log(response);
            $scope.$apply(function () {
                $scope.lodingicon=false;
                
            });
            var token=FB.getAuthResponse();
            console.log('token',token);
            
           });
          } else {
           console.log('User cancelled login or did not fully authorize.');
          }
      }, {scope: 'publish_actions'});
  }

  $scope.LatAndLong=function(){
    if($scope.user.pincode.length==6){
      $http.post('/getStateAndCity',{url:'https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.user.pincode})
            .success(function(data){
                $scope.getStateAndCity(data);
            });
    }
  }

  $scope.getStateAndCity=function(data){
      var newurl='http://maps.googleapis.com/maps/api/geocode/json?latlng='+data.results[0].geometry.location.lat+','+data.results[0].geometry.location.lng+'&sensor=true';
                     
      $http.post('/getStateAndCity',{url:newurl})
            .success(function(response){
              console.log(response);
              $scope.user.city=response.results[response.results.length-3].address_components[0].long_name;
              $scope.user.state=response.results[response.results.length-2].address_components[0].long_name;
              $scope.user.formatted_address=response.results[0].formatted_address;
            });
                   
  }

  $scope.SaveAddress=function(){
      $scope.user.userId=$scope.currentUser._id;
      $http.post('/SaveAddress',$scope.user)
            .success(function(response){
              $scope.user.pincode='';
              $scope.user.fullname='';
              $scope.user.formatted_address='';
              $scope.showAddAddressForm=false;
              $scope.getAllAddress();
              $mdToast.show(
                $mdToast.simple()
                  .content(response.msg)
                  .position('right')
                  .hideDelay(3000)
              );
            })
            .error(function(status){
                $mdToast.show(
                $mdToast.simple()
                  .content(status)
                  .position('right')
                  .hideDelay(3000)
              );
            });
  }

  $scope.getAllAddress=function(){
    $http.post('/getAllAddress',{userId:$scope.currentUser._id})
        .success(function(response){
            $scope.addresses=response;
        });
  }

  $scope.removeAddress=function(id){
    $http.post('removeAddress',{_id:id})
        .success(function(data){
          $scope.getAllAddress();
            $mdToast.show(
                $mdToast.simple()
                  .content(data.msg)
                  .position('right')
                  .hideDelay(3000)
              );
        })
        .error(function(status){
            $mdToast.show(
                $mdToast.simple()
                  .content(status)
                  .position('right')
                  .hideDelay(3000)
              );
        });
  }

  $scope.ChangePassword=function(){
      //$scope.usercpass._id=$scope.currentUser._id;
      $http.put('/ChangePassword',$scope.usercpass)
          .success(function(response){
            $scope.usercpass={};
            $mdToast.show(
                $mdToast.simple()
                  .content(response.msg)
                  .position('right')
                  .hideDelay(3000)
              );
          })
          .error(function(status){
            $mdToast.show(
                $mdToast.simple()
                  .content(status)
                  .position('right')
                  .hideDelay(3000)
              );
          });
  }

}]);

userApp.directive('aGreatEye', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<h1>lidless, wreathed in flame, {{1 + 1}} times</h1>'
    };
});