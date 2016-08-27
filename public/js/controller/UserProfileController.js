/**
 * Created by rpandey on 8/11/16.
 */
var userProfileApp=angular.module('UserProfileController',[]);

dialogApp.controller('UserProfileController',['$scope','$rootScope','$http','$mdDialog','$stateParams',function($scope,$rootScope,$http,$mdDialog,$stateParams){
    $scope.user=$rootScope.currentUser;

    $scope.userId = $stateParams.selectedUId;

    $scope.userDetails = function(){
        $http.get('/userDetails/' + $scope.userId)
            .success(function(data){
                $scope.userDetail = data;
            })
    };

    $scope.userDetails();

}]);