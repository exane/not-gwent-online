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

  //var roomCollection = {};
  global.connections = Connections(/*roomCollection*/);

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
      connections.roomCollection[data._roomID].setReady(user);
    })

    socket.on("request:createRoom", function(){
      if(user.getRoom()) return;
      if(user._searching) return;
      var room = Room(worker.getSCServer());
      connections.roomCollection[room.getID()] = room;
      room.join(user);
      user._searching = true;
      console.log("room %s created by %s", room.getID(), user.getName());
      user.send("response:createRoom", room.getID());
    })

    socket.on("request:joinRoom", function(){
      if(user._searching) return;
      user._searching = true;
      console.log("joinroom");
      var interval = setInterval(function(){
        if(!user || user.disconnected) {
          clearInterval(interval);
          return;
        }
        for(var key in connections.roomCollection) {
          var room = connections.roomCollection[key];
          if(!room) continue;
          if(!room.isOpen()) continue;
          room.join(user);
          clearInterval(interval);
          user._searching = false;
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
      console.log("user ", user.getName(), " disconnected");
      user = null;
    });
  });
};