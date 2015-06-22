module.exports = {

  template: require('../views/inner.html'),

  data: function() {
    return {
      modal: false
    }
  },

  components: {
    searchmatch: require('./modals/searchMatch'),
    navigation: require('./navigation'),
    chat: require('./chat'),

    lobby: require('./lobby'),
    deckBuilder: require('./deckBuilder')
  }

};