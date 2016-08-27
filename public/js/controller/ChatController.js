var chatApp=angular.module('ChatController',[]);

chatApp.controller('ChatController',['$scope','$rootScope','$http','$mdDialog', 'store', 'jwtHelper','$mdSidenav','$location','$anchorScroll','$interval','ngAudio',function($scope,$rootScope,$http,$mdDialog, store, jwtHelper,$mdSidenav,$location,$anchorScroll,$interval,ngAudio){
	$scope.user=$rootScope.currentUser;

	/*Group Chat Code Start*/

	$scope.notifyNewMessageArr=[];
	$scope.groupMessage=[];
	var socket = io.connect();

	$scope.gotoBottom = function(divId) {
	      $location.hash(divId);
	      $anchorScroll();
    };

    

    $scope.getSelectedGroupMessage=function(groupId){
    	$http.post('/groupMessage',{groupId:groupId})
    		.success(function(data){
    			$scope.groupMessage=data;
    		});
    }

    
    //socket.emit('OnFetchGroupList',{userId:$scope.user._id});
    
    $http.post('/groupList',{userId:$scope.user._id})
    	.success(function(data){
    		$scope.groupList=data;
	      	$scope.selectedGroupDetails=data[0];
	      	$scope.getSelectedGroupMessage(data[0]._id);
    	})

   //  socket.on('groupList', function(data) {
	  //   $scope.$apply(function () {
	  //     $scope.groupList=data;
	  //     $scope.selectedGroupDetails=data[0];
	  //     $scope.getSelectedGroupMessage(data[0]._id);
	  //   });
	  // });

    $scope.SelectedUserGroup=function(group){
    	$scope.selectedGroupDetails=group;
    	var index=$scope.notifyNewMessageArr.indexOf(group._id);
    	$scope.notifyNewMessageArr.splice(index,1);
    	$scope.getSelectedGroupMessage(group._id);
    }


    $scope.addNewGroupMessage = function(event) {
    	if(event.keyCode==13 && $scope.userGroup.message){
    		socket.emit('addNewGroupMessage', 
    			{
    				message:$scope.userGroup.message
    				,groupId:$scope.selectedGroupDetails._id
    				,userId:$scope.user._id
    				,createdOn:new Date()
    			}
    		);
    		$scope.userGroup.message='';
    	}
	    
	};

  socket.on('recieveNewGroupMessage', function(data) {
  	$scope.$apply(function () {
    	if(data.groupId==$scope.selectedGroupDetails._id){
    		$scope.groupMessage=data.messages;
    	}else{

    		$scope.notifyNewMessageArr.push(data.groupId);
    	}
    	if($scope.user._id!=data.userId){
    		ngAudio.load('notification.mp3').play();
    	}
    	
      
    });
  });

  

  

  var userTyping=function(){
  	if($scope.userGroup.message && $scope.groupInputFocus){
  		socket.emit('userTyping',{user_name:$scope.user.name});
  	}else{
  		socket.emit('userTyping',{});
  	}
  	
  }

  $interval(userTyping,100);

  socket.on('recieveUserTyping', function(data) {
    $scope.$apply(function () {
      $scope.userTypingUser=data.user_name;
    });
  });

  /*Group Chat Code End*/

  /*Private Chat Code Start*/
  	$http.post('/chatUserList',{_id:$scope.user._id})
  		.success(function(data){
  			$scope.chatUserList=data;
  		});


  	$scope.createChannel=function(userDetail){
  	var channelDetail={senderId:$scope.user._id,requestedId:userDetail._id};
  	$http.post('/createChannel',channelDetail)
  		.success(function(data){
  			$scope.selectedChannel=data;
  		});
  	}

  /*Private Chat Code End*/

  

	
}]);

chatApp.directive('chatMessage',function(){
	return {
		restrict:'E'
		,templateUrl:'view/directive/chatMessage.html'
		,scope:{'message':'@','userId':'@','createdOn':'@'}
		,controller:['$scope','$rootScope','$http',function($scope,$rootScope,$http){
			$scope.user=$rootScope.currentUser;
			$scope.getUserName=function(userId){
			  	$http.post('/getUserName',{_id:userId})
			  		.success(function(data){
			  			$scope.messageUserName=data.name;
						$scope.messageIcon=data.icon;
			  		});
			  }
		}]
	}

})