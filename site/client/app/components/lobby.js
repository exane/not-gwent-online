module.exports = {

  template: require('../views/lobby.html'),

  data: function() {
  	return {
  		modal: false
  	}
  },

  components: {
  	searchmatch: require('./modals/searchMatch'),
  	navigation: require('./navigation')
  }

};