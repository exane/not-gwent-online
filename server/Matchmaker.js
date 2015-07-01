
var Matchmaker = (function(){
  var Matchmaker = function(){
    if(!(this instanceof Matchmaker)){
      return (new Matchmaker());
    }
    /**
     * constructor here
     */

    this._connections = connections;
    this._queue = [];

  };
  var r = Matchmaker.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._queue = null;
  r._connections = null;

  r.removeFromQueue = function(user){
    for(var i = 0; i < this._queue.length; i++) {
      var u = this._queue[i];
      if(u.getID() === user.getID()) {
        user._inQueue = false;
        return this._queue.splice(i, 1);
      }
    }
  }

  r.findOpponent = function(user){
    var c = connections;

    var found = this._checkForOpponent();

    if(found){

      var room = Room();
      c.roomCollection[room.getID()] = room;
      room.join(user);
      room.join(found);
      user._inQueue = false;
      found._inQueue = false;
      return room;
    }

    this._getInQueue(user);
  }

  r._getInQueue = function(user){
    //console.log(user.getName() + " joined in queue");
    this._queue.push(user);
    user._inQueue = true;
  }


  r._checkForOpponent = function(){
    if(!this._queue.length) return null;
    var foe = this._queue.splice(0, 1)[0];
    foe._inQueue = false;
    return foe;
  }


  return Matchmaker;
})();

module.exports = Matchmaker;
