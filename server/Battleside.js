var DeckData = require("../assets/data/deck");
var Deck = require("./Deck");
var Hand = require("./Hand");
var Card = require("./Card");
var Field = require("./Field");
var _ = require("underscore");
var Promise = require("jquery-deferred");


var Battleside;
Battleside = (function(){
  var Battleside = function(name, n, battle, user){
    if(!(this instanceof Battleside)){
      return (new Battleside(name, n, battle, user));
    }
    /**
     * constructor here
     */

    var deck = user.getDeck();
    var self = this;
    this._isWaiting = true;
    this.socket = user.socket;
    this.field = {};
    this.field[Card.TYPE.LEADER] = Field(this);
    this.field[Card.TYPE.CLOSE_COMBAT] = Field(this, true);
    this.field[Card.TYPE.RANGED] = Field(this, true);
    this.field[Card.TYPE.SIEGE] = Field(this, true);
    /*this.field[Card.TYPE.HORN] = {
      close: Field(this),
      range: Field(this),
      siege: Field(this)
    };*/
    this.n = n ? "p2" : "p1";
    this._name = name;
    this.battle = battle;
    this.hand = Hand();
    this.deck = Deck(DeckData[deck]);
    this._discard = [];

    this.runEvent = this.battle.runEvent.bind(this.battle);
    this.on = this.battle.on.bind(this.battle);
    this.off = this.battle.off.bind(this.battle);


    this.receive("activate:leader", function(){
      if(self._isWaiting) return;
      if(self.isPassing()) return;


      var leaderCard = self.getLeader();
      if(leaderCard.isDisabled()) return;

      console.log("leader activated");

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
    this.receive("medic:chooseCardFromDiscard", function(data){
      if(!data){
        self.runEvent("NextTurn", null, [self.foe]);
        return;
      }
      var cardID = data.cardID;
      var card = self.getCardFromDiscard(cardID);
      if(card === -1) throw new Error("medic:chooseCardFromDiscard | unknown card: ", card);

      self.removeFromDiscard(card);

      self.playCard(card);
    })
    this.receive("agile:field", function(data){
      var fieldType = data.field;
      if(!(fieldType in [0, 1])) throw new Error("set field agile: false fieldtype " + fieldType);
      self.runEvent("agile:setField", null, [fieldType]);
      self.runEvent("NextTurn", null, [self.foe]);
    })
    this.receive("cancel:agile", function(){
      self.off("agile:setField");
    })
    this.receive("horn:field", function(data){
      var fieldType = data.field;
      if(!(fieldType in [0, 1, 2])) throw new Error("set field horn: false fieldtype " + fieldType);
      self.runEvent("horn:setField", null, [fieldType]);
      self.runEvent("NextTurn", null, [self.foe]);
    })
    this.receive("cancel:horn", function(){
      self.off("horn:setField");
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

  r.isWaiting = function(){
    return this._isWaiting;
  }

  r.setUpWeatherFieldWith = function(p2){
    this.field[Card.TYPE.WEATHER] = p2.field[Card.TYPE.WEATHER] = Field(this);
  }

  r.findCardOnFieldByID = function(id){
    for(var key in this.field) {
      var field = this.field[key];
      var card = field.getCard(id);
      if(card !== -1) return card;
    }
    /*
        for(var i = 0; i < this._discard.length; i++) {
          var c = this._discard[i];
          if(c.getID() === id) return c;
        }*/
    return -1;
  }

  r.getCardFromDiscard = function(id){
    for(var i = 0; i < this._discard.length; i++) {
      var c = this._discard[i];
      if(c.getID() === id) return c;
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
      deck: this.deck.length(),
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

  r.update = function(self){
    self = self || false;
    this.runEvent("Update", null, [self]);
  }

  r.onTurnStart = function(){
    this.foe.wait();
    this.turn();

    //wait for cardplay event


  };

  r.playCard = function(card){
    if(card === null || card === -1) return;
    if(this.isWaiting()) return;
    if(this.isPassing()) return;

    if(!this.placeCard(card)) return;

    this.hand.remove(card);

    this.update();


    this.runEvent("NextTurn", null, [this.foe]);
  }

  r.placeCard = function(card, obj){
    obj = _.extend({}, obj);

    if(typeof card === "string"){
      card = Card(card);
    }

    this.checkAbilities(card, obj);
    if(obj._cancelPlacement && !obj.forceField) return 0;


    var field = obj.forceField || null;
    if(typeof obj.isHorn !== "undefined"){
      if(!field){
        field = obj.targetSide.field[obj.isHorn];
      }
      field.add(card, true);
    }
    else {
      if(!field){
        field = obj.targetSide.field[card.getType()];
      }
      field.add(card);
    }


    this.runEvent("EachCardPlace");

    this.checkAbilityOnAfterPlace(card, obj);


    if(obj._waitResponse){
      this.hand.remove(card);
      this.update();
      return 0;
    }

    this.update();

    return 1;
  }

  r.setHorn = function(card, field){
    var self = this;
    field = typeof field === "undefined" ? null : field;

    if(typeof card === "string"){
      card = Card(card);
    }

    if(typeof field === "number"){
      card.changeType(field);
      this.placeCard(card, {
        isHorn: field,
        forcePlace: true
      });
      self.hand.remove(card);
      return;
    }

    this.send("played:horn", {cardID: card.getID()}, true)
    this.on("horn:setField", function(type){
      self.off("horn:setField");
      card.changeType(type);
      self.placeCard(card, {
        isHorn: type,
        disabled: true
      });
      self.hand.remove(card);
    })
  }

  r.commanderHornAbility = function(card){
    var field = this.field[card.getType()];
    var id = "commanders_horn";

    if(typeof field === "undefined"){
      //console.log("field unknown | %s", card.getName());
      return;
    }

    if(!field.isOnField(card)){
      field.get().forEach(function(_card){
        if(_card.getID() == id) return;
        if(_card.getType() != card.getType()) return;
        if(_card.hasAbility("hero")) return;
        _card.setBoost(id, 0);
      })
      this.off("EachCardPlace", card.getUidEvents("EachCardPlace"));
      return;
    }

    field.get().forEach(function(_card){
      if(_card.getID() == id) return;
      if(_card.getType() != card.getType()) return;
      if(_card.hasAbility("hero")) return;
      _card.setBoost(id, 0);
      _card.setBoost(id, _card.getPower());
    })
  }

  r.checkAbilities = function(card, obj, __flag){
    var self = this;
    obj.targetSide = this;
    if(obj.disabled) return;
    var ability = Array.isArray(__flag) || card.getAbility();

    if(Array.isArray(ability) && ability.length){
      var ret = ability.slice();
      ret = ret.splice(0, 1);
      this.checkAbilities(card, obj, ret);
      ability = ability[0];
    }

    if(ability && ability.name === obj.suppress){
      //this.update();
    }

    if(ability && !Array.isArray(ability)){
      if(ability.onBeforePlace){
        ability.onBeforePlace.apply(this, [card]);
      }
      if(ability.isCommandersHornCard && typeof obj.isHorn === "undefined"){
        this.setHorn(card);
      }
      if(ability.commandersHorn){
        ability.onEachCardPlace = this.commanderHornAbility;
        ability.onWeatherChange = this.commanderHornAbility;
      }
      if(ability.cancelPlacement && !obj.forcePlace){
        obj._cancelPlacement = true;
      }
      if(ability.waitResponse && !obj.forcePlace){
        obj._waitResponse = true;
      }
      if(ability.changeSide){
        obj.targetSide = this.foe;
      }
      if(typeof ability.weather !== "undefined"){
        ability.onEachTurn = this.setWeather.bind(this, ability.weather);
        ability.onEachCardPlace = this.setWeather.bind(this, ability.weather);
      }
      if(ability.replaceWith && !obj.forcePlace){
        obj._cancelPlacement = true;
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
          self.runEvent("EachCardPlace");

          self.hand.add(replaceCard);
          self.hand.remove(card);

          self.update();
          self.runEvent("NextTurn", null, [self.foe]);
        })
      }
      if(ability.onEachTurn){
        var uid = this.on("EachTurn", ability.onEachTurn, this, [card])
        card._uidEvents["EachTurn"] = uid;
      }
      if(ability.onEachCardPlace){
        var uid = this.on("EachCardPlace", ability.onEachCardPlace, this, [card]);
        card._uidEvents["EachCardPlace"] = uid;
      }
      if(ability.onWeatherChange){
        var uid = this.on("WeatherChange", ability.onWeatherChange, this, [card]);
        card._uidEvents["WeatherChange"] = uid;
      }

      //this.update();
    }
  }

  r.checkAbilityOnAfterPlace = function(card, obj){
    var ability = card.getAbility();
    if(ability){
      if(ability.name && ability.name === obj.suppress){
        //this.update();
        return;
      }
      if(ability.onAfterPlace){
        ability.onAfterPlace.call(this, card)
      }
    }
  }

  r.setWeather = function(weather){
    var targetRow = weather;
    var field;
    if(typeof targetRow === "undefined") return;


    //console.log(this.field[Card.TYPE.WEATHER]);
    if(targetRow === Card.TYPE.WEATHER){
      field = this.field[targetRow];
      field.removeAll();

      for(var i = Card.TYPE.CLOSE_COMBAT; i <= Card.TYPE.SIEGE; i++) {
        var _field1, _field2, _field;
        _field1 = this.field[i].get();
        _field2 = this.foe.field[i].get();
        _field = _field1.concat(_field2);

        _field.forEach(function(_card){
          if(_card.hasAbility("hero")) return;
          _card.setForcedPower(-1);
        });
      }
      this.runEvent("WeatherChange");
      return;
    }
    var forcedPower = 1;

    if(typeof targetRow === "undefined"){
      console.trace(this);
    }
    var field1 = this.field[targetRow].get();
    var field2 = this.foe.field[targetRow].get();

    field = field1.concat(field2);

    field.forEach(function(_card){
      if(_card.hasAbility("hero")) return;
      _card.setForcedPower(forcedPower);
    });
    this.runEvent("WeatherChange");
    //this.update();
  }

  r.clearMainFields = function(){
    var cards1 = this.field[Card.TYPE.CLOSE_COMBAT].removeAll();
    var cards2 = this.field[Card.TYPE.RANGED].removeAll();
    var cards3 = this.field[Card.TYPE.SIEGE].removeAll();
    var cards4 = this.field[Card.TYPE.WEATHER].removeAll();

    var cards = cards1.concat(cards2.concat(cards3.concat(cards4)));
    this.addToDiscard(cards);
  }

  r.addToDiscard = function(cards){
    var self = this;
    cards.forEach(function(card){
      self._discard.push(card);
    });
  }

  r.removeFromDiscard = function(card){
    for(var i = 0; i < this._discard.length; i++) {
      var c = this._discard[i];
      if(c.getID() === card.getID()){

        this._discard.splice(i, 1);
        return
      }
    }
  }

  r.getDiscard = function(json){
    if(json){
      return JSON.stringify(this._discard);
    }
    return this._discard;
  }

  r.resetNewRound = function(){
    this.clearMainFields();
    this.setWeather(5); //clear weather
    this.setPassing(false);
  }

  r.filter = function(arrCards, opt){
    var arr = arrCards.slice();

    for(var key in opt) {
      var res = [];
      var prop = key, val = opt[key];


      arrCards.forEach(function(card){
        var property = card.getProperty(prop);
        if(_.isArray(property)){
          var _f = false;
          for(var i = 0; i < property.length; i++) {
            if(property[i] === val){
              _f = true;
              break;
            }
          }
          if(!_f){
            res.push(card);
          }
        }
        else if(_.isArray(val)){
          var _f = false;
          for(var i = 0; i < val.length; i++) {
            if(property === val[i]){
              _f = true;
              break;
            }
          }
          if(!_f){
            res.push(card);
          }
        }
        else if(card.getProperty(prop) !== val){
          res.push(card);
        }
      })
      arr = _.intersection(arr, res);
    }

    return arr;
  }

  r.reDraw = function(n){
    var hand = this.hand.getCards();
    var self = this;
    var left = n;
    var deferred = Promise.Deferred();

    this.send("redraw:cards", null, true);

    this.receive("redraw:reDrawCard", function(data){
      var id = data.cardID;
      if(!left) return;
      left--;
      var card = self.hand.remove(id)[0];
      console.log("hand -> deck: ", card.getName());
      self.deck.add(card);
      self.deck.shuffle();
      self.draw(1);
      if(!left) {
        self.send("redraw:close", null, true);
        console.log("redraw finished");
        deferred.resolve("done");
        //self.socket.off("redraw:reDrawCard", h1);
      }
      /*self.update(self);*/
      self.battle.updateSelf(self);
    })

    this.receive("redraw:close_client", function() {
      console.log("redraw finished!");
      deferred.resolve("done");
      //self.socket.off("redraw:close_client", h2);
    })

    return deferred;

  }

  return Battleside;
})();

module.exports = Battleside;