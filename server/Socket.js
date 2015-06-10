var app = require('http').createServer();
var io = require("socket.io")(app);
var User = require("./User");
var Connections = require("./Connections");
var Battle = require("./Battle");
var Npc = require("./Npc");
var Matchmaker = require("./Matchmaker");

var Socket = (function(){
  var Socket = function(){
    if(!(this instanceof Socket)){
      return (new Socket());
    }
    /**
     * constructor here
     */
    this.matchmaker = Matchmaker();
    this.connections = Connections();
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
  r.matchmaker = null;

  r._events = function() {
    var self = this;
    this.io.on("connection", function(socket) {
      var user = User(socket);
      self.connections.add(user);
      console.log("new user ", user.getID());

      this.matchmaker.findOpponent(user)
      .then(function(p1, p2, roomID) {
        var battle = Battle();
        battle.init(p1, p2);
      })

      socket.on("disconnect", function() {
        self.connections.remove(user);
      })
    })
  }

  return Socket;
})();

module.exports = Socket;