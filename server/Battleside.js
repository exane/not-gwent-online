var io = global.io;
var DeckData = require("../assets/data/deck");
var Deck = require("./Deck");
var Hand = require("./Hand");
var Card = require("./Card");
var Field = require("./Field");
var PubSub = require("pubsub-js");


var Battleside;
Battleside = (function(){
  var Battleside = function(name, n, battle, user){
    if(!(this instanceof Battleside)){
      return (new Battleside(name, n, battle, user));
    }
    /**
     * constructor here
     */

    var self = this;
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


    this.receive("play:cardFromHand", function(data){
      if(self._isWaiting) return;
      if(self.isPassing()) return;
      var cardID = data.id;
      var card = self.hand.getCard(cardID);

      self.playCard(card);
    })
    this.receive("decoy:replaceWith", function(data){
      if(self._isWaiting) return;
      var card = self.findCardOnFieldByID(data.cardID);
      if(card === -1) throw "decoy:replace | unknown card";
      PubSub.publish("decoy:replaceWith", card);
    })
    this.receive("set:passing", function() {
      self.setPassing(true);
      self.update();
      PubSub.publish("nextTurn");
    })

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
  r._passing = null;

  r.field = null;

  r.socket = null;
  r.n = null;

  r.foe = null;
  r.hand = null;
  r.battle = null;
  r.deck = null;

  r.isPassing = function() {
    return this._passing;
  }

  r.setUpWeatherFieldWith = function(p2){
    this.field[Card.TYPE.WEATHER] = p2.field[Card.TYPE.WEATHER] = Field(Card.TYPE.WEATHER);
  }

  r.findCardOnFieldByID = function(id) {
    for(var key in this.field) {
      var field = this.field[key];
      var card = field.getCard(id);
      if(card !== -1) return card;
    }
    return -1;
  }

  r.setPassing = function(b) {
    this._passing = b;
  }

  r.wait = function(){
    this._isWaiting = true;
    this.send("set:waiting", {waiting: this._isWaiting}, true);
  }

  r.turn = function(){
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

  r.getID = function(){
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

  r.calcScore = function(){
    var score = 0;
    for(var key in this.field) {
      score += +this.field[key].getScore();
    }
    return this._score = score;
  }

  r.getInfo = function(){
    return {
      name: this.getName(),
      lives: this._lives,
      score: this.calcScore(),
      hand: this.hand.length(),
      passing: this._passing
    }
  }

  r.getName = function(){
    return this._name;
  }

  r.send = function(event, msg, isPrivate){
    msg = msg || {};
    isPrivate = typeof isPrivate === "undefined" ? false : isPrivate;
    msg._roomSide = this.n;

    if(isPrivate){
      return this.socket.emit(event, msg);
    }
    this.battle.send(event, msg);
  }

  r.receive = function(event, cb){
    this.socket.on(event, cb);
  }

  r.update = function(){
    /*
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
      })*/
    PubSub.publish("update");
  }

  r.onTurnStart = function(){
    this.foe.wait();
    this.turn();

    //wait for cardplay event


  };

  r.playCard = function(card){
    if(card === null || card === -1) return;

    this.hand.remove(card);

    if(!this.placeCard(card)) return;

    this.update();

    PubSub.publish("nextTurn");
  }

  r.placeCard = function(card){
    var obj = {};

    this.checkAbilities(card, obj);
    if(obj._canclePlacement) return 0;

    var field = obj.targetSide.field[card.getType()];
    field.add(card);

    PubSub.publish("onEachCardPlace");

    this.checkAbilityOnAfterPlace(card);

    return 1;
  }

  r.checkAbilities = function(card, obj){
    var self = this;
    obj.targetSide = this;

    if(card.getAbility()){
      var ability = card.getAbility();
      if(ability.changeSide){
        obj.targetSide = this.foe;
      }
      if(ability.replaceWith){
        obj._canclePlacement = true;

        var decoy = PubSub.subscribe("decoy:replaceWith", function(event, replaceCard){
          if(replaceCard.getType() == Card.TYPE.LEADER ||
          replaceCard.getType() == Card.TYPE.WEATHER ||
          replaceCard.getType() == Card.TYPE.SPECIAL){
            return;
          }
          PubSub.unsubscribe(decoy);
          var field = self.field[replaceCard.getType()];

          field.replaceWith(replaceCard, card);

          self.hand.add(replaceCard);

          self.update();

          PubSub.publish("nextTurn");
        })
      }
      if(ability.onEachTurn){
        PubSub.subscribe("onEachTurn", ability.onEachTurn.bind(this, card));
      }
      if(ability.onEachCardPlace){
        PubSub.subscribe("onEachCardPlace", ability.onEachCardPlace.bind(this, card));
      }

    }
  }

  r.checkAbilityOnAfterPlace = function(card){
    var ability = card.getAbility();
    if(ability){
      if(ability.onAfterPlace){
        ability.onAfterPlace.call(this, card)
      }
    }
  }


  return Battleside;
})();

module.exports = Battleside;