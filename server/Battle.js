var Battleside = require("./Battleside");
var PubSub = require("pubsub-js");
var Card = require("./Card");

var io = global.io;

var Battle = (function(){
  var Battle = function(id, p1, p2){
    if(!(this instanceof Battle)){
      return (new Battle(id, p1, p2));
    }
    /**
     * constructor here
     */
    this._id = id;
    this._user1 = p1;
    this._user2 = p2;
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


  r._id = null;


  r.init = function(){
    PubSub.subscribe("update", this.update.bind(this));
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

    this.p1.hand.add(Card("decoy"));
    this.p1.hand.add(Card("impenetrable_fog"));
    this.p2.hand.add(Card("decoy"));
    this.p2.hand.add(Card("impenetrable_fog"));

    this.update();


    PubSub.subscribe("nextTurn", this.switchTurn.bind(this));

    this.switchTurn();
  }

  r.switchTurn = function(__flag){
    /*this.playerManager.renderInfos();
    if(this.playerManager.bothPassed() && !this._roundCheck) {
      //start new round
      this._roundCheck = true;
      this.checkRound();
      return;
    }
    if(this.playerManager.bothPassed()) {
      return;
    }
    var entity = this.playerManager.getNextPlayer();

    this.playerManager.renderInfos();*/
    __flag = typeof __flag == "undefined" ? 0 : 1;
    var side = this.turn++ % 2 ? this.p1 : this.p2;

    if(side.isPassing()){
      if(__flag) {
        return this.startNextRound();
      }
      return this.switchTurn(1);
    }

    PubSub.publish("onEachTurn");
    PubSub.publish("turn/" + side.getID());
    console.log("current Turn: ", side.getName());

  }

  r.startNextRound = function() {

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
    io.to(this._id).emit(event, data);
  }

  return Battle;
})();

module.exports = Battle;