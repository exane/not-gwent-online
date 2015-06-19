describe("pubsub", function() {
  var battle;

  beforeEach(function() {
    battle = Battle();
  });

  it("on: has correct arguments", function() {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    var CARD = {
      _id: 1,
      _name: "cardy"
    }

    battle.on("EachTurn", function(card) {
      expect(card).toEqual(CARD);
    }, this, [CARD]);
    battle.runEvent("EachTurn");
  })
  it("runEvent: has correct arguments", function() {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    var CARD = {
      _id: 1,
      _name: "cardy"
    }

    battle.on("EachTurn", function(card) {
      expect(card).toEqual(CARD);
    });
    battle.runEvent("EachTurn", null, [CARD]);
  })
  it("on + runEvent: has correct arguments", function() {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    var CARD = {
      _id: 1,
      _name: "cardy"
    }
    var CARD2 = {
      _id: 2,
      _name: "cardooo"
    }

    battle.on("EachTurn", function(card1, card2) {
      expect(card1).toEqual(CARD);
      expect(card2).toEqual(CARD2);
    }, null, [CARD]);
    battle.runEvent("EachTurn", null, [CARD2]);
  })
  it("test context", function() {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    var Card = function(id, name){
      this.id = id;
      this.name = name;
    }
    var card1 = new Card(1, "cardy");
    var card2 = new Card(2, "cardoo");

    battle.on("EachTurn", function(card) {
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card2.id);
    }, card2, [card1]);
    battle.runEvent("EachTurn");
  })
  it("test context", function() {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    var Card = function(id, name){
      this.id = id;
      this.name = name;
    }
    var card1 = new Card(1, "cardy");
    var card2 = new Card(2, "cardoo");

    battle.on("EachTurn", function(card) {
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card2.id);
    }, null, [card1]);
    battle.runEvent("EachTurn", card2);
  })
  it("test context", function() {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    var Card = function(id, name){
      this.id = id;
      this.name = name;
    }
    var card1 = new Card(1, "cardy");
    var card2 = new Card(2, "cardoo");

    battle.on("EachTurn", function(card) {
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card1.id);
    }, card1, [card1]);
    battle.runEvent("EachTurn", card2);
  })


});
