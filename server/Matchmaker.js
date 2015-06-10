var Promise = require("promise");

var Matchmaker = (function(){
  var Matchmaker = function(){
    if(!(this instanceof Matchmaker)){
      return (new Matchmaker());
    }
    /**
     * constructor here
     */

    this._queue = [];
  };
  var r = Matchmaker.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._queue = null;

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
    this._match(this._queue[0], this._queue[1], resolve);
  }

  r._match = function(p1, p2, resolve){
    this._queue.splice(0, 2);
    var roomID = p1.id + p2.id;
    p1.send("update:opponent", {opponent: p2.getID()});
    p2.send("update:opponent", {opponent: p1.getID()});

    p1.joinRoom(roomID);
    p2.joinRoom(roomID);

    resolve(p1, p2, roomID);
  }


  return Matchmaker;
})();

module.exports = Matchmaker;
