var cards = require("../../../../../../assets/data/cards");
var deck = require("../../../../../../assets/data/deck");

module.exports = {

  template: require('../views/deck-builder.html'),

  data: function() {
    return {
      cards: [],
      deck: [],

      allLeaders: [],
      myLeaders: [],

      factionFilter: 'northern_realm',

      modalLeader: false
    }
  },

  components: {
    showleaders: require('./show-leaders')
  },

  ready: function() {
    this.initCards();
    this.initDeck();
  },

  filters: {
    getType: function(c, type) {
      var tmp = $.map(c, (item) => {
        //if(item.type == type) return item;
        if($.inArray(item.type, type) > -1) return item;
      });

      return tmp;
    }
  },

  methods: {
    changeDeck: function(deck) {
      // todo: load animation
      $('.all-cards, .all-deck').addClass('remove');
      this.factionFilter = deck;
      this.initDeck();
      $('.all-cards, .all-deck').scrollTop(0);

      setTimeout(function() {
        $('.all-cards, .all-deck').removeClass('remove');
      }, 500);
    },

    // Filter for leaders and store them separately.
    initCards: function() {
      this.cards = $.map(cards, (n) => {
        if(n.type != 3) return n;

        this.allLeaders.push(n);
      });
    },

    initDeck: function() {
      this.deck = [];
      var _deck = deck[this.factionFilter];

      for(var item in _deck) {
        this.deck.push(cards[_deck[item]]);
      }
    },

    showLeaders: function(currentLeader) {
      this.myLeaders = $.map(this.allLeaders, (item) => {
        if(item.faction == this.factionFilter) return item;
      });

      this.modalLeader = true;
    }
  }
};