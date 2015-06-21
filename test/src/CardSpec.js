var Card = require("../../server/Card");

describe("cards", function(){
  var card;

  beforeEach(function() {
    card = Card("john_natalis");
  });

  it("should have hero ability", function() {
    expect(card.hasAbility("hero")).toBe(true);
  })
})