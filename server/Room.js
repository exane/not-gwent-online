var shortid = require("shortid");
var Battle = require("./Battle");

var Room = (function(){
  var Room = function(){
    if(!(this instanceof Room)){
      return (new Room());
    }
    /**
     * constructor here
     */

    this._id = shortid.generate();
    this._room = [];
    this._ready = {};
  };
  var r = Room.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.MAX_USER = 2;
  r._room = null;
  r._id = null;
  r._battle = null;
  r._ready = null;

  r.getID = function(){
    return this._id;
  }

  r.join = function(user){
    if(this._room.length >= 2) return;
    this._room.push(user);
    user.setRoom(this);
    user.joinRoom(this.getID());

    if(!this.isOpen()){
      this.initBattle();
    }
  }

  r.isOpen = function(){
    return !(this._room.length >= 2);
  }

  r.send = function(event, data){
    io.to(this._id).emit(event, data);
  }

  r.getPlayers = function(){
    return this._room;
  }

  r.initBattle = function(){
    var self = this;
    var side = 0;
    this._battle = Battle(this._id, this._room[0], this._room[1]);
    this._room[0].send("init:battle", {side: "p1"});
    this._room[1].send("init:battle", {side: "p2"});
  }

  r.setReady = function(user, b){
    b = typeof b == "undefined" ? true : b;
    this._ready[user.getID()] = b;
    if(this.bothReady()) {
      this._battle.init();
    }
    /*
    if(!this.checkIfReady()) return;

    this._room[0].send("init:battle", {side: "p1"});
    this._room[1].send("init:battle", {side: "p2"});
    if(!this.checkIfReady()) return;
    this._battle.init();*/
  }

  r.bothReady = function() {
    return !!this._ready[this._room[0].getID()] && !!this._ready[this._room[1].getID()];
  }
  /*
    r.checkIfReady = function(){
      for(var i = 0; i < this._room.length; i++) {
        if(!this._ready[this._room[i].getID()]) return false;
      }
      return true;
    }*/


  return Room;
})();

module.exports = Room;