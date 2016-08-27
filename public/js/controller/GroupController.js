var groupApp=angular.module('GroupController',[]);

groupApp.controller('GroupController',['$scope','$rootScope','$http','$mdDialog','$mdToast', 'store', 'jwtHelper','$mdSidenav','$location','$anchorScroll',function($scope,$rootScope,$http,$mdDialog,$mdToast, store, jwtHelper,$mdSidenav,$location,$anchorScroll){
	$scope.user=$scope.currentUser;


 $scope.showGroupPeople = function(ev,groupId) {
    $scope.groupId=groupId;
   $mdDialog.show({
      controller: 'GroupUserListController',
      templateUrl: 'view/directive/groupUserList.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      scope: $scope,
      clickOutsideToClose:true
    });
  };

  $scope.groupList=function(){
      $http.post('/groupList',{userId:$scope.user._id})
      .success(function(data){
          $scope.groupLists=data;
      })
      .error(function(status){
        $mdToast.show(
                $mdToast.simple()
                  .content(status.message)
                  .position('right')
                  .hideDelay(3000)
              );
      });
  }

  $scope.groupList();
  

  $http.post('/chatUserList',{_id:$scope.user._id})
      .success(function(data){
        $scope.chatUserList=data;
      });

  $scope.createGroup=function(group){
    var groupData={name:group.name,description:group.description,adminUserId:$scope.user._id};
    $http.post('/createGroup',groupData)
      .success(function(data){
          if(data){
              $scope.groupList();
              $mdToast.show(
                $mdToast.simple()
                  .content('Group created successfully!!')
                  .position('right')
                  .hideDelay(3000)
              );
          }
          
      })
      .error(function(status){
          $mdToast.show(
                $mdToast.simple()
                  .content(status.message)
                  .position('right')
                  .hideDelay(3000)
              );
      });
  }

  $scope.deleteGroup=function(groupId){
    var groupData={groupId:groupId};
    $http.post('/deleteGroup',groupData)
      .success(function(data){
          if(data){
              $scope.groupList();
              $mdToast.show(
                $mdToast.simple()
                  .content('Group has deleted successfully!!')
                  .position('right')
                  .hideDelay(3000)
              );
          }
          
      })
      .error(function(status){
          $mdToast.show(
                $mdToast.simple()
                  .content(status.message)
                  .position('right')
                  .hideDelay(3000)
              );
      });
  }

  

  $scope.addPeopleInGroup=function(userId,groupId){
    $http.post('/addPeopleInGroup',{userId:userId,groupId:groupId})
        .success(function(data){
            if(data){
              $scope.groupList();
              $mdToast.show(
                $mdToast.simple()
                  .content('User successfully added to group!!.')
                  .position('right')
                  .hideDelay(3000)
              );
          }
        })
        .error(function(status){
            $mdToast.show(
                $mdToast.simple()
                  .content(status.message)
                  .position('right')
                  .hideDelay(3000)
              );
        });
  }

  $scope.getGroupPeopleCount=function(index,groupId){
    $http.post('/getGroupPeopleCount',{groupId:groupId})
          .success(function(data){
              $scope.groupLists[index].count=data.count;
          });
  }

	
}]);