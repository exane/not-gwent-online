var router = require('./../routes');

module.exports = {

  template: require('../views/navigation.html'),

  inherit: true,

  data: function() {
    return {
      // todo: work with slug filter
      navigation: [
        { name: 'Lobby', route: '/lobby' },
        { name: 'Deck Builder', route: '/deck-builder' },
        { name: 'Highscore', route: '/highscore' }
      ]
    }
  },

  methods: {
    searchMatch: function() {
      this.modal = true;
      // trigger match functions
    }
  }

};