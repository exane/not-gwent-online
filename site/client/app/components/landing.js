module.exports = {

  template: require('../views/landing.html'),

  components: {
    login: require('./modals/login')
  },

  ready: function() {
    setTimeout(function() {
      $('.container-form-landing').addClass('active')
    }, 400);
  }

};