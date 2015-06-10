var Entity = require("./Entity");


var User = (function(){
  var User = function(socket){
    if(!(this instanceof User)){
      return (new User(socket));
    }
    Entity.call(this);
    /**
     * constructor here
     */


    this.socket = socket;
    this._id = socket.id;

  };
  User.prototype = Object.create(Entity.prototype);
  var r = User.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._id = null;
  r.socket = null;

  r.getID = function(){
    return this._id;
  }

  r.joinRoom = function(room){
    this.socket.join(room);
  }

  r.send = function(event, data, room){
    room = room || null;
    data = data || null;
    if(!room){
      this.socket.emit(event, data);
    }
    else {
      this.socket.to(room).emit(event, data);
    }
  }

  return User;
})();

module.exports = User;