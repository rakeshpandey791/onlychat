var fs = require('fs');
module.exports=function(app,mongoose,md5,jwt,request,multer){
	var userSchema={
		name:{ type: String, required: true },
		email:{ type: String, required: true },
		mobile:{ type: String, required: true },
		dob:Date,
		gender:String,
		icon:String,
		password:{ type: String, required: true }};
	var User=mongoose.model('user',userSchema,'user');

	var addressSchema={
		pincode:{ type: Number, required: true },
		name:{ type: String, required: true },
		mobile:{ type: String, required: true },
		city:{ type: String, required: true },
		state:{ type: String, required: true },
		address:{ type: String, required: true },
		formatted_address:{ type: String, required: true },
		userId:{ type: String, required: true }
	};
	var Address=mongoose.model('address',addressSchema,'address');

	function createToken(user) {
	  return jwt.sign(user, 'AXYZP');
	}
	var upload = multer({ dest: './public/img/user'});
	app.post('/uploadProfilePic',upload.single('file'),function(req, res, next) {
	
		 User.update({_id:req.body.userId},{icon: req.file.filename},function(err,result){
			if(err){
				res.status(400).send('something went wrong.');
			}else{
				res.status(201).send({msg:"Picture uploaded successfully!"});
			}
		});
	});

	app.post('/createNewUser',function(req,res,next){
		if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.cofpassword) {
		    return res.status(400).send("All field is required!");
		}

		if (req.body.password!==req.body.cofpassword) {
		    return res.status(400).send("Password and Confirm Password do not match!");
		}

		User.findOne({email:req.body.email},{email:1},function(err,result){
			if(result){
				return res.status(400).send("This email is already exist in our system.");
			}else{
				next();
			}
		});

		

	},function(req,res,next){
		var userData={name:req.body.name,email:req.body.email,mobile:req.body.mobile,password:md5(req.body.password)};
		var UserDetails=new User(userData);
		UserDetails.save(function(err,result){
			if(err){
				res.send('something went wrong.');
			}else{
				var tokenParams = {
					_id:result._id,
					name:result.name,
					email:result.email,
					mobile:result.mobile,
					dob:result.dob,
					gender:result.gender
				};
				res.status(201).send({
				    id_token: createToken(tokenParams)
				  });
			}
		});
	});

	app.put('/UpdateProfile',function(req,res,next){
		console.log(req.body.email+' '+req.body.mobile+' '+req.body.dob+' '+req.body.gender);
		if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.dob || !req.body.gender) {
		    return res.status(400).send("All field is required!");
		}
		var userData={name:req.body.name,email:req.body.email,mobile:req.body.mobile,dob:req.body.dob,gender:req.body.gender};
		User.update({_id:req.body._id},userData,function(err,result){
			if(err){
				res.send('something went wrong.');
			}else{
				userData._id=req.body._id;
				res.status(201).send({msg:"Personal Info save successfully!",id_token: createToken(userData)});
			}
		});

	});

	

	app.post('/UserLogin',function(req,res,next){
		var loginCredentials={email:req.body.email,password:md5(req.body.password)};
		
		if (!req.body.email || !req.body.password) {
		    return res.status(400).send("Email and password is required");
		}


		User.findOne(loginCredentials,{_id:1,name:1,email:1,mobile:1,dob:1,gender:1},function(err,result){
			if(err){
				return res.status(400).send("Error: "+err);
			}else if(result){
				var tokenParams = {
					_id:result._id,
					name:result.name,
					email:result.email,
					mobile:result.mobile,
					dob:result.dob,
					gender:result.gender
				};
				return res.status(201).send({
				    id_token: createToken(tokenParams)
				  });
			}else{
				return res.status(400).send("Invalid Email or Password!");
			}
		});

	});

	app.put('/ChangePassword',function(req,res,next){
		if (!req.body.oldpassword || !req.body.newnpassword || !req.body.confirmpassword) {
		    return res.status(400).send("All field is required!");
		}

		if (req.body.newnpassword !==req.body.confirmpassword) {
		    return res.status(400).send("New Password and Confirm Password do not match!");
		}

		User.findOne({_id:req.body._id},{password:1},function(err,result){
			if(result.password===md5(req.body.oldpassword)){
				next();
			}else{
				return res.status(400).send(" Old Password is Invalid!");
			}
		});

	},function(req,res,next){
		var userData={password:md5(req.body.newnpassword)};
		User.update({_id:req.body._id},userData,function(err,result){
				if(err){
				res.send('something went wrong.');
			}else{
				res.status(201).send({msg:"Password save successfully!"});
			}
		});
	});

	app.post('/getStateAndCity',function(req,res,next){
		request(req.body.url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	res.status(201).send(body);
		  	}
		});
	});

	app.post('/SaveAddress',function(req,res,next){
		if (!req.body.pincode || !req.body.fullname || !req.body.mobile || !req.body.formatted_address) {
		    return res.status(400).send("All field is required!");
		}
		
		var addressDetail=new Address({pincode:req.body.pincode,name:req.body.fullname,mobile:req.body.mobile,city:req.body.city,state:req.body.state,address:req.body.address,formatted_address:req.body.formatted_address,userId:req.body.userId});
		addressDetail.save(function(err,result){
			if(err){
				res.status(400).send('Error :'+err);
			}else{
				res.status(201).send({msg: "Address save successfully!"});
			}
		});

	});

	app.post('/getAllAddress',function(req,res,next){
		Address.find({userId:req.body.userId},function(err,addresses){
			if(!err){
				res.status(201).send(addresses);
			}
		});
	})

	app.post('/removeAddress',function(req,res,next){
		Address.remove({_id:req.body._id},function(err){
			if(err){
				res.status(400).send('Error: '+err);
				
			}else{
				res.status(201).send({msg: "Address remove successfully!"});
			}
		});
	})

	app.post('/getUserName',function(req,res,next){
		User.findOne({_id:req.body._id},function(err,result){
			if(!err){
				res.status(201).send(result);
			}
		});	
	})
	

	app.post('/chatUserList',function(req,res,next){
		User.find({_id:{$ne:req.body._id}},{name:1,icon:1},function(err,users){
			if(!err){
				res.status(201).send(users);
			}
		});
	})

	app.post('/peoplrByGroup',function(req,res){
		User.find({_id:{$in:req.body.userIds}},{name:1,icon:1},function(err,users){
			if(!err){
				res.status(201).send(users);
			}
		});
	})

	app.get('/getSearchUserList/:searchKey/:userId',function(req, res){

		User.find({$and:[{name: new RegExp(req.params.searchKey, "i")},{_id:{ "$nin": [req.params.userId]}}]},{name:1,icon:1,email:1,mobile:1},function(err,users){
			if(!err){
				res.status(201).send(users);
			}
		});
	})

	app.get('/userDetails/:userId',function(req, res){

		User.findOne({_id:req.params.userId},{name:1,icon:1,email:1,mobile:1},function(err,users){
			if(!err){
				res.status(201).send(users);
			}
		});
	})

	
	
}