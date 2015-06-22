var router = require('./../routes');

module.exports = {

  template: require('../views/navigation.html'),

  inherit: true,

  methods: {
    searchMatch: function() {
      this.modal = true;
      // trigger match functions
    }
  }

};