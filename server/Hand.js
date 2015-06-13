/*var $ = require("jquery");*//*
var CardManager = require("./CardManager");*//*
var PubSub = require("./pubsub");*/


var Hand = (function(){
  var Hand = function(){
    if(!(this instanceof Hand)){
      return (new Hand());
    }
    /**
     * constructor here
     */

    this._hand = [];
  };
  var r = Hand.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._hand = null;

  r.add = function(card){
    this._hand.push(card);
  }

  r.getCards = function(){
    return this._hand;
  }

  r.remove = function(id){
    var n = this.length();

    for(var i = 0; i < n; i++) {
      if(this._hand[i].getId() != id) continue;
      return this._hand.splice(i, 1);
    }
    return -1;
  }

  r.getRandomCard = function(){
    var rnd = (Math.random() * this._hand.length) | 0;
    return this._hand[rnd];
  }

  r.getLength = function(){
    return this._hand.length;
  }

  r.length = function(){
    return this._hand.length;
  }


  return Hand;
})();

module.exports = Hand;