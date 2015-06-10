var Entity = require("./Entity");


var Npc = (function(){
  var Npc = function(){
    if(!(this instanceof Npc)){
      return (new Npc());
    }
    Entity.call(this);
    /**
     * constructor here
     */


  };
  Npc.prototype = Object.create(Entity.prototype);
  var r = Npc.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */


  return Npc;
})();

module.exports = Npc;