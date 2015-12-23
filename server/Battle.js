var Battleside = require("./Battleside");
var Card = require("./Card");
var Deck = require("./Deck");
var shortid = require("shortid");
var Promise = require("jquery-deferred");
var CardManager = require("./CardManager");


var Battle = (function(){
  var Battle = function(id, p1, p2, socket){
    if(!(this instanceof Battle)){
      return (new Battle(id, p1, p2, socket));
    }
    /**
     * constructor here
     */
    this.cm = CardManager();
    this.events = {};
    this._id = id;
    this._user1 = p1;
    this._user2 = p2;
    this.socket = socket;
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

  r.cm = null;

  r.socket = null;

  r._id = null;

  r.events = null;

  r.init = function(){
    this.on("Update", this.update);

    this.p1 = Battleside(this._user1, 0, this);
    this.p2 = Battleside(this._user2, 1, this);
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

    /*this.p1.placeCard("ves");
    this.p2.placeCard("ves");
    this.p1.placeCard("yarpen_zigrin");
    this.p2.placeCard("yarpen_zigrin");

    this.p1.hand.add(this.p1.createCard("scorch"));
    this.p2.hand.add(this.p2.createCard("scorch"));
    this.p1.hand.add(this.p1.createCard("villentretenmerth"));
    this.p2.hand.add(this.p2.createCard("villentretenmerth"));*/

    /*this.p1.hand.add(this.p1.createCard("blue_stripes_commando"));
    this.p2.hand.add(this.p2.createCard("blue_stripes_commando"));
    this.p1.hand.add(this.p1.createCard("blue_stripes_commando"));
    this.p2.hand.add(this.p2.createCard("blue_stripes_commando"));
    this.p1.hand.add(this.p1.createCard("blue_stripes_commando"));
    this.p2.hand.add(this.p2.createCard("blue_stripes_commando"));
    this.p1.hand.add(this.p1.createCard("blue_stripes_commando"));
    this.p2.hand.add(this.p2.createCard("blue_stripes_commando"));
    this.p1.hand.add(this.p1.createCard("blue_stripes_commando"));
    this.p2.hand.add(this.p2.createCard("blue_stripes_commando"));
    this.p1.hand.add(this.p1.createCard("dandelion"));
    this.p2.hand.add(this.p2.createCard("dandelion"));*/


    /*this.p1.placeCard("ves");
    this.p2.placeCard("ves");
    this.p1.placeCard("yarpen_zigrin");
    this.p2.placeCard("yarpen_zigrin");

    this.p1.hand.add(this.p1.createCard("scorch"));
    this.p2.hand.add(this.p2.createCard("scorch"));
    this.p1.hand.add(this.p1.createCard("villentretenmerth"));
    this.p2.hand.add(this.p2.createCard("villentretenmerth"));

    this.p1.hand.add(this.p1.createCard("impenetrable_fog"));
    this.p2.hand.add(this.p2.createCard("impenetrable_fog"));
    this.p1.hand.add(this.p1.createCard("biting_frost"));
    this.p2.hand.add(this.p2.createCard("biting_frost"));
    this.p1.hand.add(this.p1.createCard("torrential_rain"));
    this.p2.hand.add(this.p2.createCard("torrential_rain"));
    this.p1.hand.add(this.p1.createCard("clear_weather"));
    this.p2.hand.add(this.p2.createCard("clear_weather"));
*/

    this.update();


    Promise.when(this.p1.reDraw(2), this.p2.reDraw(2))
    .then(function(){
      this.on("NextTurn", this.switchTurn);
      var side = Math.random() > 0.5 ? this.p1 : this.p2;
      this.sendNotification(side.getName() + " begins!");
      this.switchTurn(side);
    }.bind(this));

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

    //console.log("current Turn: ", side.getName());
  }

  r.getWinner = function() {
    if(!this.p1.getRubies() && !this.p2.getRubies()){
      return null; //tie
    }
    return this.p1.getRubies() ? this.p1 : this.p2;
  }

  r.startNextRound = function(){
    var lastRound = this.checkRubies();
    var loser = lastRound.loser;
    var winner = loser.foe;
    if(this.checkIfIsOver()){
      //console.log("its over!");
      var winner = this.getWinner();
      winner = winner ? winner.getName() : "nobody";
      this.gameOver(winner);
      this.update();
      return;
    }

    this.p1.resetNewRound();
    this.p2.resetNewRound();

    //console.log("start new round!");
    this.sendNotification("Start new round!");


    if(winner.deck.getFaction() === Deck.FACTION.NORTHERN_REALM && !lastRound.isTie){
      winner.draw(1);
      //console.log(winner.getName() + " draws 1 extra card! (Northern ability)");
      this.sendNotification(winner.getName() + " draws 1 extra card! (Northern ability)");
    }

    this.update();

    if(winner.deck.getFaction() === Deck.FACTION.SCOIATAEL){
      this.waitForScoiatael(winner);
    }
    else if(this.p1.deck.getFaction() === Deck.FACTION.SCOIATAEL){
      this.waitForScoiatael(this.p1);
    }
    else if(this.p2.deck.getFaction() === Deck.FACTION.SCOIATAEL){
      this.waitForScoiatael(this.p2);
    }
    else {
      this.sendNotification(winner.getName() + " begins!");
      this.switchTurn(winner);
    }
  }

  r.waitForScoiatael = function(side){
    var self = this;
    side.turn();
    side.foe.wait();
    self.sendNotification(side.getName() + " decides who starts first");
    side.send("request:chooseWhichSideBegins", null, true);
    side.socket.once("response:chooseWhichSideBegins", function(data){
      //console.log("which side? ", data.side);

      if(data.side !== "p1" && data.side !== "p2")
        throw new Error("Unknown side property! - ", data.side);

      self.sendNotification(side.getName() + " choose " + self[data.side].getName());
      self.switchTurn(self[data.side]);
    })
  }

  r.gameOver = function(winnerName){
    this.send("gameover", {
      winner: winnerName
    })
  }

  r.update = function(){
    //console.("update called");
    this._update(this.p1);
    this._update(this.p2);
  }

  r.updateSelf = function(side){
    this._update(side, true);
  }

  r._update = function(p, isPrivate){
    isPrivate = isPrivate || false;
    p.send("update:info", {
      info: p.getInfo(),
      leader: p.field[Card.TYPE.LEADER].get()[0]
    }, isPrivate)
    p.send("update:hand", {
      cards: JSON.stringify(p.hand.getCards())
    }, isPrivate);
    p.send("update:fields", {
      close: p.field[Card.TYPE.CLOSE_COMBAT].getInfo(),
      ranged: p.field[Card.TYPE.RANGED].getInfo(),
      siege: p.field[Card.TYPE.SIEGE].getInfo(),
      weather: p.field[Card.TYPE.WEATHER].getInfo()
    }, isPrivate);
  }

  r.send = function(event, data){
    /*this.channel.publish({
      event: event,
      data: data
    });*/
    io.sockets.in(this._id).emit(event, data);
  }

  r.runEvent = function(eventid, ctx, args, uid){
    ctx = ctx || this;
    uid = uid || null;
    args = args || [];
    var event = "on" + eventid;

    if(!this.events[event]){
      return;
    }

    if(uid){
      var obj = this.events[event][uid];
      obj.cb = obj.cb.bind(ctx)
      obj.cb.apply(ctx, obj.onArgs.concat(args));
    }
    else {
      for(var _uid in this.events[event]) {
        var obj = this.events[event][_uid];
        obj.cb = obj.cb.bind(ctx)
        obj.cb.apply(ctx, obj.onArgs.concat(args));
      }
    }
    //this.update();
  }

  r.on = function(eventid, cb, ctx, args){
    ctx = ctx || null;
    args = args || [];
    var event = "on" + eventid;
    var uid_event = shortid.generate();

    var obj = {};
    if(!ctx){
      obj.cb = cb;
    }
    else {
      obj.cb = cb.bind(ctx);
    }
    obj.onArgs = args;

    if(!(event in this.events)){
      /*this.events[event] = [];*/
      this.events[event] = {};
    }

    if(typeof cb !== "function"){
      throw new Error("cb not a function");
    }

    this.events[event][uid_event] = obj;

    return uid_event;
  }

  r.off = function(eventid, uid){
    uid = uid || null;
    var event = "on" + eventid;
    if(!this.events[event]) return;
    if(uid){
      this.events[event][uid] = null;
      delete this.events[event][uid];
      return;
    }
    for(var _uid in this.events[event]) {
      this.events[event][_uid] = null;
      delete this.events[event][_uid];
    }
  }

  r.checkIfIsOver = function(){
    return !(this.p1.getRubies() && this.p2.getRubies());
  }

  r.checkRubies = function(){
    var scoreP1 = this.p1.getScore();
    var scoreP2 = this.p2.getScore();

    if(scoreP1 > scoreP2){
      this.p2.removeRuby();
      return {
        loser: this.p2,
        isTie: false
      }
    }
    if(scoreP2 > scoreP1){
      this.p1.removeRuby();
      return {
        loser: this.p1,
        isTie: false
      }
    }

    //tie

    //check if is nilfgaardian faction ability
    if(this.p1.deck.getFaction() === Deck.FACTION.NILFGAARDIAN_EMPIRE && this.p1.deck.getFaction() !== this.p2.deck.getFaction()){
      this.p2.removeRuby();
      //console.log(this.p1.getName() + " wins the tie! (nilfgaardian ability)");
      this.sendNotification(this.p1.getName() + " wins the tie! (nilfgaardian ability)");
      return {
        loser: this.p2,
        isTie: false
      }
    }
    if(this.p2.deck.getFaction() === Deck.FACTION.NILFGAARDIAN_EMPIRE && this.p1.deck.getFaction() !== this.p2.deck.getFaction()){
      this.p1.removeRuby();
      //console.log(this.p2.getName() + " wins the tie! (nilfgaardian ability)");
      this.sendNotification(this.p2.getName() + " wins the tie! (nilfgaardian ability)");
      return {
        loser: this.p1,
        isTie: false
      }
    }

    this.p1.removeRuby();
    this.p2.removeRuby();

    /*if(!this.p1.getRubies() && !this.p2.getRubies()) {
      return {
        loser: Math.random() > 0.5 ? this.p1 : this.p2,
        isTie: false
      }
    }

    if(!this.p1.getRubies()) {
      return {
        loser: this.p2,
        isTie: false
      }
    }
*/
    return {
      loser: Math.random() > 0.5 ? this.p1 : this.p2,
      isTie: true
    }
  }

  r.userLeft = function(sideName){
    var side = this[sideName];


    if(side.foe){
      side.foe.send("foe:left", null, true);
      return;
    }
    console.log("side foe not defined!", side.foe);
  }

  r.shutDown = function(){
    this.channel = null;
  }

  r.sendNotification = function(msg){
    this.send("notification", {
      message: msg
    })
  }

  r.sendNotificationTo = function(side, msg) {
    side.send("notification", {
      message: msg
    }, true)
  }

  return Battle;
})();

module.exports = Battle;