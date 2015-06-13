
var io = global.io;
var DeckData = require("../assets/data/deck");
var Deck = require("./Deck");
var Hand = require("./Hand");


var Battleside = (function(){
  var Battleside = function(name, n, battle){
    if(!(this instanceof Battleside)){
      return (new Battleside(name, n, battle));
    }
    /**
     * constructor here
     */

    this.n = n ? "p2" : "p1";
    this._name = name;
    this.battle = battle;
    this.hand = Hand();
    this.deck = Deck(DeckData["test"]);
  };
  var r = Battleside.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._name = null;
  r._discard = null;
  r._leader = null;
  r._close = null;
  r._range = null;
  r._siege = null;
  r._field = null;

  r.foe = null;
  r.hand = null;
  r.battle = null;
  r.deck = null;


  r.draw = function(times) {
    while(times--) {
      var card = this.deck.draw();
      this.hand.add(card);
    }

    console.log("update:hand fired");

    this.send("update:hand", {cards: JSON.stringify(this.hand.getCards())});
  }

  r.send = function(event, msg) {
    msg = msg || {};
    msg._roomSide = this.n;
    this.battle.send(event, msg);
  }



  return Battleside;
})();

module.exports = Battleside;