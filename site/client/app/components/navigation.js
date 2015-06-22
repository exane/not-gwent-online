var router = require('./../routes');

module.exports = {

  template: require('../views/navigation.html'),

  inherit: true,

  methods: {
    changeView: function(view) {
      router.changeRoute(view);
    },

    searchMatch: function() {
      this.modal = true;
      // trigger match functions
    }
  }

};