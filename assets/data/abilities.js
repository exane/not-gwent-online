module.exports = {

  "agile": {
    name: "agile",
    description: "Agile: Can be placed in either the Close Combat or Ranged Combat row. Cannot be moved once placed.",
    cancelPlacement: true,
    onBeforePlace: function(card){
      var self = this;
      this.send("played:agile", {cardID: card.getID()}, true);
      this.on("agile:setField", function(type){
        self.off("agile:setField");
        card.changeType(type)
        self.placeCard(card, {
          disabled: true
        });
        self.hand.remove(card);
      })
    }
  },
  "medic": {
    name: "medic",
    description: "Medic: Choose one card from your discard pile (excluding heroes / special cards) to play instantly.",
    waitResponse: true,
    onAfterPlace: function(card){
      var discard = this.getDiscard();

      discard = this.filter(discard, {
        "ability": "hero",
        "type": [card.constructor.TYPE.SPECIAL, card.constructor.TYPE.WEATHER]
      })

      this.send("played:medic", {
        cards: JSON.stringify(discard)
      }, true);
    }
  },
  "morale_boost": {
    name: "morale_boost",
    description: "Morale Boost: Adds +1 strength to all units in the row, excluding itself.",
    onEachCardPlace: function(card){
      var field = this.field[card.getType()];
      var id = card.getID();
      if(!field.isOnField(card)){
        field.get().forEach(function(_card){
          if(_card.getID() == id) return;
          if(_card.hasAbility("hero")) return;
          if(_card.getType() != card.getType()) return;
          _card.setBoost(id, 0);
        })
        this.off("EachCardPlace", card.getUidEvents("EachCardPlace"));
        return;
      }

      field.get().forEach(function(_card){
        if(_card.getID() == id) return;
        if(_card.hasAbility("hero")) return;
        if(_card.getType() != card.getType()) return;
        _card.setBoost(id, 1);
      })
    }
  },
  "muster": {
    name: "muster",
    description: "Muster: Find any cards with the same name in your deck and play them instantly.",
    onAfterPlace: function(card){
      var musterType = card.getMusterType();
      var self = this;

      var cardsDeck = this.deck.find("musterType", musterType);
      var cardsHand = this.hand.find("musterType", musterType);

      cardsDeck.forEach(function(_card){
        if(_card.getID() === card.getID()) return;
        self.deck.removeFromDeck(_card);
        self.placeCard(_card, {
          suppress: "muster"
        });
      })
      cardsHand.forEach(function(_card){
        if(_card.getID() === card.getID()) return;
        self.hand.remove(_card);
        self.placeCard(_card, {
          suppress: "muster"
        });
      })
    }
  },
  "tight_bond": {
    name: "tight_bond",
    description: "Tight Bond: Place next to a card with the name same to double the strength of both cards.",
    tightBond: true
  },
  "spy": {
    name: "spy",
    description: "Spy: Place on your opponents battlefield (counts towards their total strength) then draw two new cards from your deck.",
    changeSide: true,
    onAfterPlace: function(){
      this.draw(2);
      this.sendNotification(this.getName() + " activated Spy! Draws +2 cards.")
    }
  },
  "weather_fog": {
    name: "weather_fog",
    description: "Sets the strength of all Ranged Combat cards to 1 for both players.",
    weather: 1/*,
    onEachTurn: function(card){
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card){
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    },
    onEachCardPlace: function(card){
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card){
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    }*/
  },
  "weather_rain": {
    name: "weather_rain",
    description: "Sets the strength of all Siege Combat cards to 1 for both players.",
    weather: 2
    /*onEachTurn: function(card){
      var targetRow = card.constructor.TYPE.SIEGE;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card){
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    },
    onEachCardPlace: function(card){
      var targetRow = card.constructor.TYPE.SIEGE;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card){
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    }*/
  },
  "weather_frost": {
    name: "weather_frost",
    description: "Sets the strength of all Close Combat cards to 1 for both players.",
    weather: 0
    /*
      onEachTurn: function(card){
        var targetRow = card.constructor.TYPE.CLOSE_COMBAT;
        var forcedPower = 1;
        var field1 = this.field[targetRow].get();
        var field2 = this.foe.field[targetRow].get();

        var field = field1.concat(field2);

        field.forEach(function(_card){
          if(_card.getRawAbility() == "hero") return;
          _card.setForcedPower(forcedPower);
        });
      },
      onEachCardPlace: function(card){
        var targetRow = card.constructor.TYPE.CLOSE_COMBAT;
        var forcedPower = 1;
        var field1 = this.field[targetRow].get();
        var field2 = this.foe.field[targetRow].get();

        var field = field1.concat(field2);

        field.forEach(function(_card){
          if(_card.getRawAbility() == "hero") return;
          _card.setForcedPower(forcedPower);
        });
      }*/
  },
  "weather_clear": {
    name: "weather_clear",
    description: "Removes all Weather Card (Biting Frost, Impenetrable Fog and Torrential Rain) effects.",
    weather: 5
    /*onAfterPlace: function(card){
      var targetRow = card.constructor.TYPE.WEATHER;
      var field = this.field[targetRow];
      field.removeAll();

      for(var i = card.constructor.TYPE.CLOSE_COMBAT; i < card.constructor.TYPE.SIEGE; i++) {
        var _field1, _field2, _field;
        _field1 = this.field[i].get();
        _field2 = this.foe.field[i].get();
        _field = _field1.concat(_field2);

        _field.forEach(function(_card){
          if(_card.getRawAbility() == "hero") return;
          _card.setForcedPower(-1);
        });
      }

    }*/
  },
  "decoy": {
    name: "decoy",
    description: "Decoy: Swap with a card on the battlefield to return it to your hand.",
    replaceWith: true
  },
  "scorch_card": {
    name: "scorch",
    description: "Scorch: Discard after playing. Kills the strongest card(s) in the battlefield.",
    scorch: true,
    removeImmediately: true,
    nextTurn: true
  },
  "scorch": {
    name: "scorch",
    description: "Scorch: Destroy your enemy's strongest close combat unit(s) if the combined strength of all of his or her combat unit(s) is 10 or more.",
    scorchMelee: true
  },
  "commanders_horn": {
    name: "commanders_horn",
    description: "Commander's Horn: Doubles the strength of all unit cards in a row. Except this card.",
    commandersHorn: true
  },
  "commanders_horn_card": {
    name: "commanders_horn",
    description: "Commander's Horn: Doubles the strength of all unit cards in a row. Limited to 1 per row.",
    cancelPlacement: true,
    commandersHorn: true,
    isCommandersHornCard: true
  },
  "foltest_leader1": {
    name: "",
    description: "",
    onActivate: function(){
      var cards = this.deck.find("key", "impenetrable_fog")
      if(!cards.length) return;
      var card = this.deck.removeFromDeck(cards[0]);
      this.placeCard(card);
    }
  },
  "foltest_leader2": {
    name: "",
    description: "",
    onActivate: function(){
      this.setWeather(5);
    }
  },
  "foltest_leader3": {
    name: "",
    description: "Doubles the strength of all Siege units, unless a Commander's Horn is already in play on that row",
    onActivate: function(){
      this.setHorn("commanders_horn", 2);
    }
  },
  "foltest_leader4": {
    name: "",
    description: "",
    onActivate: function(){
      //scorch siege
    }
  },
  "francesca_leader1": {
    name: "",
    description: "",
    onActivate: function(){
      var cards = this.deck.find("key", "biting_frost")
      if(!cards.length) return;
      var card = this.deck.removeFromDeck(cards[0]);
      this.placeCard(card);
    }
  },
  "francesca_leader2": {
    name: "Francesca Findabair the Beautiful",
    description: "Doubles the strength of all your Ranged Combat units (unless a Commander's Horn is also present on that row).",
    onActivate: function(){
      this.setHorn("commanders_horn", 1);
    }
  },
  "francesca_leader3": {
    name: "",
    description: "",
    onActivate: function(){
    }
  },
  "francesca_leader4": {
    name: "",
    description: "",
    onActivate: function(){
    }
  },
  "eredin_leader1": {
    name: "",
    description: "",
    onActivate: function(){
    }
  },
  "eredin_leader2": {
    name: "",
    description: "",
    onActivate: function(){
    }
  },
  "eredin_leader3": {
    name: "",
    description: "",
    onActivate: function(){

    }
  },
  "eredin_leader4": {
    name: "Eredin King of the Wild Hunt",
    description: "Double the strength of all your Close Combat units (unless a Commander's Horn is also present on that row).",
    onActivate: function(){
      this.setHorn("commanders_horn", 0);
    }
  },
  "emreis_leader4": {
    name: "Emhyr vas Emreis the Relentless",
    description: "Draw a card from your opponent's discard pile.",
    waitResponse: true,
    onActivate: function(card){
      var discard = this.foe.getDiscard();

      discard = this.filter(discard, {
        "ability": "hero",
        "type": [card.constructor.TYPE.SPECIAL, card.constructor.TYPE.WEATHER]
      })

      this.send("played:emreis_leader4", {
        cards: JSON.stringify(discard)
      }, true);
    }
  },
  "hero": {
    name: "hero",
    description: "Hero: Not affected by special cards, weather cards or abilities."
  }
}