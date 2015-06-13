var Battleside = require("./Battleside");

var io = global.io;

var Battle = (function(){
  var Battle = function(id){
    if(!(this instanceof Battle)){
      return (new Battle(id));
    }
    /**
     * constructor here
     */
    this._id = id;
  };
  var r = Battle.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r.p1 = null;
  r.p2 = null;
  r.turn = 0;

  r._id = null;


  r.init = function(){
    this.p1 = Battleside("Player 1", 0, this);
    this.p2 = Battleside("Player 2", 1, this);
    this.p1.foe = this.p2;
    this.p2.foe = this.p1;

    this.start();
  }

  r.start = function() {
    this.p1.draw(10);
    this.p2.draw(10);
  }

  r.send = function(event, data) {
    io.to(this._id).emit(event, data);
  }

  return Battle;
})();

module.exports = Battle;