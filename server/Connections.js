var Connections = (function(){
  var Connections = function(){
    if(!(this instanceof Connections)){
      return (new Connections());
    }
    /**
     * constructor here
     */
    this._connections = {};

  };
  var r = Connections.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._connections = null;

  r.add = function(user) {
    this._connections[user.getID()] = user;
  }

  r.remove = function(user) {
    delete this._connections[user.getID()];
  }

  r.get = function() {
    return this._connections;
  }


  return Connections;
})();

module.exports = Connections;