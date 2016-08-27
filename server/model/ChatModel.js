module.exports=function(app,mongoose,io){
	

	var groupSchema={
		name: String
		,description: String
		,adminUserId: String
		,created_on:Date
	};
	var Group=mongoose.model('groups',groupSchema,'groups');

	var groupMessageSchema={
		message: String
		,groupId:String
		,userId:String
		,createdOn:Date
	};
	var GroupMessage=mongoose.model('groupMessage',groupMessageSchema,'groupMessage');

	var channelSchema={userIds:Array,createdOn:Date,lastAccess:Date};

	var Channel= mongoose.model('channel',channelSchema,'channel');

	var groupPeopleSchema={groupId:String,userId:String,addedOn:Date};

	var GroupPeople= mongoose.model('groupPeople',groupPeopleSchema,'groupPeople');

	/*Group Chat Code Start*/
	app.post('/createGroup',function(req,res){
		var groupData={name:req.body.name,description:req.body.description,adminUserId:req.body.adminUserId,created_on:new Date()};
		var groupDetail=new Group(groupData);
		Group.findOne({name:req.body.name},function(err,group){
			if(group){
				res.status(400).send({message:'Error: Group with this name is already exist.'});
			}else{
				groupDetail.save(function(err,groupCre){
					if(groupCre){
						var groupPeopleData={groupId:groupCre._id,userId:req.body.adminUserId,addedOn:new Date()};
						var groupPeopleDetail=new GroupPeople(groupPeopleData);
						groupPeopleDetail.save(function(err,peopleAdded){
							res.status(201).send(groupCre);
						})
						
					}
					
				})
				
			}
		})
	})

	app.post('/deleteGroup',function(req,res){
		Group.remove({_id:req.body.groupId},function(err,group){
			if(err){
				res.status(400).send({message:'Error: Something wrong!!.'});
			}else{
				GroupPeople.remove({groupId:req.body.groupId},function(err,delGroup){
					res.status(201).send(delGroup);
				})
			}
		})
	})


	app.post('/addPeopleInGroup',function(req,res){
		var groupPeopleData={groupId:req.body.groupId,userId:req.body.userId,addedOn:new Date()};
		var groupPeopleDetail=new GroupPeople(groupPeopleData);
		GroupPeople.findOne({userId:req.body.userId,groupId:req.body.groupId},function(err,exist){
			if(exist){
				res.status(400).send({message:'Error: This people is already added in group.'});
			}else{
				groupPeopleDetail.save(function(err,peopleAdded){
					res.status(201).send(peopleAdded)
				})
			}
		})
	})
	

	app.post('/groupList',function(req,res){
		
		GroupPeople.find({userId:req.body.userId},{groupId:1},function(err,allGroupId){
	  		var groupIds=[];
	  		for(var i=0;i<allGroupId.length;i++){
	  			groupIds.push(allGroupId[i].groupId);
	  		}
	  		Group.find({_id:{$in:groupIds}},function(err,group){
				res.status(201).send(group);
			});
	  	})
	})

	app.post('/getGroupPeople',function(req,res){
		
		GroupPeople.find({groupId:req.body.groupId},{userId:1},function(err,allUserId){
	  		var userIds=[];
	  		for(var i=0;i<allUserId.length;i++){
	  			userIds.push(allUserId[i].userId);
	  		}
	  		Group.findOne({_id:req.body.groupId},{name:1,adminUserId:1},function(err,group){
				res.status(201).send({userIds:userIds,groupName:group.name,adminUserId:group.adminUserId});
			});

			
	  	})
	})

	

	app.post('/getGroupPeopleCount',function(req,res){
		
		GroupPeople.count({groupId:req.body.groupId},function(err,peopleCount){
			if(!err){
	  			res.status(201).send({count:peopleCount});
	  		}else{
	  			res.status(401).send({message:'Something went wrong!.'});
	  		}
	  	})
	})

	

	

	app.post('/groupMessage',function(req,res){
		GroupMessage.find({groupId:req.body.groupId},function(err,messages){
			if(!err){
				res.status(201).send(messages);
			}
		})
	});

	io.on('connection', function(socket) {
	  
	  socket.on('addNewGroupMessage', function(data) {
	  	var groupMessageDetail=new GroupMessage(data);
	  	groupMessageDetail.save(function(err,message){
	  		if(!err){
	  			GroupMessage.find({groupId:data.groupId},function(err,messages){
					io.emit('recieveNewGroupMessage',{messages:messages,groupId:data.groupId,userId:data.userId});
				});
	  		}
	  	});
	  	
	  });

	  socket.on('userTyping', function(data) {
	  	io.emit('recieveUserTyping', {
	      user_name: data.user_name
	    });
	  });

	});

	/*Group Chat Code End*/

  /*Private Chat Code Start*/

  	app.post('/createChannel',function(req,res){
  		Channel.findOne({$and: [{'userIds.Id': {$in: req.body.senderId}},{'userIds.Id': {$in: req.body.requestedId}}]},function(err,channel){
  			if(channel){
  				res.status(201).send(channel);
  			}else{
  				var channelDetail=new Channel({userIds:[{Id:req.body.senderId},{Id:req.body.requestedId}],createdOn: new Date(),lastAccess: new Date()});
  				channelDetail.save(function(err,channelDet){
  					res.status(201).send(channelDet);
  				})
  			}

  		})
  	});

  /*Private Chat Code End*/
}