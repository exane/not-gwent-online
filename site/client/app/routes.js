require('../../../public/Config.js');

module.exports = {

  maps: {
    '/lobby': {
      component: 'lobby'
    },

    '/deck-builder': {
      component: 'deckBuilder'
    }
  },

  options: {
    history: true,
    root: window.Config.Site.base
  }
}