module.exports = {

  "agile": {

  },
  "medic": {

  },
  "morale_boost": {
    onAfterPlace: function(card) {
      var field = this.getYourside().getField(card.getType());
      var cards = field.getCards();

      cards.forEach(function(_card) {
        _card.boost(1);
      })
    }
  },
  "muster": {
    onAfterPlace: function(card){
      var name = card.getName();
      var self = this;

      var cards = this.getDeck().find("name", name);
      cards.forEach(function(_card) {
        self.getDeck().removeFromDeck(_card.getId());
        this._placeCard(_card);
      })
    }
  },
  "tight_bond": {
    onAfterPlace: function(card){
      var field = this.getYourside().getField(card.getType());
      var cards = field.getCards();
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
      this.drawCards(2);
    }
  },
  "weather_fog": {
    onEachTurn: function(card) {
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.getYourside().getField(targetRow).getCards();
      var field2 = this.getOtherside().getField(targetRow).getCards();

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
      var field1 = this.getYourside().getField(targetRow).getCards();
      var field2 = this.getOtherside().getField(targetRow).getCards();

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
      var field1 = this.getYourside().getField(targetRow).getCards();
      var field2 = this.getOtherside().getField(targetRow).getCards();

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
      var field = this.getYourside().getField(targetRow).getCards();

      //todo: remove weather cards
    }
  },
  "decoy": {
    replaceWith: true
  }
}