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
    this._key = key;
    this._data = CardData[key];
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
  Card.__id = 0;
  Card.TYPE = {
    CLOSE_COMBAT: 0,
    RANGED: 1,
    SIEGE: 2,
    LEADER: 3,
    SPECIAL: 4,
    WEATHER: 5
  };

  r._init = function(){
    this._id = ++Card.__id;
  }

  r.getName = function(){
    return this._data.name;
  }
  r.getPower = function(){
    if(this._forcedPower > -1) {
      return this._forcedPower + this._boost;
    }
    return this._data.power + this._boost;
  }
  r.setForcedPower = function(nr) {
    this._forcedPower = nr;
  }
  r.getRawAbility = function() {
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

  r.getId = function(){
    return this._id;
  }

  r.boost = function(nr) {
    this._boost += nr;
  }

  r.getProperty = function(prop){
    return this._data[prop];
  }

  return Card;
})();

module.exports = Card;