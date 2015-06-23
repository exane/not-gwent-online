module.exports = {

  template: require('./../views/register.html'),

  inherit: true,

  methods: {
    register: function(e) {
      e.preventDefault();

      console.log("bal");

      return false;
    }
  }
};