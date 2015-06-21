var Router = require('director').Router;
var router = new Router();

module.exports = {

  init: function(app) {
    router.on('/lobby', function() {
      app.view = 'lobby';
      app.section = 'inner';
    });

    router.on('/test', function() {
    })

    this.configure();
    router.init();
  },

  configure: function() {
    router.configure({
      html5history: true
    })
  }
}