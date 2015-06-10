var io = require("socket.io-client")("http://localhost:16918");
var Backbone = require("backbone");
var Player = require("./Player");




var Gwent = (function(){
  var Gwent = function(){
    if(!(this instanceof Gwent)){
      return (new Gwent());
    }
    /**
     * constructor here
     */



  };
  var r = Gwent.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.view = null;
  r.enemy = null;
  r.player = null;

  r._view = function() {

  }

  r.init = function() {
    this.player = Backbone.Model.extend({});
    this.enemy = Backbone.Model.extend({});
  }


  return Gwent;
})();

module.exports = Gwent;