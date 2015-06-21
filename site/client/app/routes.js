var routes = {
  '/lobby': function() {
    alert('lobby');
  },

  '/deck-builder': function() {
    alert('deck-builder');
  },

  '/highscore': function() {
    alert('highscore');
  }
};

var options = {
  html5history: true,
  run_handler_in_init: false,
  convert_hash_in_init: false
}

var Router = require('director').Router;
var router = new Router(routes).configure(options).init();

module.exports = {
  changeRoute: function(route) {
    router.setRoute(route);
  }
}