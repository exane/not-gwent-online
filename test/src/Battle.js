var Battle = (function(){
  var Battle = function(){
    if(!(this instanceof Battle)){
      return (new Battle());
    }
    /**
     * constructor here
     */

    this.events = {};


  };
  var r = Battle.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r.events = null;

  r.runEvent = function(eventid, ctx, args){
    ctx = ctx || this;
    args = args || [];
    var event = "on" + eventid;

    if(!this.events[event]){
      return;
    }
    this.events[event].forEach(function(e){
      var obj = e;
      obj.cb = obj.cb.bind(ctx)
      obj.cb.apply(ctx, obj.onArgs.concat(args));
    });
  }

  r.on = function(eventid, cb, ctx, args){
    ctx = ctx || null;
    args = args || [];
    var event = "on" + eventid;

    var obj = {};
    if(!ctx) {
      obj.cb = cb;
    } else {
      obj.cb = cb.bind(ctx);
    }
    obj.onArgs = args;

    if(!(event in this.events)){
      this.events[event] = [];
    }

    if(typeof cb !== "function"){
      throw new Error("cb not a function");
    }

    if(args){
      this.events[event].push(obj);
    }

    else {
      this.events[event].push(obj);
    }
  }

  r.off = function(eventid){
    var event = "on" + eventid;
    this.events[event].forEach(function(e){
      e = null;
    });
    delete this.events[event];
  }


  return Battle;
})();

module.exports = Battle;