var Card = require("./Card");
/*var CardManager = require("./CardManager");*/
var DeckData = require("../assets/data/deck");
var _ = require("underscore");

var Deck = (function(){
  var Deck = function(deck, side){
    if(!(this instanceof Deck)){
      return (new Deck(deck, side));
    }
    /**
     * constructor here
     */

    this.side = side;
    this._deck = [];

    //if(typeof deck !== "object") throw new Error("Deck is not an object!");

    this._originalDeck = [];
    this.setDeck(deck);
  };
  var r = Deck.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._deck = null;
  r._owner = null;
  r._originalDeck = null;
  r._faction = null;

  r.side = null;

  Deck.FACTION = {
    NORTHERN_REALM: "northern",
    SCOIATAEL: "scoiatael",
    NILFGAARDIAN_EMPIRE: "nilfgaardian",
    MONSTERS: "monster"
  }

  r.setDeck = function(deckKey){
    var deck = DeckData[deckKey] ? DeckData[deckKey] : DeckData["northern"];

    if(deckKey === "random"){
      var decks = _.allKeys(DeckData);
      deck = DeckData[decks[(Math.random() * decks.length) | 0]];
    }

    this._originalDeck = deck.data.slice();
    this._deck = deck.data.slice();
    this._faction = deck.faction;

    this._loadCards();
    this.shuffle();
  }

  r.getFaction = function(){
    return this._faction;
  }

  r.getLength = function(){
    return this._deck.length;
  }

  r.length = function(){
    return this.getLength();
  }

  r.getDeck = function(){
    return this._deck;
  }

  r.draw = function(){
    if(!this._deck.length) return 0;
    var card = this.pop();
    return card;
  }

  r._loadCards = function(){
    var self = this;
    this._deck = this.getDeck().map(function(cardkey){
      //return Card(cardkey);
      return self.side.createCard(cardkey);
    });
  }

  r.pop = function(){
    var id = this._deck.pop();
    /*
        var card = CardManager().getCardById(id);*/
    return id;
  }

  r.find = function(key, val){
    var res = [];
    this.getDeck().forEach(function(card){
      if(card.getProperty(key) == val){
        res.push(card);
      }
    });
    return res;
  }

  r.removeFromDeck = function(card){
    var n = this.length();

    for(var i = 0; i < n; i++) {
      var c = this.getDeck()[i];
      if(c.getID() === card.getID()){
        return this.getDeck().splice(i, 1)[0];
      }
    }
    return -1;
  }

  r.shuffle = function(){
    var deck = this.getDeck();

    var n = this.length();
    for(var i = n - 1; i > 0; i--) {
      var j = (Math.random() * i) | 0;
      var tmp;

      tmp = deck[j];
      deck[j] = deck[i];
      deck[i] = tmp;
    }
  }

  r.add = function(card){
    this._deck.push(card);
  }

  return Deck;
})();

module.exports = Deck;