var router = require('./../routes');

module.exports = {

  template: require('../views/landing.html'),

  inherit: true,

  ready: function() {
    setTimeout(function() {
      $('.container-form-landing').addClass('active')
    }, 300);
  },

  methods: {
    asGuest: function() {
      // set localstorage for guest
      $('.icon-guest-load').show();

      setTimeout(function() {
        window.location.href = './lobby';
      }, 500);
    }
  }

};