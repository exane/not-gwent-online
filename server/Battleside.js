var io = global.io;
var DeckData = require("../assets/data/deck");
var Deck = require("./Deck");
var Hand = require("./Hand");
var Card = require("./Card");
var Field = require("./Field");


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
    this._discard = [];

    this.runEvent = this.battle.runEvent.bind(this.battle);
    this.on = this.battle.on.bind(this.battle);
    this.off = this.battle.off.bind(this.battle);


    this.receive("activate:leader", function(){
      if(self._isWaiting) return;
      if(self.isPassing()) return;

      console.log("leader activated");

      var leaderCard = self.getLeader();
      if(leaderCard.isDisabled()) return;


      var ability = leaderCard.getAbility();

      ability.onActivate.apply(self);
      leaderCard.setDisabled(true);
      self.update();
    })
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
      if(card === -1) throw new Error("decoy:replace | unknown card");
      self.runEvent("Decoy:replaceWith", self, [card]);
    })
    this.receive("cancel:decoy", function(){
      self.off("Decoy:replaceWith");
    })
    this.receive("set:passing", function(){
      self.setPassing(true);
      self.update();
      self.runEvent("NextTurn", null, [self.foe]);
    })

    this.on("Turn" + this.getID(), this.onTurnStart, this);
  };
  var r = Battleside.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._name = null;
  r._discard = null;

  r._rubies = 2;
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

  r.isPassing = function(){
    return this._passing;
  }

  r.setUpWeatherFieldWith = function(p2){
    this.field[Card.TYPE.WEATHER] = p2.field[Card.TYPE.WEATHER] = Field(Card.TYPE.WEATHER);
  }

  r.findCardOnFieldByID = function(id){
    for(var key in this.field) {
      var field = this.field[key];
      var card = field.getCard(id);
      if(card !== -1) return card;
    }
    return -1;
  }

  r.setPassing = function(b){
    this._passing = b;
    this.send("set:passing", {passing: this._passing}, true);
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

  r.getLeader = function(){
    return this.field[Card.TYPE.LEADER].get()[0];
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
      lives: this._rubies,
      score: this.calcScore(),
      hand: this.hand.length(),
      discard: this.getDiscard(true),
      passing: this._passing
    }
  }

  r.getRubies = function(){
    return this._rubies;
  }

  r.getScore = function(){
    return +this.calcScore();
  }

  r.removeRuby = function(){
    this._rubies--;
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
    //PubSub.publish("update");
    this.runEvent("Update");
  }

  r.onTurnStart = function(){
    this.foe.wait();
    this.turn();

    //wait for cardplay event


  };

  r.playCard = function(card){
    if(card === null || card === -1) return;

    if(!this.placeCard(card)) return;

    this.hand.remove(card);

    this.update();


    this.runEvent("NextTurn", null, [this.foe]);
  }

  r.placeCard = function(card){
    var obj = {};

    this.checkAbilities(card, obj);
    if(obj._canclePlacement) return 0;

    var field = obj.targetSide.field[card.getType()];
    field.add(card);

    //PubSub.publish("onEachCardPlace");
    this.runEvent("OnEachCardPlace");

    this.checkAbilityOnAfterPlace(card);

    this.update();

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

        this.on("Decoy:replaceWith", function(replaceCard){
          if(replaceCard.getType() == Card.TYPE.LEADER ||
          replaceCard.getType() == Card.TYPE.WEATHER ||
          replaceCard.getType() == Card.TYPE.SPECIAL){
            return;
          }
          if(replaceCard.getName() === card.getName()) return;
          self.off("Decoy:replaceWith");
          var field = self.field[replaceCard.getType()];


          field.replaceWith(replaceCard, card);

          self.hand.add(replaceCard);
          self.hand.remove(card);
          self.update();

          self.runEvent("NextTurn", null, [self.foe]);
        })
      }
      if(ability.onEachTurn){
        this.on("EachTurn", ability.onEachTurn, this, [card])
      }
      if(ability.onEachCardPlace){
        //PubSub.subscribe("onEachCardPlace", ability.onEachCardPlace.bind(this, card));
        this.on("EachCardPlace", ability.onEachCardPlace, this, [card]);
      }

      this.update();
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

  r.clearMainFields = function(){
    var cards1 = this.field[Card.TYPE.CLOSE_COMBAT].removeAll();
    var cards2 = this.field[Card.TYPE.RANGED].removeAll();
    var cards3 = this.field[Card.TYPE.SIEGE].removeAll();

    var cards = cards1.concat(cards2.concat(cards3));
    this.addToDiscard(cards);
  }

  r.addToDiscard = function(cards){
    var self = this;
    cards.forEach(function(card){
      self._discard.push(card);
    });
  }

  r.getDiscard = function(json){
    if(json){
      return JSON.stringify(this._discard);
    }
    return this._discard;
  }

  r.resetNewRound = function(){
    this.clearMainFields();
    this.setPassing(false);
  }

  return Battleside;
})();

module.exports = Battleside;