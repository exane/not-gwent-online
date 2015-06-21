var Router = require('director').Router;
var router = new Router();

module.exports = {

  template: require('../views/navigation.html'),

  methods: {
    changeView: function(view) {
      router.setRoute('test');
    }
  }

};