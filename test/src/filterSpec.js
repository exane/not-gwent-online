var Card = require("../../server/Card");
var Battleside = require("../../server/Battleside");
var data = require("../../assets/data/abilities");


describe("filter", function(){
  var card, side, filter, cards;
  beforeEach(function(){
    filter = Battleside.prototype.filter;
    cards = [];
    cards.push(Card("iorveth"));
    cards.push(Card("toruviel"));
    cards.push(Card("isengrim_faoiltiarnah"));
    cards.push(Card("decoy"));
  })

  it("it should filter heroes out", function(){
    var res = filter(cards, {
      "ability": "hero"
    })
    expect(res.length).toBe(2);
  })

  it("it should filter hero and special cards out", function(){
    var res = filter(cards, {
      "ability": "hero",
      "type": Card.TYPE.SPECIAL
    })
    expect(res.length).toBe(1);
  })


})