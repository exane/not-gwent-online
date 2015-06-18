module.exports = {

  "agile": {

  },
  "medic": {

  },
  "morale_boost": {
      onAfterPlace: function(card) {
      var field = this.field[card.getType()];
      var cards = field.get();

      cards.forEach(function(_card) {
        if(_card.getID() == card.getID()) return;
        if(_card.getRawPower() === -1) return;
        _card.boost(1);
      })
    }
  },
  "muster": {
    onAfterPlace: function(card){
      var name = card.getName();
      var self = this;

      var cards = this.deck.find("name", name);
      cards.forEach(function(_card) {
        self.deck.removeFromDeck(_card);
        this.placeCard(_card);
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
        cards[lastInsert - 2].boost(+cards[lastInsert - 2].getPower());
        cards[lastInsert - 1].boost(+cards[lastInsert - 1].getPower());
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
    onEachTurn: function(card) {
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card) {
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    },
    onEachCardPlace: function(card) {
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card) {
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    }
  },
  "weather_rain": {
    onEachTurn: function(card) {
      var targetRow = card.constructor.TYPE.SIEGE;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card) {
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });

    }
  },
  "weather_frost": {
    onEachTurn: function(card) {
      var targetRow = card.constructor.TYPE.CLOSE_COMBAT;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function(_card) {
        if(_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });

    }
  },
  "clear_weather": {
    onAfterPlace: function(card) {
      var targetRow = card.constructor.TYPE.WEATHER;
      var field = this.field[targetRow].get();

      //todo: remove weather cards
    }
  },
  "decoy": {
    replaceWith: true
  },
  "foltest_leader1": {
    onActivate: function() {
      var cards = this.deck.find("key", "impenetrable_fog")
      if(!cards.length) return;
      var card = this.deck.removeFromDeck(cards[0]);
      this.placeCard(card);
    }
  }
}