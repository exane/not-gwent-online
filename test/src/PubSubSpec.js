var Battle = require("../../server/Battle");
var Card = require("../../server/Card");
var data = require("../../assets/data/abilities");

describe("pubsub", function(){
  var battle, card1, card2;

  beforeEach(function(){
    battle = {};
    battle.runEvent = Battle.prototype.runEvent;
    battle.on = Battle.prototype.on;
    battle.off = Battle.prototype.off;
    battle.events = {};
    battle.update = function() {};

    card1 = Card("kaedweni_siege_expert");
    card2 = Card("dun_banner_medic");
  });

  it("on: has correct arguments", function(){
    //this.on("EachTurn", ability.onEachTurn, this, [card])

    battle.on("EachTurn", function(card){
      expect(card).toEqual(card1);
    }, this, [card1]);
    battle.runEvent("EachTurn");


  })
  it("runEvent: has correct arguments", function(){
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    battle.on("EachTurn", function(c){
      expect(c).toEqual(card1);
    });
    battle.runEvent("EachTurn", null, [card1]);
  })
  it("on + runEvent: has correct arguments", function(){
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    battle.on("EachTurn", function(c1, c2){
      expect(c1).toEqual(card1);
      expect(c2).toEqual(card2);
    }, null, [card1]);
    battle.runEvent("EachTurn", null, [card2]);
  })
  it("test context", function(){

    battle.on("EachTurn", function(card){
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card2.id);
    }, card2, [card1]);
    battle.runEvent("EachTurn");
  })
  it("test context", function(){

    battle.on("EachTurn", function(card){
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card2.id);
    }, null, [card1]);
    battle.runEvent("EachTurn", card2);
  })
  it("test context", function(){

    battle.on("EachTurn", function(card){
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card1.id);
    }, card1, [card1]);
    battle.runEvent("EachTurn", card2);
  })

  it("should handle off correctly", function() {
    var cb1 = function(){}, cb2 = function() {};
    var obj = {
      cb1: cb1,
      cb2: cb2
    }

    spyOn(obj, "cb1");
    spyOn(obj, "cb2");


    var uid1 = battle.on("EachCardPlace", obj.cb1, battle, [card1]);
    var uid2 = battle.on("EachCardPlace", obj.cb2, battle, [card2]);


    battle.off("EachCardPlace", uid2);
    battle.runEvent("EachCardPlace");


    expect(obj.cb1).toHaveBeenCalled();
    expect(obj.cb2).not.toHaveBeenCalled();

    /*battle.off("EachCardPlace", uid1);

    expect(battle.events).toEqual({});*/
  })

  it("should give bound ctx", function() {
    var obj = {}, otherCtx = { key: "test"};
    var card = Card("biting_frost");
    var ability = card.getAbility();

    obj.setWeather = function(weatherType) {
      expect(weatherType).toEqual(0);
      expect(this).toBe(otherCtx);
    }

    spyOn(obj, "setWeather").and.callThrough();

    expect(ability.weather).toBeDefined();

    ability.onEachTurn = obj.setWeather.bind(otherCtx, ability.weather);
    ability.onEachCardPlace = obj.setWeather.bind(otherCtx, ability.weather);

    if(ability.onEachTurn){
      var uid = battle.on("EachTurn", ability.onEachTurn, battle, [card])
      card._uidEvents["EachTurn"] = uid;
    }
    if(ability.onEachCardPlace){
      var uid = battle.on("EachCardPlace", ability.onEachCardPlace, battle, [card]);
      card._uidEvents["EachCardPlace"] = uid;
    }

    battle.runEvent("EachCardPlace");
    battle.runEvent("EachTurn");

    expect(obj.setWeather).toHaveBeenCalled();
  })


});
