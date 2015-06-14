var io = global.io;
var DeckData = require("../assets/data/deck");
var Deck = require("./Deck");
var Hand = require("./Hand");
var Card = require("./Card");
var Field = require("./Field");
var PubSub = require("pubsub-js");


var Battleside = (function(){
  var Battleside = function(name, n, battle, user){
    if(!(this instanceof Battleside)){
      return (new Battleside(name, n, battle, user));
    }
    /**
     * constructor here
     */

    this._isWaiting = true;
    this.socket = user.socket;
    this.field = {};
    this.field[Card.TYPE.LEADER] = Field(Card.TYPE.LEADER);
    this.field[Card.TYPE.CLOSE_COMBAT] = Field(Card.TYPE.CLOSE_COMBAT);
    this.field[Card.TYPE.RANGED] = Field(Card.TYPE.RANGED);
    this.field[Card.TYPE.SIEGE] = Field(Card.TYPE.SIEGE);
    this.n = n ? "p2" : "p1";
    this._name = name;
    this.battle = battle;
    this.hand = Hand();
    this.deck = Deck(DeckData["test"]);


    PubSub.subscribe("turn/" + this.getID(), this.onTurnStart.bind(this));
  };
  var r = Battleside.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._name = null;
  r._discard = null;
  /*r.leaderField = null;
  r.closeField = null;
  r._range = null;
  r._siege = null;
  r._field = null;*/
  r._lives = 2;
  r._score = 0;
  r._isWaiting = null;

  r.field = null;

  r.socket = null;
  r.n = null;

  r.foe = null;
  r.hand = null;
  r.battle = null;
  r.deck = null;

  r.wait = function(){
    this._isWaiting = true;
    this.send("set:waiting", {waiting: this._isWaiting}, true);
  }

  r.turn = function() {
    this._isWaiting = false;
    this.send("set:waiting", {waiting: this._isWaiting}, true);
  }

  r.setLeadercard = function(){
    var leaderCard = this.deck.find("type", Card.TYPE.LEADER);
    this.deck.removeFromDeck(leaderCard[0]);
    /*
        this.getYourside().setField("leader", leaderCard[0]);*/
    this.field[Card.TYPE.LEADER].add(leaderCard[0]);
  }

  r.getID = function() {
    return this.n;
  }

  r.draw = function(times){
    while(times--) {
      var card = this.deck.draw();
      this.hand.add(card);
    }

    console.log("update:hand fired");

    this.update();
  }

  r.calcScore = function() {
    var score = 0;
    for(var key in this.field) {
      score += +this.field[key].getScore();
    }
    return this._score = score;
  }

  r.getInfo = function(){
    console.log(this.getName(), this._isWaiting);
    return {
      name: this.getName(),
      lives: this._lives,
      score: this.calcScore(),
      hand: this.hand.length()
    }
  }

  r.getName = function(){
    return this._name;
  }

  r.send = function(event, msg, isPrivate){
    msg = msg || {};
    isPrivate = typeof isPrivate === "undefined" ? false : isPrivate;
    msg._roomSide = this.n;

    if(isPrivate) {
      return this.socket.emit(event, msg);
    }
    this.battle.send(event, msg);
  }

  r.receive = function(event, cb) {
    this.socket.on(event, cb);
  }

  r.update = function(){
    this.send("update:info", {
      info: this.getInfo(),
      leader: this.field[Card.TYPE.LEADER].get()[0]
    })
    this.send("update:hand", {
      cards: JSON.stringify(this.hand.getCards())
    });
    this.send("update:fields", {
      close: this.field[Card.TYPE.CLOSE_COMBAT],
      ranged: this.field[Card.TYPE.RANGED],
      siege: this.field[Card.TYPE.SIEGE]
    })
  }

  r.onTurnStart = function() {
    this.foe.wait();
    this.turn();
    var self = this;

    this.receive("play:cardFromHand", function(data) {
      var cardID = data.id;
      var card = self.hand.getCard(cardID);
      self.hand.remove(cardID);

      self.playCard(card);
    })
  };

  r.playCard = function(card) {
    if(card === -1) return;
    var field = this.field[card.getType()];

    field.add(card);

    this.update();

    PubSub.publish("nextTurn");
  }


  return Battleside;
})();

module.exports = Battleside;