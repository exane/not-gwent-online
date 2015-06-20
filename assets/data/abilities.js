module.exports = {

  "agile": {
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
    waitResponse: true,
    onAfterPlace: function(card){
      var discard = this.getDiscard();

      discard = this.filter(discard, {
        "ability": "hero",
        "type": card.constructor.TYPE.SPECIAL
      })

      this.send("played:medic", {
        cards: JSON.stringify(discard)
      }, true);
    }
  },
  "morale_boost": {
    onEachCardPlace: function(card){
      var field = this.field[card.getType()];
      var id = card.getID();
      if(!field.isOnField(card)){
        field.get().forEach(function(_card){
          if(_card.getID() == id) return;
          if(_card.getType() != card.getType()) return;
          _card.setBoost(id, 0);
        })
        this.off("EachCardPlace", card.getUidEvents("EachCardPlace"));
        return;
      }

      field.get().forEach(function(_card){
        if(_card.getID() == id) return;
        if(_card.getType() != card.getType()) return;
        _card.setBoost(id, 1);
      })
    }
  },
  "muster": {
    name: "muster",
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
    onAfterPlace: function(card){
      var field = this.field[card.getType()];
      var cards = field.get();
      var lastInsert = cards.length;

      if(lastInsert < 2) return;

      if(cards[lastInsert - 2].getName() == cards[lastInsert - 1].getName()){
        cards[lastInsert - 2].setBoost(cards[lastInsert - 2].getID(), +cards[lastInsert - 2].getPower());
        cards[lastInsert - 1].setBoost(cards[lastInsert - 1].getID(), +cards[lastInsert - 1].getPower());
      }
    }
  },
  "spy": {
    changeSide: true,
    onAfterPlace: function(card){
      this.draw(2);
    }
  },
  "weather_fog": {
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
    }
  },
  "weather_rain": {
    onEachTurn: function(card){
      var targetRow = card.constructor.TYPE.SIEGE;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card){
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });

    }
  },
  "weather_frost": {
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

    }
  },
  "clear_weather": {
    onAfterPlace: function(card){
      var targetRow = card.constructor.TYPE.WEATHER;
      var field = this.field[targetRow].get();

      //todo: remove weather cards
    }
  },
  "decoy": {
    replaceWith: true
  },
  "foltest_leader1": {
    onActivate: function(){
      var cards = this.deck.find("key", "impenetrable_fog")
      if(!cards.length) return;
      var card = this.deck.removeFromDeck(cards[0]);
      this.placeCard(card);
    }
  },
  "francesca_leader1": {
    onActivate: function(){
    }
  },
  "francesca_leader2": {
    onActivate: function(){
    }
  },
  "francesca_leader3": {
    onActivate: function(){
    }
  },
  "francesca_leader4": {
    onActivate: function(){
    }
  },
  "eredin_leader1": {
    onActivate: function(){
    }
  },
  "eredin_leader2": {
    onActivate: function(){
    }
  },
  "eredin_leader3": {
    onActivate: function(){
    }
  },
  "eredin_leader4": {
    onActivate: function(){
    }
  },
  "hero": {}
}