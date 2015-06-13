var Battleside = require("./Battleside");

var io = global.io;

var Battle = (function(){
  var Battle = function(id, p1, p2){
    if(!(this instanceof Battle)){
      return (new Battle(id, p1, p2));
    }
    /**
     * constructor here
     */
    this._id = id;
    this._user1 = p1;
    this._user2 = p2;
  };
  var r = Battle.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r.p1 = null;
  r.p2 = null;
  r._user1 = null;
  r._user2 = null;
  r.turn = 0;

  r._id = null;


  r.init = function(){
    this.p1 = Battleside(this._user1.getName(), 0, this);
    this.p2 = Battleside(this._user2.getName(), 1, this);
    this.p1.foe = this.p2;
    this.p2.foe = this.p1;

    this.p1.send("update:info", {info: this.p1.getInfo()});
    this.p2.send("update:info", {info: this.p2.getInfo()});

    this.start();
  }

  r.start = function() {
    this.p1.draw(10);
    this.p2.draw(10);

    //this.p2.wait();
  }

  r.send = function(event, data) {
    io.to(this._id).emit(event, data);
  }

  return Battle;
})();

module.exports = Battle;