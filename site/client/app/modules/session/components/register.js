module.exports = {

  template: require('./../views/register.html'),

  inherit: true,

  data: function() {
    return {
      username: '',
      password: '',
      email: ''
    }
  },

  methods: {
    register: function(e) {
      e.preventDefault();

      if( ! this.username || ! this.password || ! this.email) {
        $('.form-error').hide().fadeIn('fast');

        return false;
      }

      $('.form-error').hide();
      $('.icon-action-load').show();

      this.$http.post('./api/register', this.$data, function(data) {

        location.reload();

      }).error(function (data) {

        $('.icon-action-load').hide();

      })

      return false;
    }
  }
};