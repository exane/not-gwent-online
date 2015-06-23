var Card = require("../../server/Card");
var Battleside = require("../../server/Battleside");
var data = require("../../assets/data/abilities");


describe("filter", function(){
  var card, side, filter, cards;

  beforeEach(function(){
    filter = Battleside.prototype.filter;
    cards = [];
    cards.push(Card("iorveth")); //hero
    cards.push(Card("toruviel")); //normal
    cards.push(Card("isengrim_faoiltiarnah")); //hero
    cards.push(Card("decoy")); //special
    cards.push(Card("impenetrable_fog")); //special
  })

  it("it should filter heroes out", function(){
    var res = filter(cards, {
      "ability": "hero"
    })
    expect(res.length).toBe(3);
  })

  it("it should filter hero and special cards out", function(){
    var res = filter(cards, {
      "ability": "hero",
      "type": Card.TYPE.SPECIAL
    })
    expect(res.length).toBe(2);
  })

  it("it should filter 2 types out", function(){
    var res = filter(cards, {
      "type": [Card.TYPE.SPECIAL, Card.TYPE.WEATHER]
    })
    expect(res.length).toBe(3);
  })

  it("it should filter 2 types and hero out", function(){
    var res = filter(cards, {
      "ability": "hero",
      "type": [Card.TYPE.SPECIAL, Card.TYPE.WEATHER]
    })
    expect(res.length).toBe(1);
  })


})