var Field = (function(){
  var Field = function(){
    if(!(this instanceof Field)){
      return (new Field());
    }
    /**
     * constructor here
     */

    this._cards = [];
  };
  var r = Field.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._cards = null;
  r._score = 0;

  r.add = function(card) {
    this._cards.push(card);
    this.updateScore();
  }

  r.get = function() {
    return this._cards;
  }

  r.getScore = function() {
    return this._score;
  }

  r.updateScore = function() {
    this._score = 0;
    for(var i=0; i<this._cards.length; i++) {
      var card = this._cards[i];
      this._score += card.getPower();
    }
  }


  return Field;
})();

module.exports = Field;