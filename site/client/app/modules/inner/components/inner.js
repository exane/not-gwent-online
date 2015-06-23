module.exports = {

  template: require('../views/inner.html'),

  inherit: true,

  data: function() {
    return {
      modal: false
    }
  },

  components: {
    searchmatch: require('./search-match'),
    navigation: require('./navigation'),
    chat: require('./chat'),

    lobby: require('./../../lobby/components/lobby'),
    deckBuilder: require('./../../deck-builder/components/deck-builder'),
  }

};