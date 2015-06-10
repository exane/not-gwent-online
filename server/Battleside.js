var Battleside = (function(){
  var Battleside = function(player){
    if(!(this instanceof Battleside)){
      return (new Battleside(player));
    }
    /**
     * constructor here
     */

    this._player = player;
  };
  var r = Battleside.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._player = null;
  r._deck = null;
  r._discard = null;
  r._hand = null;
  r._leader = null;
  r._close = null;
  r._range = null;
  r._siege = null;
  r._field = null;


  return Battleside;
})();

module.exports = Battleside;