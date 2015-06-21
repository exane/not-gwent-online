module.exports = {

  template: require('../views/landing.html'),

  ready: function() {
    setTimeout(function() {
      $('.container-form-landing').addClass('active')
    }, 400);
  }

};