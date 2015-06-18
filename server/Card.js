var CardData = require("../assets/data/cards");
var AbilityData = require("../assets/data/abilities");

var Card = (function(){
  var Card = function(key){
    if(!(this instanceof Card)){
      return (new Card(key));
    }
    /**
     * constructor here
     */
    this.setDisabled(false);
    this.channel = {};
    this._key = key;
    this._data = CardData[key];
    this._data.key = key;
    this._boost = 0;
    this._forcedPower = -1;
    this._init();

  };
  var r = Card.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._key = null;
  r._data = null;
  r._id = null;
  r._owner = null;
  r._boost = null;
  r._forcedPower = null;
  r._disabled = null;
  Card.__id = 0;
  Card.TYPE = {
    CLOSE_COMBAT: 0,
    RANGED: 1,
    SIEGE: 2,
    LEADER: 3,
    SPECIAL: 4,
    WEATHER: 5
  };

  r.channel = null


  r._init = function(){
    this._id = ++Card.__id;
  }

  r.getName = function(){
    return this._data.name;
  }
  r.getPower = function(){
    if(this._data.power === -1) return 0;
    if(this._forcedPower > -1){
      return this._forcedPower + this._boost;
    }
    return this._data.power + this._boost;
  }
  r.getRawPower = function() {
    return this._data.power;
  }
  r.calculateBoost = function() {
    this._boost = 0;
    for (var key in this._boosts) {
      var boost = this._boosts[key];
      this.boost(boost.getPower());
    }
  }
  r.setForcedPower = function(nr){
    this._forcedPower = nr;
  }
  r.getRawAbility = function(){
    return this._data.ability;
  }
  r.getAbility = function(){
    return AbilityData[this._data.ability];
  }
  r.getImage = function(){
    return "../assets/cards/" + this._data.img + ".png";
  }
  r.getFaction = function(){
    return this._data.faction;
  }
  r.getType = function(){
    return this._data.type;
  }
  r.getKey = function(){
    return this._key;
  }

  r.getID = function(){
    return this._id;
  }

  r.boost = function(nr){
    /*this.getPower(); //to recalculate this._power;*/
    this._boost += nr;
  }

  r.isDisabled = function() {
    return this._disabled;
  }

  r.setDisabled = function(b) {
    this._disabled = b;
  }

  r.getProperty = function(prop){
    return this._data[prop];
  }

  return Card;
})();

module.exports = Card;