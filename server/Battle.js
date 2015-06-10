var Battleside = require("./Battleside");

var Battle = (function(){
  var Battle = function(){
    if(!(this instanceof Battle)){
      return (new Battle());
    }
    /**
     * constructor here
     */

  };
  var r = Battle.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._player = null;

  r.init = function(p1, p2){
    this.setPlayer(p1, p2);
    this.initBattleside();
    this.render();
  }

  r.setPlayer = function(p1, p2){
    this._player = [];
    this._player.push(p1);
    this._player.push(p2);
  }

  r.initBattleside = function() {
    this._player.forEach(function(p) {
      p.setBattleside(Battleside(p));
    });
  }

  r.render = function() {
    this._player.forEach(function(p) {
      p.send("update:name", p.getID());
    });
  }


  return Battle;
})();

module.exports = Battle;