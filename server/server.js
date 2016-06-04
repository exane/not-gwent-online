var argv = require('minimist')(process.argv.slice(2));
var http = require("http");
var express = require('express');
var app = express();
var Config = require("../public/Config")

global.connections = require("./Connections")();

global.matchmaking = require("./Matchmaker")();

global.Room = require("./Room");

global.User = require("./User");

var server = http.createServer(app);
global.io = require("socket.io").listen(server);
server.listen(Config.Server.port);

app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));

app.listen(Config.WebServer.port);

var admin = io.of("/admin");

io.on("connection", function(socket) { //global connection
  var user;
  connections.add(user = User(socket));
  console.log("new user ", user.getName());

  socket.on("disconnect", function() {
    connections.remove(user);
    user.disconnect();
    console.log("user ", user.getName(), " disconnected");
    user = null;
    //io.emit("update:playerOnline", connections.length());
  })


  io.emit("update:playerOnline", connections.length());
})

admin.on("connection", function(socket) {
  socket.on("sendMessage", function(msg) {
    console.log("admin send msg: " + msg);
    io.emit("notification", {
      message: msg
    })
  })
})