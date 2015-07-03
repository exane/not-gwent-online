var argv = require('minimist')(process.argv.slice(2));

require("monitor").start();

global.connections = require("./Connections")();

global.matchmaking = require("./Matchmaker")();

global.Room = require("./Room");

global.User = require("./User");

/*global.Socket = require("./Socket");*/


var app = require('http').createServer();
global.io = require("socket.io")(app);

app.listen(16918);

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