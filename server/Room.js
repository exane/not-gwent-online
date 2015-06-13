var shortid = require("shortid");

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

  r.getID = function() {
    return this._id;
  }

  r.join = function(user) {
    if(this._room.lenght >= 2) return;
    this._room.push(user);
    user.setRoom(this);/*
    user.socket.join(this._id);*/
    user.joinRoom(this.getID());

    if(!this.isOpen()) {
      this._room.forEach(function(user) {
        user.send("init:battle");
      })
    }
  }

  r.isOpen = function() {
    return !(this._room.length >= 2);
  }

  r.send = function(event, data) {
    io.to(this._id).emit(event, data);
  }

  r.getPlayers = function() {
    return this._room;
  }


  return Room;
})();

module.exports = Room;