var dialogApp=angular.module('GroupUserListController',[]);

dialogApp.controller('GroupUserListController',['$scope','$rootScope','$http','$mdDialog',function($scope,$rootScope,$http,$mdDialog){
    $scope.user=$rootScope.currentUser;

    $scope.CloseModel=function(){
      $mdDialog.hide();
    }
    
    $http.post('getGroupPeople',{groupId:$scope.groupId})
    	.success(function(data){
    		$scope.groupName=data.groupName;
            $scope.adminUserId=data.adminUserId;
    		$http.post('/peoplrByGroup',{userIds:data.userIds})
    			.success(function(peopleData){
    				$scope.goupPeople=peopleData;
    			});
    	});

}]);