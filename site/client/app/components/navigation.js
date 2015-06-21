var router = require('./../routes');

module.exports = {

  template: require('../views/navigation.html'),

  methods: {
    changeView: function(view) {
      router.changeRoute(view);
    }
  }

};