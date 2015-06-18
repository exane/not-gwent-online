var User = (function(){
  var User = function(socket){
    if(!(this instanceof User)){
      return (new User(socket));
    }
    /**
     * constructor here
     */


    this.socket = socket;
    this._rooms = [];
    this._id = socket.id;
    this.generateName();
  };
  var r = User.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._id = null;
  r._name = null;
  r._rooms = null;
  r._searching = false;
  r.socket = null;
  r.disconnected = false;

  r.getID = function(){
    return this._id;
  }

  r.joinRoom = function(roomid){
    var self = this;
    /*this.socket.on(roomid, function(d) {
      var event = d.event, data = d.data;
      self.socket.on(event, data);
    });*/
  }

  r.send = function(event, data, room){
    room = room || null;
    data = data || null;
    if(!room){
      this.socket.emit(event, data);
    }
    else {/*
      this.socket.to(room).emit(event, data);*/
      this.socket.global.publish(room, {
        event: event,
        data: data
      })
    }
  }

  r.generateName = function(){
    var name = "Player" + (((Math.random() * 8999) + 1000) | 0);
    //if(lobby.hasUser(name)) return generateName();
    this._name = name;
    return name;
  }

  r.setName = function(name) {
    console.log("user name changed from %s to %s", this._name, name);
    this._name = name;
  }

  r.getName = function() {
    return this._name;
  }

  r.getRoom = function() {
    return this._rooms[0];
  }

  r.addRoom = function(room) {
    this._rooms.push(room);
  }

  r.cleanUp = function() {
    for(var i=0; i<this._rooms.length; i++) {
      var room = this._rooms[i];
      if(room[i] === null) {
        this._rooms.splice(i, 1);

        return this.cleanUp();
      }
    }
  }

  r.disconnect = function() {
    var self = this;
    this.disconnected = true;

    this._rooms.forEach(function(room) {
      room.leave(self);
      if(!room.hasUser()) {
        console.log("Remove room: ", room.getID());
        room = null;
      }
    })

    this.cleanUp();
  }


  return User;
})();

module.exports = User;