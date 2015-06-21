var Router = require('director').Router;
var router = new Router();

module.exports = {

  init: function(app) {
    router.on('/', function() {
      app.view = 'landing';
      app.section = 'landing';
    });

    router.on('/lobby', function() {
      app.view = 'lobby';
      app.section = 'inner';
    });

    this.configure();
    router.init('/');
  },

  configure: function() {
    router.configure({
      notfound: function() {
        router.setRoute('/')
      }
    })
  }
}