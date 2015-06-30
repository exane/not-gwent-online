var Card = require("./Card");

var CardManager = (function(){
  var CardManager = function(){
    if(!(this instanceof CardManager)){
      return (new CardManager());
    }
    /**
     * constructor here
     */

    this._id = 0;
    this._cards = {};
  };
  var r = CardManager.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._id = null;
  r._cards = null;

  r.create = function(key, owner) {
    return this._cards[this._id] = Card(key, owner, this._id++);
  }


  return CardManager;
})();

module.exports = CardManager;