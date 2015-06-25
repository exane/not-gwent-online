var cards = require("../../../../../../assets/data/cards");
var deck = require("../../../../../../assets/data/deck");

module.exports = {

  template: require('../views/deck-builder.html'),

  data: function() {
    return {
      cards: [],
      deck: [],

      leaders: [],
      leader: null,

      factionFilter: 'northern_realm'
    }
  },

  ready: function() {
    this.initCards();
    this.initDeck();
  },

  filters: {
    getType: function(c, type) {
      var tmp = $.map(c, (item) => {
        if(item.type == type) return item;
      });

      return tmp;

      return c;
    }
  },

  methods: {
    changeDeck: function(deck) {
      // todo: load animation
      $('.all-cards').addClass('remove');
      this.factionFilter = deck;
      this.initDeck();
      $('.all-cards').scrollTop(0);

      setTimeout(function() {
        $('.all-cards').removeClass('remove');
      }, 500);
    },

    // Filter for leaders and store them separately.
    initCards: function() {
      this.cards = $.map(cards, (n) => {
        if(n.type != 3) return n;

        this.leaders.push(n);
      });
    },

    initDeck: function() {
      this.deck = [];
      var _deck = deck[this.factionFilter];

      for(var item in _deck) {
        this.deck.push(cards[_deck[item]]);
      }

    },

    // test
    removeCard: function(el) {

    }
  }
};