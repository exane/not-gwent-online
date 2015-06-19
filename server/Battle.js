var Battleside = require("./Battleside");
var Card = require("./Card");


var Battle = (function(){
  var Battle = function(id, p1, p2, socket){
    if(!(this instanceof Battle)){
      return (new Battle(id, p1, p2, socket));
    }
    /**
     * constructor here
     */
    this.events = {};
    this._id = id;
    this._user1 = p1;
    this._user2 = p2;
    this.socket = socket;
    this.channel = {};
  };
  var r = Battle.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r.p1 = null;
  r.p2 = null;
  r._user1 = null;
  r._user2 = null;
  r.turn = 0;

  r.socket = null;
  r.channel = null;

  r._id = null;

  r.events = null;

  r.init = function(){
    /*PubSub.subscribe("update", this.update.bind(this));*/
    this.on("Update", this.update);/*
    this.on("AfterPlace", this.checkAbilityOnAfterPlace)*/


    this.channel = this.socket.subscribe(this._id);
    this.p1 = Battleside(this._user1.getName(), 0, this, this._user1);
    this.p2 = Battleside(this._user2.getName(), 1, this, this._user2);
    this.p1.foe = this.p2;
    this.p2.foe = this.p1;
    this.p1.setUpWeatherFieldWith(this.p2);


    this.start();
  }

  r.start = function(){
    this.p1.setLeadercard();
    this.p2.setLeadercard();
    this.p1.draw(10);
    this.p2.draw(10);

    this.p1.hand.add(Card("kaedweni_siege_expert"));
    this.p2.hand.add(Card("kaedweni_siege_expert"));
    /*
    this.p1.hand.add(Card("dun_banner_medic"));
    this.p2.hand.add(Card("dun_banner_medic"));
    this.p1.hand.add(Card("isengrim_faoiltiarnah"));
    this.p2.hand.add(Card("isengrim_faoiltiarnah"));*/

    /*this.p1.addToDiscard([Card("kaedweni_siege_expert")]);
    this.p2.addToDiscard([Card("kaedweni_siege_expert")]);*/
/*
    this.p1.hand.add(Card("decoy"));
    this.p1.hand.add(Card("impenetrable_fog"));
    this.p2.hand.add(Card("decoy"));
    this.p2.hand.add(Card("impenetrable_fog"));*/

    this.update();


    /*PubSub.subscribe("nextTurn", this.switchTurn.bind(this));*/
    this.on("NextTurn", this.switchTurn);

    this.switchTurn(Math.random() > .5 ? this.p1 : this.p2);
  }

  r.switchTurn = function(side, __flag){
    __flag = typeof __flag == "undefined" ? 0 : 1;


    if(!(side instanceof Battleside)){
      console.trace("side is not a battleside!");
      return
    }
    if(side.isPassing()){
      if(__flag){
        return this.startNextRound();
      }
      return this.switchTurn(side.foe, 1);
    }

    this.runEvent("EachTurn");
    this.runEvent("Turn" + side.getID());
    console.log("current Turn: ", side.getName());

  }

  r.startNextRound = function(){
    var loser = this.checkRubies();
    if(this.checkIfIsOver()){
      console.log("its over!");
      this.update();
      return;
    }

    this.p1.resetNewRound();
    this.p2.resetNewRound();

    console.log("start new round!");

    this.update();
    this.switchTurn(loser);
  }

  r.update = function(){
    this._update(this.p1);
    this._update(this.p2);
  }

  r._update = function(p){
    p.send("update:info", {
      info: p.getInfo(),
      leader: p.field[Card.TYPE.LEADER].get()[0]
    })
    p.send("update:hand", {
      cards: JSON.stringify(p.hand.getCards())
    });
    p.send("update:fields", {
      close: p.field[Card.TYPE.CLOSE_COMBAT],
      ranged: p.field[Card.TYPE.RANGED],
      siege: p.field[Card.TYPE.SIEGE],
      weather: p.field[Card.TYPE.WEATHER]
    })
  }

  r.send = function(event, data){
    this.channel.publish({
      event: event,
      data: data
    });
  }

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
    this.update();
  }

  r.on = function(eventid, cb, ctx, args){
    ctx = ctx || null;
    args = args || [];
    var event = "on" + eventid;

    var obj = {};
    if(!ctx){
      obj.cb = cb;
    }
    else {
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
    if(!this.events[event]) return;
    this.events[event].forEach(function(e){
      e = null;
    });
    delete this.events[event];
  }

  r.checkIfIsOver = function(){
    return !(this.p1.getRubies() && this.p2.getRubies());
  }

  r.checkRubies = function(){
    var scoreP1 = this.p1.getScore();
    var scoreP2 = this.p2.getScore();

    if(scoreP1 > scoreP2){
      this.p2.removeRuby();
      return this.p2;
    }
    if(scoreP2 > scoreP1){
      this.p1.removeRuby();
      return this.p1;
    }

    //tie
    this.p1.removeRuby();
    this.p2.removeRuby();
    return Math.random() > 0.5 ? this.p1 : this.p2;
  }

  r.userLeft = function(sideName) {
    var side = this[sideName];

    side.foe.send("foe:left", null, true);

  }

  r.shutDown = function() {
    this.channel = null;
  }

  return Battle;
})();

module.exports = Battle;