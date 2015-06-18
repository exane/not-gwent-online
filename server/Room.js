var shortid = require("shortid");
var Battle = require("./Battle");

var Room = (function(){
  var Room = function(scServer){
    if(!(this instanceof Room)){
      return (new Room(scServer));
    }
    /**
     * constructor here
     */

    var self = this;
    this._id = shortid.generate();
    this._users = [];
    this._ready = {};
    this.socket = scServer.global;

  };
  var r = Room.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.MAX_USER = 2;
  r._users = null;
  r._id = null;
  r._battle = null;
  r._ready = null;
  r._channel = null;

  r.getID = function(){
    return this._id;
  }

  r.join = function(user){
    if(this._users.length >= 2) return;
    this._users.push(user);
    user.addRoom(this);

    if(!this.isOpen()){
      this.initBattle();
    }
  }

  r.isOpen = function(){
    return !(this._users.length >= 2);
  }

  r.getPlayers = function(){
    return this._users;
  }

  r.initBattle = function(){
    this._battle = Battle(this._id, this._users[0], this._users[1], this.socket);
    this._users[0].send("init:battle", {side: "p1"});
    this._users[1].send("init:battle", {side: "p2"});
  }

  r.setReady = function(user, b){
    b = typeof b == "undefined" ? true : b;
    this._ready[user.getID()] = b;
    if(this.bothReady()){
      this._battle.init();
    }

  }

  r.bothReady = function(){
    return !!this._ready[this._users[0].getID()] && !!this._ready[this._users[1].getID()];
  }

  r.leave = function(user) {
    var p = "p2";
    if(user.getID() === this._users[0].getID()) {
      p = "p1";
    }
    this._battle.userLeft(p);
  }


  return Room;
})();

module.exports = Room;