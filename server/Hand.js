/*var $ = require("jquery");*//*
var CardManager = require("./CardManager");*//*
var PubSub = require("./pubsub");*/
var Card = require("./Card");


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

  r.add = function(card){/*
    console.log(card.getID(), card.getName());*/
    this._hand.push(card);
  }

  r.getCards = function(){
    return this._hand;
  }

  r.getCard = function(id) {
    for(var i=0; i< this.length(); i++) {
      var card = this.getCards()[i];
      if(card.getID() === id) return card;
    }
    return -1;
  }

  r.remove = function(id){
    var n = this.length();

    //console.trace(id);
    id = id instanceof Card ? id.getID() : id;

    if(!n) return -1;

    for(var i = 0; i < n; i++) {
      if(!this._hand[i]) {
        console.trace(this._hand[i]);
        continue;
      }
      if(this._hand[i].getID() != id) continue;
      return this._hand.splice(i, 1);
    }

    return -1;
  }

  r.getRandomCard = function(){
    var rnd = (Math.random() * this._hand.length) | 0;
    if(!this._hand.length) return -1;
    return this._hand[rnd];
  }

  r.getLength = function(){
    return this._hand.length;
  }

  r.length = function(){
    return this._hand.length;
  }

  r.find = function(key, val) {
    var res = [];
    this._hand.forEach(function(card){
      if(card.getProperty(key) == val){
        res.push(card);
      }
    });
    return res;
  }


  return Hand;
})();

module.exports = Hand;