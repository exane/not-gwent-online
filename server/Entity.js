var Entity = (function(){
  var Entity = function(){
    if(!(this instanceof Entity)){
      return (new Entity());
    }
    /**
     * constructor here
     */


  };
  var r = Entity.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._battleside;

  r.setBattleside = function(b) {
    this._battleside = b;
  }


  return Entity;
})();

module.exports = Entity;