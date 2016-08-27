var dialogApp=angular.module('DialogController',[]);

dialogApp.controller('DialogController',['$scope','$mdDialog',function($scope,$mdDialog){
    $scope.CloseModel=function(){
      $mdDialog.cancel();
    }
}]);