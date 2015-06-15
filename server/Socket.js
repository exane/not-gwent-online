var app = require('http').createServer();
global.io = require("socket.io")(app);
var User = require("./User");
var Connections = require("./Connections");
var Battle = require("./Battle");
var Npc = require("./Npc");
var Room = require("./Room");


var Socket = (function(){
  var Socket = function(){
    if(!(this instanceof Socket)){
      return (new Socket());
    }
    /**
     * constructor here
     */
    this.connections = Connections();
    /*
        this.matchmaker = Matchmaker(this.connections);
    */
    this.roomCollection = {};
    app.listen(this.port);
    this.io = io;
    this._events();
  };
  var r = Socket.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.io = null;
  r.port = 16918;
  r.connections = null;
  r.roomCollection = null;
  /*
    r.matchmaker = null;
  */

  r._events = function(){
    var self = this;
    this.io.on("connection", function(socket){
      var user = User(socket);
      self.connections.add(user);
      console.log("new user ", user.getName());

      socket.on("request:name", function(data){
        if(data && data.name){
          user.setName(data.name);
        }
        socket.emit("response:name", {name: user.getName()});
      })

      socket.on("request:createRoom", function(){
        var room = Room();
        self.roomCollection[room.getID()] = room;
        room.join(user);
        console.log("room %s created by %s", room.getID(), user.getName());
        user.send("response:createRoom", room.getID());
      })

      socket.on("request:joinRoom", function(){
        console.log("joinroom");
        var interval = setInterval(function(){
          for(var key in self.roomCollection) {
            var room = self.roomCollection[key];
            if(!room.isOpen()) continue;
            room.join(user);
            clearInterval(interval);
            console.log("user %s joined room %s", user.getName(), room.getID());
            user.send("response:joinRoom", room.getID());
          }
        }, 1000);
      })

      socket.on("request:roomData", function(){
        var room = user.getRoom();
        var players = room.getPlayers();
        user.send("response:roomData", {players: players});
      })

      socket.on("disconnect", function(){
        self.connections.remove(user);
        user.disconnect();
      })

      socket.on("request:gameLoaded", function(data){
        self.roomCollection[data._roomID].setReady(user);
      })
    });
  }
  return Socket;
})();

module.exports = Socket;