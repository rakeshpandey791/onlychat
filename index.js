var express = require('express');
var app=express();
var bodyParser = require('body-parser');
var md5 = require('md5');
var jwt     = require('jsonwebtoken');
var request     = require('request');
var multer  = require('multer')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/easykart');
var server = require('http').Server(app);
var io = require('socket.io')(server)

var UserModel=require('./server/model/UserModel.js');
var ChatModel=require('./server/model/ChatModel.js');



app.use(express.static('public'));
app.use(bodyParser.json());

UserModel(app,mongoose,md5,jwt,request,multer);

ChatModel(app,mongoose,io);


app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});



server.listen(4000, function(){
    console.log('listening on *:4000');
});