var cards = require("../../../../../../assets/data/cards");
var deck = require("../../../../../../assets/data/deck");

module.exports = {

  template: require('../views/deck-builder.html'),

  data: function() {
    return {
      cards: [],
      deck: []
    }
  },

  ready: function() {
    this.cards = $.map(cards, function(n) {
      if(n.faction == 'Northern Realm' && n.type != 3) return n;
    });

    $.map(deck, (n, i) => {
      if(i == 'northern_realm') {
        for(var m in n) {
          //console.log(this.cards[m].type);
          this.deck.push(this.cards[m]);
        }
      }
    });
  },

  filters: {
    leader: function(deck) {
      //return deck.type == 3 ? deck : 'ne';
    }
  }
};