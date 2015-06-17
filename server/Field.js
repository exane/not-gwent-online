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

  r.add = function(card){
    this._cards.push(card);
    this.updateScore();
  }

  r.get = function(){
    return this._cards;
  }

  r.getScore = function(){
    this.updateScore();
    return this._score;
  }

  r.updateScore = function(){
    this._score = 0;
    for(var i = 0; i < this._cards.length; i++) {
      var card = this._cards[i];
      this._score += card.getPower();
    }
  }

  r.getPosition = function(card){
    for(var i = 0; i < this._cards.length; i++) {
      if(this._cards[i].getID() === card.getID()) return i;
    }
    return -1;
  }

  r.replaceWith = function(oldCard, newCard){
    var index = this.getPosition(oldCard);
    this._cards[index] = newCard;
    return oldCard;
  }

  r.getCard = function(id){
    for(var i = 0; i < this._cards.length; i++) {
      var card = this._cards[i];
      if(card.getID() == id) return card;
    }
    return -1;
  }

  r.removeAll = function() {
    var tmp = this._cards.slice();
    this._cards = [];
    return tmp;
  }

  return Field;
})();

module.exports = Field;