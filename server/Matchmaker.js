var Promise = require("promise");

var Matchmaker = (function(){
  var Matchmaker = function(connections){
    if(!(this instanceof Matchmaker)){
      return (new Matchmaker(connections));
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

  r.findOpponent = function(user){
    var self = this;

    var promise = new Promise(function(resolve){
      self._queue.push(user);
      self._checkForOpponent(resolve);
    });
    return promise;
  }

  r._checkForOpponent = function(resolve){
    if(this._queue.length <= 1) return;
    console.log(this._queue.length);
    if(!this._checkConnections()) return;
    this._match(this._queue[0], this._queue[1], resolve);
  }

  r._match = function(p1, p2, resolve){
    this._queue.splice(0, 2);
    var roomID = p1.id + p2.id;
    p1.send("get:opponent", {socketID: p2.getID()});
    p2.send("get:opponent", {socketID: p1.getID()});

    p1.joinRoom(roomID);
    p2.joinRoom(roomID);

    resolve(p1, p2, roomID);
  }

  r._checkConnections = function() {
    var res = true;
    var self = this;

    this._queue.forEach(function(user, index) {
      if(!self._connections.hasUser(user)) {
        self._queue.splice(index, 1);
        res = false;
      }
    });

    return res;
  }


  return Matchmaker;
})();

module.exports = Matchmaker;
