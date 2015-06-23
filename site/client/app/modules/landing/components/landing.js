module.exports = {

  template: require('./../views/landing.html'),

  inherit: true,

  data: function() {
    return {
      modal: false
    }
  },

  components: {
    login: require('./../../session/components/login'),
    register: require('./../../session/components/register')
  },

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
    },

    openLogin: function() {
      this.modal = true;

      setTimeout(function() {
        $('.login-username').focus();
      }, 300);
    },

    closeLogin: function(e) {
      if(e.target.className == 'modal active') {
        this.modal = false;
      }
    }
  }

};