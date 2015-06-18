var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');

var User = require("./User");
var Connections = require("./Connections");
var Battle = require("./Battle");
var Room = require("./Room");

module.exports.run = function(worker){
  console.log('   >> Worker PID:', process.pid);

  var app = require('express')();

  var httpServer = worker.httpServer;
  var scServer = worker.scServer;

  app.use(serveStatic(path.resolve(__dirname, 'public')));

  httpServer.on('request', app);

  var connections = Connections();
  var roomCollection = {};

  scServer.on('connection', function(socket){
    var user = User(socket);
    connections.add(user);
    console.log("new user ", user.getName());

    socket.on("request:name", function(data){
      if(data && data.name){
        user.setName(data.name);
      }
      socket.emit("response:name", {name: user.getName()});
    })

    socket.on("request:gameLoaded", function(data){
      console.log(data);
      roomCollection[data._roomID].setReady(user);
    })

    socket.on("request:createRoom", function(){
      var room = Room(worker.getSCServer());
      roomCollection[room.getID()] = room;
      room.join(user);
      console.log("room %s created by %s", room.getID(), user.getName());
      user.send("response:createRoom", room.getID());
    })

    socket.on("request:joinRoom", function(){
      console.log("joinroom");
      var interval = setInterval(function(){
        for(var key in roomCollection) {
          var room = roomCollection[key];
          if(!room.isOpen()) continue;
          room.join(user);
          clearInterval(interval);
          console.log("user %s joined room %s", user.getName(), room.getID());
          user.send("response:joinRoom", room.getID());
        }
      }, 500);
    })

    socket.on("request:roomData", function(){
      var room = user.getRoom();
      var players = room.getPlayers();
      user.send("response:roomData", {players: players});
    })

    socket.on('disconnect', function(){
      connections.remove(user);
      user.disconnect();
    });
  });
};