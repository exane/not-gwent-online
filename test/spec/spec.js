(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = {

  "agile": {
    cancelPlacement: true,
    onBeforePlace: function onBeforePlace(card) {
      var self = this;
      this.send("played:agile", { cardID: card.getID() }, true);
      this.on("agile:setField", function (type) {
        self.off("agile:setField");
        card.changeType(type);
        self.placeCard(card, {
          disabled: true
        });
        self.hand.remove(card);
      });
    }
  },
  "medic": {
    waitResponse: true,
    onAfterPlace: function onAfterPlace(card) {
      var discard = this.getDiscard();

      discard = this.filter(discard, {
        "ability": "hero",
        "type": card.constructor.TYPE.SPECIAL
      });

      this.send("played:medic", {
        cards: JSON.stringify(discard)
      }, true);
    }
  },
  "morale_boost": {

    onEachCardPlace: function onEachCardPlace(card) {
      var field = this.field[card.getType()];
      var id = card.getID();
      if (!field.isOnField(card)) {
        field.get().forEach(function (_card) {
          if (_card.getID() == id) return;
          if (_card.getType() != card.getType()) return;
          _card.setBoost(id, 0);
        });
        /*this.off("EachCardPlace")*/
        this.off("EachCardPlace", card.getUidEvents("EachCardPlace"));
        return;
      }

      field.get().forEach(function (_card) {
        if (_card.getID() == id) return;
        if (_card.getType() != card.getType()) return;
        _card.setBoost(id, 1);
      });
    }
  },
  "muster": {
    name: "muster",
    onAfterPlace: function onAfterPlace(card) {
      var musterType = card.getMusterType();
      var self = this;

      var cardsDeck = this.deck.find("musterType", musterType);
      var cardsHand = this.hand.find("musterType", musterType);

      cardsDeck.forEach(function (_card) {
        self.deck.removeFromDeck(_card);
        self.placeCard(_card, {
          suppress: "muster"
        });
      });
      cardsHand.forEach(function (_card) {
        self.hand.remove(_card);
        self.placeCard(_card, {
          suppress: "muster"
        });
      });
    }
  },
  "tight_bond": {
    onAfterPlace: function onAfterPlace(card) {
      var field = this.field[card.getType()];
      var cards = field.get();
      var lastInsert = cards.length;

      if (lastInsert < 2) return;

      if (cards[lastInsert - 2].getName() == cards[lastInsert - 1].getName()) {
        cards[lastInsert - 2].boost(+cards[lastInsert - 2].getPower());
        cards[lastInsert - 1].boost(+cards[lastInsert - 1].getPower());
      }
    }
  },
  "spy": {
    changeSide: true,
    onAfterPlace: function onAfterPlace(card) {
      this.draw(2);
    }
  },
  "weather_fog": {
    onEachTurn: function onEachTurn(card) {
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function (_card) {
        if (_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    },
    onEachCardPlace: function onEachCardPlace(card) {
      var targetRow = card.constructor.TYPE.RANGED;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function (_card) {
        if (_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    }
  },
  "weather_rain": {
    onEachTurn: function onEachTurn(card) {
      var targetRow = card.constructor.TYPE.SIEGE;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function (_card) {
        if (_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    }
  },
  "weather_frost": {
    onEachTurn: function onEachTurn(card) {
      var targetRow = card.constructor.TYPE.CLOSE_COMBAT;
      var forcedPower = 1;
      var field1 = this.field[targetRow].get();
      var field2 = this.foe.field[targetRow].get();

      var field = field1.concat(field2);

      field.forEach(function (_card) {
        if (_card.getRawAbility() == "hero") return;
        _card.setForcedPower(forcedPower);
      });
    }
  },
  "clear_weather": {
    onAfterPlace: function onAfterPlace(card) {
      var targetRow = card.constructor.TYPE.WEATHER;
      var field = this.field[targetRow].get();

      //todo: remove weather cards
    }
  },
  "decoy": {
    replaceWith: true
  },
  "foltest_leader1": {
    onActivate: function onActivate() {
      var cards = this.deck.find("key", "impenetrable_fog");
      if (!cards.length) return;
      var card = this.deck.removeFromDeck(cards[0]);
      this.placeCard(card);
    }
  },
  "francesca_leader1": {},
  "francesca_leader2": {},
  "francesca_leader3": {},
  "francesca_leader4": {},
  "eredin_leader1": {},
  "eredin_leader2": {},
  "eredin_leader3": {},
  "eredin_leader4": {},
  "hero": {}
};

},{}],2:[function(require,module,exports){
/**
 * types
 * 0 close combat
 * 1 ranged
 * 2 siege
 * 3 leader
 * 4 special (decoy)
 * 5 weather
 */

"use strict";

module.exports = {
  "redanian_foot_soldier": {
    name: "Redanian Foot Soldier",
    power: 1,
    ability: null,
    img: "foot_soldier1",
    faction: "Northern Realm",
    type: 0
  },
  "poor_fucking_infantry": {
    name: "Poor Fucking Infantry",
    power: 1,
    ability: "tight_bond",
    img: "infantry",
    faction: "Northern Realm",
    type: 0
  },
  "yarpen_zigrin": {
    name: "Yarpen Zigrin",
    power: 2,
    ability: null,
    img: "yarpen",
    faction: "Northern Realm",
    type: 0
  },
  "blue_stripes_commando": {
    name: "Blue Stripes Commando",
    power: 4,
    ability: "tight_bond",
    img: "commando",
    faction: "Northern Realm",
    type: 0
  },
  "sigismunt_dijkstra": {
    name: "Sigismunt Dijkstra",
    power: 4,
    ability: "spy",
    img: "dijkstra",
    faction: "Northern Realm",
    type: 0
  },
  "prince_stennis": {
    name: "Prince Stennis",
    power: 5,
    ability: "spy",
    img: "stennis",
    faction: "Northern Realm",
    type: 0
  },
  "siegfried_of_denesle": {
    name: "Siegfried of Denesle",
    power: 5,
    ability: null,
    img: "siegfried",
    faction: "Northern Realm",
    type: 0
  },
  "ves": {
    name: "Ves",
    power: 5,
    ability: null,
    img: "ves",
    faction: "Northern Realm",
    type: 0
  },
  "vernon_roche": {
    name: "Vernon Roche",
    power: 10,
    ability: "hero",
    img: "roche",
    faction: "Northern Realm",
    type: 0
  },
  "john_natalis": {
    name: "John Natalis",
    power: 10,
    ability: "hero",
    img: "natalis",
    faction: "Northern Realm",
    type: 0
  },
  "sheldon_skaggs": {
    name: "Sheldon Skaggs",
    power: 4,
    ability: null,
    img: "skaggs",
    faction: "Northern Realm",
    type: 1
  },
  "sabrina_glevissig": {
    name: "Sabrina Glevissig",
    power: 4,
    ability: null,
    img: "sabrina",
    faction: "Northern Realm",
    type: 1
  },
  "crinfrid_reavers_dragon_hunter": {
    name: "Crinfrid Reaver's Dragon Hunter",
    power: 5,
    ability: "tight_bond",
    img: "crinfrid",
    faction: "Northern Realm",
    type: 1
  },
  "sile_de_tansarville": {
    name: "Síle de Tansarville",
    power: 5,
    ability: null,
    img: "sile",
    faction: "Northern Realm",
    type: 1
  },
  "keira_metz": {
    name: "Keira Metz",
    power: 5,
    ability: null,
    img: "keira",
    faction: "Northern Realm",
    type: 1
  },
  "dethmold": {
    name: "Dethmold",
    power: 6,
    ability: null,
    img: "dethmold",
    faction: "Northern Realm",
    type: 1
  },
  "kaedweni_siege_expert": {
    name: "Kaedweni Siege Expert",
    power: 1,
    ability: "morale_boost",
    img: "siege_expert1",
    faction: "Northern Realm",
    type: 2
  },
  "dun_banner_medic": {
    name: "Dun Banner Medic",
    power: 5,
    ability: "medic",
    img: "medic",
    faction: "Northern Realm",
    type: 2
  },
  "ballista": {
    name: "Ballista",
    power: 6,
    ability: null,
    img: "ballista1",
    faction: "Northern Realm",
    type: 2
  },
  "trebuchet": {
    name: "Trebuchet",
    power: 6,
    ability: null,
    img: "trebuchet1",
    faction: "Northern Realm",
    type: 2
  },
  "thaler": {
    name: "Thaler",
    power: 1,
    ability: "spy",
    img: "thaler",
    faction: "Northern Realm",
    type: 2
  },
  "foltest_king_of_temeria": {
    name: "Foltest: King of Temeria",
    power: -1,
    ability: "foltest_leader1",
    img: "foltest_king",
    faction: "Northern Realm",
    type: 3
  },
  "decoy": {
    name: "Decoy",
    power: -1,
    ability: "decoy",
    img: "decoy",
    faction: null,
    type: 4
  },
  "impenetrable_fog": {
    name: "Impenetrable Fog",
    power: -1,
    ability: "weather_fog",
    img: "fog",
    faction: null,
    type: 5
  },

  "francesca_pureblood_elf": {
    name: "Francesca, Pureblood Elf",
    power: -1,
    ability: "francesca_leader1",
    img: "francesca_pureblood",
    faction: "Scoia'tael",
    type: 3
  },
  "francesca_the_beautiful": {
    name: "Francesca The Beautiful",
    power: -1,
    ability: "francesca_leader2",
    img: "francesca_beatiful",
    faction: "Scoia'tael",
    type: 3
  },
  "francesca_daisy_of_the_valley": {
    name: "Francesca, Daisy of The Valley",
    power: -1,
    ability: "francesca_leader3",
    img: "francesca_daisy",
    faction: "Scoia'tael",
    type: 3
  },
  "francesca_queen_of_dol_blathanna": {
    name: "Francesca, Queen of Dol Blathanna",
    power: -1,
    ability: "francesca_leader4",
    img: "francesca_queen",
    faction: "Scoia'tael",
    type: 3
  },
  "saesenthessis": {
    name: "Saesenthessis",
    power: 10,
    ability: "hero",
    img: "saesenthessis",
    faction: "Scoia'tael",
    type: 1
  },
  "iorveth": {
    name: "Iorveth",
    power: 10,
    ability: "hero",
    img: "iorveth",
    faction: "Scoia'tael",
    type: 1
  },
  "isengrim_faoiltiarnah": {
    name: "Isengrim Faoiltiarnah",
    power: 10,
    ability: ["hero", "morale_boost"],
    img: "isengrim",
    faction: "Scoia'tael",
    type: 0
  },
  "eithne": {
    name: "Eithne",
    power: 10,
    ability: "hero",
    img: "eithne",
    faction: "Scoia'tael",
    type: 1
  },
  "havekar_healer": {
    name: "Havekar Healer",
    power: 0,
    ability: "medic",
    img: "healer",
    faction: "Scoia'tael",
    type: 1
  },
  "riordain": {
    name: "Riordain",
    power: 1,
    ability: null,
    img: "riordain",
    faction: "Scoia'tael",
    type: 1
  },
  "toruviel": {
    name: "Toruviel",
    power: 2,
    ability: null,
    img: "toruviel",
    faction: "Scoia'tael",
    type: 1
  },
  "elven_skirmisher": {
    name: "Elven Skirmisher",
    power: 2,
    ability: "muster",
    musterType: "skirmisher",
    img: "elven_skirmisher2",
    faction: "Scoia'tael",
    type: 1
  },
  "dwarven_skirmisher": {
    name: "Dwarven Skirmisher",
    power: 3,
    ability: "muster",
    musterType: "skirmisher",
    img: "skirmisher2",
    faction: "Scoia'tael",
    type: 0
  },
  "ciaran_aep_easnillien": {
    name: "Ciaran aep Easnillien",
    power: 3,
    ability: "agile",
    img: "easnillien",
    faction: "Scoia'tael",
    type: 1
  },
  "vrihedd_brigade_recruit": {
    name: "Vrihedd Brigade Recruit",
    power: 4,
    ability: null,
    img: "recruit",
    faction: "Scoia'tael",
    type: 1
  },
  "dol_blathanna_archer": {
    name: "Dol Blathanna Archer",
    power: 4,
    ability: null,
    img: "archer",
    faction: "Scoia'tael",
    type: 1
  }, /*
     "hav_caaren_medic": {
     name: "Hav’caaren Medic",
     power: 5,
     ability: null,
     img: "", //missing image
     faction: "Scoia'tael",
     type: 0
     },*/
  "havekar_smuggler": {
    name: "Havekar Smuggler",
    power: 5,
    ability: "spy",
    img: "smuggler1",
    faction: "Scoia'tael",
    type: 0
  },
  "mahakaman_defender": {
    name: "Mahakaman Defender",
    power: 5,
    ability: null,
    img: "defender2",
    faction: "Scoia'tael",
    type: 0
  },
  "vrihedd_brigade_veteran": {
    name: "Vrihedd Brigade Veteran",
    power: 5,
    ability: "agile",
    img: "veteran1",
    faction: "Scoia'tael",
    type: 0
  },
  "dennis_cranmer": {
    name: "Dennis Cranmer",
    power: 6,
    ability: null,
    img: "cranmer",
    faction: "Scoia'tael",
    type: 0
  },
  "filavandrel_aen_fidhail": {
    name: "Filavandrel aén Fidháil",
    power: 6,
    ability: "agile",
    img: "fidhail",
    faction: "Scoia'tael",
    type: 1
  },
  "ida_emean_aep_sivney": {
    name: "Ida Emean aep Sivney",
    power: 6,
    ability: null,
    img: "sivney",
    faction: "Scoia'tael",
    type: 1
  },
  "yaevinn": {
    name: "Yaevinn",
    power: 6,
    ability: "agile",
    img: "yaevinn",
    faction: "Scoia'tael",
    type: 0
  },
  "barclay_els": {
    name: "Barclay Els",
    power: 6,
    ability: "agile",
    img: "barclay",
    faction: "Scoia'tael",
    type: 0
  },
  "dol_blathanna_scout": {
    name: "Dol Blathanna Scout",
    power: 6,
    ability: "agile",
    img: "scout2",
    faction: "Scoia'tael",
    type: 0
  },
  "milva": {
    name: "Milva",
    power: 10,
    ability: "morale_boost",
    img: "milva",
    faction: "Scoia'tael",
    type: 1
  },

  "eredin_commander_of_the_red_riders": {
    name: "Eredin, Commander of the Red Riders",
    power: -1,
    ability: "eredin_leader1",
    img: "eredin_commander",
    faction: "monster",
    type: 3
  },
  "eredin_bringer_of_death": {
    name: "Eredin, Bringer of Death",
    power: -1,
    ability: "eredin_leader2",
    img: "eredin_bringer",
    faction: "monster",
    type: 3
  },
  "eredin_destroyer_of_worlds": {
    name: "Eredin, Destroyer of Worlds",
    power: -1,
    ability: "eredin_leader3",
    img: "eredin_destroyer",
    faction: "monster",
    type: 3
  },
  "eredin_king_of_the_wild_hunt": {
    name: "Eredin, King of The Wild Hunt",
    power: -1,
    ability: "eredin_leader4",
    img: "eredin_king",
    faction: "monster",
    type: 3
  },
  "kayran": {
    name: "Kayran",
    power: 8,
    ability: ["hero", "morale_boost"],
    img: "kayran",
    faction: "monster",
    type: 1
  },
  "leshen": {
    name: "Leshen",
    power: 10,
    ability: "hero",
    img: "leshen",
    faction: "monster",
    type: 1
  },
  "imlerith": {
    name: "Imlerith",
    power: 10,
    ability: "hero",
    img: "imlerith",
    faction: "monster",
    type: 0
  },
  "draug": {
    name: "Draug",
    power: 10,
    ability: "hero",
    img: "draug",
    faction: "monster",
    type: 0
  },
  "ghoul": {
    name: "Ghoul",
    power: 1,
    ability: "muster",
    musterType: "ghoul",
    img: "ghoul1",
    faction: "monster",
    type: 0
  },
  "nekker": {
    name: "Nekker",
    power: 2,
    ability: "muster",
    musterType: "nekker",
    img: "nekker",
    faction: "monster",
    type: 0
  },
  "wyvern": {
    name: "Wyvern",
    power: 2,
    ability: null,
    img: "wyvern",
    faction: "monster",
    type: 1
  },
  "foglet": {
    name: "Foglet",
    power: 2,
    ability: null,
    img: "foglet",
    faction: "monster",
    type: 0
  },
  "celaeno_harpy": {
    name: "Celaeno Harpy",
    power: 2,
    ability: null,
    img: "celaeno_harpy",
    faction: "monster",
    type: 1
  },
  "gargoyle": {
    name: "Gargoyle",
    power: 2,
    ability: null,
    img: "gargoyle",
    faction: "monster",
    type: 1
  },
  "cockatrice": {
    name: "Cockatrice",
    power: 2,
    ability: null,
    img: "cockatrice",
    faction: "monster",
    type: 1
  },
  "harpy": {
    name: "Harpy",
    power: 2,
    ability: "agile",
    img: "harpy",
    faction: "monster",
    type: 1
  },
  "endrega": {
    name: "Endrega",
    power: 2,
    ability: null,
    img: "endrega",
    faction: "monster",
    type: 1
  },
  "vampire_bruxa": {
    name: "Vampire: Bruxa",
    power: 4,
    ability: "muster",
    musterType: "vampire",
    img: "vampire_bruxa",
    faction: "monster",
    type: 0
  },
  "vampire_fleder": {
    name: "Vampire: Fleder",
    power: 4,
    ability: "muster",
    musterType: "vampire",
    img: "vampire_fleder",
    faction: "monster",
    type: 0
  },
  "vampire_garkain": {
    name: "Vampire: Garkain",
    power: 4,
    ability: "muster",
    musterType: "vampire",
    img: "vampire_garkain",
    faction: "monster",
    type: 0
  },
  "vampire_ekimmara": {
    name: "Vampire: Ekimmara",
    power: 4,
    ability: "muster",
    musterType: "vampire",
    img: "vampire_ekimmara",
    faction: "monster",
    type: 0
  },
  "arachas": {
    name: "Arachas",
    power: 4,
    ability: "muster",
    musterType: "arachas",
    img: "arachas1",
    faction: "monster",
    type: 0
  },
  "botchling": {
    name: "Botchling",
    power: 4,
    ability: null,
    img: "botchling",
    faction: "monster",
    type: 0
  },
  "forktail": {
    name: "Forktail",
    power: 5,
    ability: null,
    img: "forktail",
    faction: "monster",
    type: 0
  },
  "plague_maiden": {
    name: "Plague Maiden",
    power: 5,
    ability: null,
    img: "forktail",
    faction: "monster",
    type: 0
  },
  "griffin": {
    name: "Griffin",
    power: 5,
    ability: null,
    img: "griffin",
    faction: "monster",
    type: 0
  },
  "werewolf": {
    name: "Werewolf",
    power: 5,
    ability: null,
    img: "werewolf",
    faction: "monster",
    type: 0
  },
  "frightener": {
    name: "Frightener",
    power: 5,
    ability: null,
    img: "frightener",
    faction: "monster",
    type: 0
  },
  "ice_giant": {
    name: "Ice Giant",
    power: 5,
    ability: null,
    img: "ice_giant",
    faction: "monster",
    type: 2
  },
  "grave_hag": {
    name: "Grave Hag",
    power: 5,
    ability: null,
    img: "grave_hag",
    faction: "monster",
    type: 1
  },
  /*"vampire_katakan": {
    name: "Vampire: Katakan",
    power: 5,
    ability: "muster",
  musterType: "vampire",
    img: "vampire_katakan",
    faction: "monster",
    type: 0
  },*/
  "crone_whispess": {
    name: "Crone: Whispess",
    power: 6,
    ability: "muster",
    musterType: "crone",
    img: "crone_whispess",
    faction: "monster",
    type: 0
  },
  "crone_brewess": {
    name: "Crone: Brewess",
    power: 6,
    ability: "muster",
    musterType: "crone",
    img: "crone_brewess",
    faction: "monster",
    type: 0
  },
  "crone_weavess": {
    name: "Crone: Weavess",
    power: 6,
    ability: "muster",
    musterType: "crone",
    img: "crone_weavess",
    faction: "monster",
    type: 0
  },
  "arachas_behemoth": {
    name: "Arachas Behemoth",
    power: 6,
    ability: "muster",
    musterType: "arachas",
    img: "arachas_behemoth",
    faction: "monster",
    type: 2
  },
  "fire_elemental": {
    name: "Fire Elemental",
    power: 6,
    ability: null,
    img: "fire_elemental",
    faction: "monster",
    type: 2
  },
  "fiend": {
    name: "Fiend",
    power: 6,
    ability: null,
    img: "fiend",
    faction: "monster",
    type: 0
  },
  "earth_elemental": {
    name: "Earth Elemental",
    power: 6,
    ability: null,
    img: "earth_elemental",
    faction: "monster",
    type: 2
  }
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = {

  "northern_realm": ["redanian_foot_soldier", "poor_fucking_infantry", "redanian_foot_soldier", "poor_fucking_infantry", "yarpen_zigrin", "blue_stripes_commando", "sigismunt_dijkstra", "prince_stennis", "siegfried_of_denesle", "ves", "vernon_roche", "john_natalis", "sheldon_skaggs", "sabrina_glevissig", "crinfrid_reavers_dragon_hunter", "sile_de_tansarville", "keira_metz", "dethmold", "kaedweni_siege_expert", "dun_banner_medic", "ballista", "trebuchet", "thaler", "foltest_king_of_temeria", "decoy", "impenetrable_fog"],

  "scoiatael": ["francesca_daisy_of_the_valley", "saesenthessis", "iorveth", "isengrim_faoiltiarnah", "eithne", "havekar_healer", "riordain", "toruviel", "decoy", "decoy", "impenetrable_fog", "elven_skirmisher", "elven_skirmisher", "dwarven_skirmisher", "dwarven_skirmisher", "ciaran_aep_easnillien", "vrihedd_brigade_recruit", "dol_blathanna_archer", "havekar_smuggler", "mahakaman_defender", "vrihedd_brigade_veteran", "dennis_cranmer", "filavandrel_aen_fidhail", "filavandrel_aen_fidhail", "ida_emean_aep_sivney", "yaevinn", "barclay_els", "dol_blathanna_scout", "milva"],

  "monster": ["eredin_king_of_the_wild_hunt", "kayran", "leshen", "imlerith", "draug", "ghoul", "decoy", "decoy", "nekker", "nekker", "wyvern", "foglet", "celaeno_harpy", "gargoyle", "cockatrice", "harpy", "impenetrable_fog", "endrega", "vampire_bruxa", "vampire_bruxa", "vampire_fleder", "vampire_fleder", "vampire_garkain", "vampire_garkain", "vampire_ekimmara", "vampire_ekimmara", "arachas", "botchling", "forktail", "plague_maiden", "griffin", "werewolf", "frightener", "ice_giant", "grave_hag",
  //"vampire_katakan",
  "crone_whispess", "crone_brewess", "crone_brewess", "crone_whispess", "crone_weavess", "crone_weavess", "arachas_behemoth", "fire_elemental", "fiend", "earth_elemental"]
};

},{}],4:[function(require,module,exports){
'use strict';

var randomFromSeed = require('./random/random-from-seed');

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

module.exports = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

},{"./random/random-from-seed":10}],5:[function(require,module,exports){
'use strict';
var alphabet = require('./alphabet');

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

module.exports = decode;

},{"./alphabet":4}],6:[function(require,module,exports){
'use strict';

var randomByte = require('./random/random-byte');

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = encode;

},{"./random/random-byte":9}],7:[function(require,module,exports){
'use strict';

var alphabet = require('./alphabet');
var encode = require('./encode');
var decode = require('./decode');
var isValid = require('./is-valid');

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1426452414093;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 5;

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = require('./util/cluster-worker-id') || 0;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function generate() {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode(alphabet.lookup, version);
    str = str + encode(alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode(alphabet.lookup, counter);
    }
    str = str + encode(alphabet.lookup, seconds);

    return str;
}


/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}


// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode;
module.exports.isValid = isValid;

},{"./alphabet":4,"./decode":5,"./encode":6,"./is-valid":8,"./util/cluster-worker-id":11}],8:[function(require,module,exports){
'use strict';
var alphabet = require('./alphabet');

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet.characters();
    var invalidCharacters = id.split('').map(function(char){
        if (characters.indexOf(char) === -1) {
            return char;
        }
    }).join('').split('').join('');

    return invalidCharacters.length === 0;
}

module.exports = isShortId;

},{"./alphabet":4}],9:[function(require,module,exports){
'use strict';

var crypto = window.crypto || window.msCrypto; // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

module.exports = randomByte;

},{}],10:[function(require,module,exports){
'use strict';

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = 0;

},{}],12:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],13:[function(require,module,exports){
"use strict";

var Battleside = require("./Battleside");
var Card = require("./Card");
var shortid = require("shortid");

var Battle = (function () {
  var Battle = function Battle(id, p1, p2, socket) {
    if (!(this instanceof Battle)) {
      return new Battle(id, p1, p2, socket);
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

  r.init = function () {
    /*PubSub.subscribe("update", this.update.bind(this));*/
    this.on("Update", this.update);
    /*
        this.on("AfterPlace", this.checkAbilityOnAfterPlace)*/

    this.channel = this.socket.subscribe(this._id);
    this.p1 = Battleside(this._user1.getName(), 0, this, this._user1);
    this.p2 = Battleside(this._user2.getName(), 1, this, this._user2);
    this.p1.foe = this.p2;
    this.p2.foe = this.p1;
    this.p1.setUpWeatherFieldWith(this.p2);

    this.start();
  };

  r.start = function () {
    this.p1.setLeadercard();
    this.p2.setLeadercard();
    this.p1.draw(5);
    this.p2.draw(5);

    this.p1.hand.add(Card("kaedweni_siege_expert"));
    this.p2.hand.add(Card("kaedweni_siege_expert"));
    this.p1.hand.add(Card("ballista"));
    this.p2.hand.add(Card("ballista"));
    this.p1.hand.add(Card("ballista"));
    this.p2.hand.add(Card("ballista"));
    this.p1.hand.add(Card("ballista"));
    this.p2.hand.add(Card("ballista"));
    this.p1.hand.add(Card("ballista"));
    this.p2.hand.add(Card("ballista"));
    this.p1.hand.add(Card("ballista"));
    this.p2.hand.add(Card("ballista"));
    this.p1.hand.add(Card("decoy"));
    this.p2.hand.add(Card("decoy"));
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

    this.switchTurn(Math.random() > 0.5 ? this.p1 : this.p2);
  };

  r.switchTurn = function (side, __flag) {
    __flag = typeof __flag == "undefined" ? 0 : 1;

    if (!(side instanceof Battleside)) {
      console.trace("side is not a battleside!");
      return;
    }
    if (side.isPassing()) {
      if (__flag) {
        return this.startNextRound();
      }
      return this.switchTurn(side.foe, 1);
    }

    this.runEvent("EachTurn");
    this.runEvent("Turn" + side.getID());
    console.log("current Turn: ", side.getName());
  };

  r.startNextRound = function () {
    var loser = this.checkRubies();
    if (this.checkIfIsOver()) {
      console.log("its over!");
      this.update();
      return;
    }

    this.p1.resetNewRound();
    this.p2.resetNewRound();

    console.log("start new round!");

    this.update();
    this.switchTurn(loser);
  };

  r.update = function () {
    this._update(this.p1);
    this._update(this.p2);
  };

  r._update = function (p) {
    p.send("update:info", {
      info: p.getInfo(),
      leader: p.field[Card.TYPE.LEADER].get()[0]
    });
    p.send("update:hand", {
      cards: JSON.stringify(p.hand.getCards())
    });
    p.send("update:fields", {
      close: p.field[Card.TYPE.CLOSE_COMBAT],
      ranged: p.field[Card.TYPE.RANGED],
      siege: p.field[Card.TYPE.SIEGE],
      weather: p.field[Card.TYPE.WEATHER]
    });
  };

  r.send = function (event, data) {
    this.channel.publish({
      event: event,
      data: data
    });
  };

  r.runEvent = function (eventid, ctx, args, uid) {
    ctx = ctx || this;
    uid = uid || null;
    args = args || [];
    var event = "on" + eventid;

    if (!this.events[event]) {
      return;
    }

    if (uid) {
      var obj = this.events[event][uid];
      obj.cb = obj.cb.bind(ctx);
      obj.cb.apply(ctx, obj.onArgs.concat(args));
    } else {
      for (var _uid in this.events[event]) {
        var obj = this.events[event][_uid];
        obj.cb = obj.cb.bind(ctx);
        obj.cb.apply(ctx, obj.onArgs.concat(args));
      }
    }
    this.update();
  };

  r.on = function (eventid, cb, ctx, args) {
    ctx = ctx || null;
    args = args || [];
    var event = "on" + eventid;
    var uid_event = shortid.generate();

    var obj = {};
    if (!ctx) {
      obj.cb = cb;
    } else {
      obj.cb = cb.bind(ctx);
    }
    obj.onArgs = args;

    if (!(event in this.events)) {
      /*this.events[event] = [];*/
      this.events[event] = {};
    }

    if (typeof cb !== "function") {
      throw new Error("cb not a function");
    }

    this.events[event][uid_event] = obj;

    return uid_event;
  };

  r.off = function (eventid, uid) {
    uid = uid || null;
    var event = "on" + eventid;
    if (!this.events[event]) return;
    if (uid) {
      this.events[event][uid] = null;
      delete this.events[event][uid];
      return;
    }
    for (var _uid in this.events[event]) {
      this.events[event][_uid] = null;
      delete this.events[event][_uid];
    }
  };

  r.checkIfIsOver = function () {
    return !(this.p1.getRubies() && this.p2.getRubies());
  };

  r.checkRubies = function () {
    var scoreP1 = this.p1.getScore();
    var scoreP2 = this.p2.getScore();

    if (scoreP1 > scoreP2) {
      this.p2.removeRuby();
      return this.p2;
    }
    if (scoreP2 > scoreP1) {
      this.p1.removeRuby();
      return this.p1;
    }

    //tie
    this.p1.removeRuby();
    this.p2.removeRuby();
    return Math.random() > 0.5 ? this.p1 : this.p2;
  };

  r.userLeft = function (sideName) {
    var side = this[sideName];

    side.foe.send("foe:left", null, true);
  };

  r.shutDown = function () {
    this.channel = null;
  };

  return Battle;
})();

module.exports = Battle;

},{"./Battleside":14,"./Card":15,"shortid":7}],14:[function(require,module,exports){
"use strict";

var DeckData = require("../assets/data/deck");
var Deck = require("./Deck");
var Hand = require("./Hand");
var Card = require("./Card");
var Field = require("./Field");
var _ = require("underscore");

var Battleside;
Battleside = (function () {
  var Battleside = function Battleside(name, n, battle, user) {
    if (!(this instanceof Battleside)) {
      return new Battleside(name, n, battle, user);
    }
    /**
     * constructor here
     */

    var deck = user.getDeck();
    var self = this;
    this._isWaiting = true;
    this.socket = user.socket;
    this.field = {};
    this.field[Card.TYPE.LEADER] = Field(Card.TYPE.LEADER);
    this.field[Card.TYPE.CLOSE_COMBAT] = Field(Card.TYPE.CLOSE_COMBAT);
    this.field[Card.TYPE.RANGED] = Field(Card.TYPE.RANGED);
    this.field[Card.TYPE.SIEGE] = Field(Card.TYPE.SIEGE);
    this.n = n ? "p2" : "p1";
    this._name = name;
    this.battle = battle;
    this.hand = Hand();
    this.deck = Deck(DeckData[deck]);
    this._discard = [];

    this.runEvent = this.battle.runEvent.bind(this.battle);
    this.on = this.battle.on.bind(this.battle);
    this.off = this.battle.off.bind(this.battle);

    this.receive("activate:leader", function () {
      if (self._isWaiting) return;
      if (self.isPassing()) return;

      console.log("leader activated");

      var leaderCard = self.getLeader();
      if (leaderCard.isDisabled()) return;

      var ability = leaderCard.getAbility();

      ability.onActivate.apply(self);
      leaderCard.setDisabled(true);
      self.update();
    });
    this.receive("play:cardFromHand", function (data) {
      if (self._isWaiting) return;
      if (self.isPassing()) return;
      var cardID = data.id;
      var card = self.hand.getCard(cardID);

      self.playCard(card);
    });
    this.receive("decoy:replaceWith", function (data) {
      if (self._isWaiting) return;
      var card = self.findCardOnFieldByID(data.cardID);
      if (card === -1) throw new Error("decoy:replace | unknown card");
      self.runEvent("Decoy:replaceWith", self, [card]);
    });
    this.receive("cancel:decoy", function () {
      self.off("Decoy:replaceWith");
    });
    this.receive("set:passing", function () {
      self.setPassing(true);
      self.update();
      self.runEvent("NextTurn", null, [self.foe]);
    });
    this.receive("medic:chooseCardFromDiscard", function (data) {
      if (!data) {
        self.runEvent("NextTurn", null, [self.foe]);
        return;
      }
      var cardID = data.cardID;
      var card = self.getCardFromDiscard(cardID);
      if (card === -1) throw new Error("medic:chooseCardFromDiscard | unknown card: ", card);

      self.removeFromDiscard(card);

      self.playCard(card);
    });
    this.receive("agile:field", function (data) {
      var fieldType = data.field;
      self.runEvent("agile:setField", null, [fieldType]);
      self.runEvent("NextTurn", null, [self.foe]);
    });
    this.receive("cancel:agile", function () {
      self.off("agile:setField");
    });

    this.on("Turn" + this.getID(), this.onTurnStart, this);
  };
  var r = Battleside.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._name = null;
  r._discard = null;

  r._rubies = 2;
  r._score = 0;
  r._isWaiting = null;
  r._passing = null;

  r.field = null;

  r.socket = null;
  r.n = null;

  r.foe = null;
  r.hand = null;
  r.battle = null;
  r.deck = null;

  r.isPassing = function () {
    return this._passing;
  };

  r.setUpWeatherFieldWith = function (p2) {
    this.field[Card.TYPE.WEATHER] = p2.field[Card.TYPE.WEATHER] = Field(Card.TYPE.WEATHER);
  };

  r.findCardOnFieldByID = function (id) {
    for (var key in this.field) {
      var field = this.field[key];
      var card = field.getCard(id);
      if (card !== -1) return card;
    }
    /*
        for(var i = 0; i < this._discard.length; i++) {
          var c = this._discard[i];
          if(c.getID() === id) return c;
        }*/
    return -1;
  };

  r.getCardFromDiscard = function (id) {
    for (var i = 0; i < this._discard.length; i++) {
      var c = this._discard[i];
      if (c.getID() === id) return c;
    }
    return -1;
  };

  r.setPassing = function (b) {
    this._passing = b;
    this.send("set:passing", { passing: this._passing }, true);
  };

  r.wait = function () {
    this._isWaiting = true;
    this.send("set:waiting", { waiting: this._isWaiting }, true);
  };

  r.turn = function () {
    this._isWaiting = false;
    this.send("set:waiting", { waiting: this._isWaiting }, true);
  };

  r.setLeadercard = function () {
    var leaderCard = this.deck.find("type", Card.TYPE.LEADER);
    this.deck.removeFromDeck(leaderCard[0]);
    /*
        this.getYourside().setField("leader", leaderCard[0]);*/
    this.field[Card.TYPE.LEADER].add(leaderCard[0]);
  };

  r.getLeader = function () {
    return this.field[Card.TYPE.LEADER].get()[0];
  };

  r.getID = function () {
    return this.n;
  };

  r.draw = function (times) {
    while (times--) {
      var card = this.deck.draw();
      this.hand.add(card);
    }

    console.log("update:hand fired");

    this.update();
  };

  r.calcScore = function () {
    var score = 0;
    for (var key in this.field) {
      score += +this.field[key].getScore();
    }
    return this._score = score;
  };

  r.getInfo = function () {
    return {
      name: this.getName(),
      lives: this._rubies,
      score: this.calcScore(),
      hand: this.hand.length(),
      discard: this.getDiscard(true),
      passing: this._passing
    };
  };

  r.getRubies = function () {
    return this._rubies;
  };

  r.getScore = function () {
    return +this.calcScore();
  };

  r.removeRuby = function () {
    this._rubies--;
  };

  r.getName = function () {
    return this._name;
  };

  r.send = function (event, msg, isPrivate) {
    msg = msg || {};
    isPrivate = typeof isPrivate === "undefined" ? false : isPrivate;
    msg._roomSide = this.n;

    if (isPrivate) {
      return this.socket.emit(event, msg);
    }
    this.battle.send(event, msg);
  };

  r.receive = function (event, cb) {
    this.socket.on(event, cb);
  };

  r.update = function () {
    //PubSub.publish("update");
    this.runEvent("Update");
  };

  r.onTurnStart = function () {
    this.foe.wait();
    this.turn();

    //wait for cardplay event
  };

  r.playCard = function (card) {
    if (card === null || card === -1) return;

    if (!this.placeCard(card)) return;

    this.hand.remove(card);

    this.update();

    this.runEvent("NextTurn", null, [this.foe]);
  };

  r.placeCard = function (card, obj) {
    obj = _.extend({}, obj);

    this.checkAbilities(card, obj);
    if (obj._cancelPlacement) return 0;

    var field = obj.targetSide.field[card.getType()];
    field.add(card);

    this.runEvent("EachCardPlace");

    this.checkAbilityOnAfterPlace(card, obj);
    /*
        this.runEvent("AfterPlace", this, [card, obj]);*/

    this.update();

    if (obj._waitResponse) {
      this.hand.remove(card);
      this.update();
      return 0;
    }

    return 1;
  };

  r.checkAbilities = function (card, obj, __flag) {
    var self = this;
    obj.targetSide = this;
    if (obj.disabled) return;
    var ability = Array.isArray(__flag) || card.getAbility();

    if (Array.isArray(ability) && ability.length) {
      var ret = ability.slice();
      ret = ret.splice(0, 1);
      this.checkAbilities(card, obj, ret);
      ability = ability[0];
    }

    if (ability && ability.name === obj.suppress) {
      this.update();
    }

    if (ability && !Array.isArray(ability)) {
      if (ability.onBeforePlace) {
        ability.onBeforePlace.apply(this, [card]);
      }
      if (ability.cancelPlacement) {
        obj._cancelPlacement = true;
      }
      if (ability.waitResponse) {
        obj._waitResponse = true;
      }
      if (ability.changeSide) {
        obj.targetSide = this.foe;
      }
      if (ability.onReset) {
        this.on("Reset", ability.onReset, this, [card]);
      }
      if (ability.replaceWith) {
        obj._cancelPlacement = true;
        this.on("Decoy:replaceWith", function (replaceCard) {
          if (replaceCard.getType() == Card.TYPE.LEADER || replaceCard.getType() == Card.TYPE.WEATHER || replaceCard.getType() == Card.TYPE.SPECIAL) {
            return;
          }
          if (replaceCard.getName() === card.getName()) return;
          self.off("Decoy:replaceWith");
          var field = self.field[replaceCard.getType()];

          field.replaceWith(replaceCard, card);
          self.runEvent("EachCardPlace");

          self.hand.add(replaceCard);
          self.hand.remove(card);
          self.update();

          self.runEvent("NextTurn", null, [self.foe]);
        });
      }
      if (ability.onEachTurn) {
        var uid = this.on("EachTurn", ability.onEachTurn, this, [card]);
        card._uidEvents["EachTurn"] = uid;
      }
      if (ability.onEachCardPlace) {
        var uid = this.on("EachCardPlace", ability.onEachCardPlace, this, [card]);
        card._uidEvents["EachCardPlace"] = uid;
      }

      this.update();
    }
  };

  r.checkAbilityOnAfterPlace = function (card, obj) {
    var ability = card.getAbility();
    if (ability) {
      if (ability.name && ability.name === obj.suppress) {
        this.update();
        return;
      }
      if (ability.onAfterPlace) {
        ability.onAfterPlace.call(this, card);
      }
    }
  };

  r.clearMainFields = function () {
    var cards1 = this.field[Card.TYPE.CLOSE_COMBAT].removeAll();
    var cards2 = this.field[Card.TYPE.RANGED].removeAll();
    var cards3 = this.field[Card.TYPE.SIEGE].removeAll();

    var cards = cards1.concat(cards2.concat(cards3));
    this.addToDiscard(cards);
  };

  r.addToDiscard = function (cards) {
    var self = this;
    cards.forEach(function (card) {
      self._discard.push(card);
    });
  };

  r.removeFromDiscard = function (card) {
    for (var i = 0; i < this._discard.length; i++) {
      var c = this._discard[i];
      if (c.getID() === card.getID()) {

        this._discard.splice(i, 1);
        return;
      }
    }
  };

  r.getDiscard = function (json) {
    if (json) {
      return JSON.stringify(this._discard);
    }
    return this._discard;
  };

  r.resetNewRound = function () {
    this.clearMainFields();
    this.setPassing(false);
  };

  r.filter = function (arrCards, opt) {
    var arr = arrCards.slice();

    for (var key in opt) {
      var res = [];
      var prop = key,
          val = opt[key];

      arrCards.forEach(function (card) {
        var property = card.getProperty(prop);
        if (_.isArray(property)) {
          var _f = false;
          for (var i = 0; i < property.length; i++) {
            if (property[i] === val) {
              _f = true;
              break;
            }
          }
          if (!_f) {
            res.push(card);
          }
        } else if (card.getProperty(prop) !== val) {
          res.push(card);
        }
      });
      arr = _.intersection(arr, res);
    }

    return arr;
  };

  return Battleside;
})();

module.exports = Battleside;

},{"../assets/data/deck":3,"./Card":15,"./Deck":16,"./Field":17,"./Hand":18,"underscore":12}],15:[function(require,module,exports){
"use strict";

var CardData = require("../assets/data/cards");
var AbilityData = require("../assets/data/abilities");

var Card = (function () {
  var Card = function Card(key) {
    if (!(this instanceof Card)) {
      return new Card(key);
    }
    /**
     * constructor here
     */
    this._uidEvents = {};
    this.setDisabled(false);
    this._key = key;
    this._data = CardData[key];
    this._data.key = key;
    this._boost = {};
    this._forcedPower = -1;
    this._init();
  };
  var r = Card.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._key = null;
  r._data = null;
  r._id = null;
  r._owner = null;
  r._boost = null;
  r._forcedPower = null;
  r._disabled = null;
  r._changedType = null;
  Card.__id = 0;
  Card.TYPE = {
    CLOSE_COMBAT: 0,
    RANGED: 1,
    SIEGE: 2,
    LEADER: 3,
    SPECIAL: 4,
    WEATHER: 5
  };

  r._uidEvents = null;

  r.getUidEvents = function (key) {
    return this._uidEvents[key];
  };

  r._init = function () {
    this._id = ++Card.__id;
  };

  r.getName = function () {
    return this._data.name;
  };
  r.getPower = function () {
    if (this._data.power === -1) return 0;
    if (this._forcedPower > -1) {
      return (this._forcedPower > this._data.power ? this._data.power : this._forcedPower) + this.getBoost();
    }
    return this._data.power + this.getBoost();
  };
  r.getRawPower = function () {
    return this._data.power;
  };
  /*r.calculateBoost = function(){
    this._boost = 0;
    for(var key in this._boosts) {
      var boost = this._boosts[key];
      this.boost(boost.getPower());
    }
  }*/
  r.setForcedPower = function (nr) {
    this._forcedPower = nr;
  };
  r.getRawAbility = function () {
    return this._data.ability;
  };
  r.getAbility = function () {
    if (Array.isArray(this._data.ability)) {
      var res = [];
      this._data.ability.forEach(function (ability) {
        res.push(AbilityData[ability]);
      });
      return res;
    }
    return AbilityData[this._data.ability];
  };
  r.getImage = function () {
    return "../assets/cards/" + this._data.img + ".png";
  };
  r.getFaction = function () {
    return this._data.faction;
  };
  r.getMusterType = function () {
    return this._data.musterType || null;
  };
  r.getType = function () {
    return this._changedType == null ? this._data.type : this._changedType;
  };
  r.changeType = function (type) {
    this._changedType = type;
  };
  r.getKey = function () {
    return this._key;
  };

  r.getID = function () {
    return this._id;
  };

  /*r.boost = function(nr){
    this.getPower(); //to recalculate this._power;
    this._boost += nr;
  }*/

  r.getBoost = function () {
    var res = 0;
    for (var key in this._boost) {
      res += this._boost[key];
    }
    this.boost = res;
    return res;
  };

  r.setBoost = function (key, val) {
    this._boost[key] = val;
    this.getBoost(); //to recalculate this.boost
  };

  r.isDisabled = function () {
    return this._disabled;
  };

  r.setDisabled = function (b) {
    this._disabled = b;
  };

  r.getProperty = function (prop) {
    if (!this._data[prop]) return {};
    return this._data[prop];
  };

  r.reset = function () {
    this._changedType = null;
    this._boost = {};
    this.boost = 0;
  };

  return Card;
})();

module.exports = Card;

},{"../assets/data/abilities":1,"../assets/data/cards":2}],16:[function(require,module,exports){
"use strict";

var Card = require("./Card");
/*var CardManager = require("./CardManager");*/

var Deck = (function () {
  var Deck = function Deck(deck) {
    if (!(this instanceof Deck)) {
      return new Deck(deck);
    }
    /**
     * constructor here
     */
    this._deck = [];

    this._originalDeck = [];
    this.setDeck(deck);
  };
  var r = Deck.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._deck = null;
  r._owner = null;
  r._originalDeck = null;

  r.setDeck = function (deckData) {
    this._originalDeck = deckData.slice();
    this._deck = deckData.slice();

    this._loadCards();
    this.shuffle();
  };

  r.getLength = function () {
    return this._deck.length;
  };

  r.length = function () {
    return this.getLength();
  };

  r.getDeck = function () {
    return this._deck;
  };

  r.draw = function () {
    if (!this._deck.length) return 0;
    var card = this.pop();
    return card;
  };

  r._loadCards = function () {
    this._deck = this.getDeck().map(function (cardkey) {
      return Card(cardkey);
    });
  };

  r.pop = function () {
    var id = this._deck.pop();
    /*
        var card = CardManager().getCardById(id);*/
    return id;
  };

  r.find = function (key, val) {
    var res = [];
    this.getDeck().forEach(function (card) {
      if (card.getProperty(key) == val) {
        res.push(card);
      }
    });
    return res;
  };

  r.removeFromDeck = function (card) {
    var n = this.length();

    for (var i = 0; i < n; i++) {
      var c = this.getDeck()[i];
      if (c.getID() === card.getID()) {
        return this.getDeck().splice(i, 1)[0];
      }
    }
    return -1;
  };

  r.shuffle = function () {
    var deck = this.getDeck();

    var n = this.length();
    for (var i = n - 1; i > 0; i--) {
      var j = Math.random() * i | 0;
      var tmp;

      tmp = deck[j];
      deck[j] = deck[i];
      deck[i] = tmp;
    }
  };

  return Deck;
})();

module.exports = Deck;

},{"./Card":15}],17:[function(require,module,exports){
"use strict";

var Field = (function () {
  var Field = function Field() {
    if (!(this instanceof Field)) {
      return new Field();
    }
    /**
     * constructor here
     */

    this._cards = [];
  };
  var r = Field.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._cards = null;
  r._score = 0;

  r.add = function (card) {
    this._cards.push(card);
    this.updateScore();
  };

  r.get = function () {
    return this._cards;
  };

  r.getScore = function () {
    this.updateScore();
    return this._score;
  };

  r.updateScore = function () {
    this._score = 0;
    for (var i = 0; i < this._cards.length; i++) {
      var card = this._cards[i];
      this._score += card.getPower();
    }
  };

  r.getPosition = function (card) {
    for (var i = 0; i < this._cards.length; i++) {
      if (this._cards[i].getID() === card.getID()) return i;
    }
    return -1;
  };

  r.isOnField = function (card) {
    return this.getPosition(card) >= 0;
  };

  r.replaceWith = function (oldCard, newCard) {
    var index = this.getPosition(oldCard);
    this._cards[index] = newCard;
    oldCard.reset();
    return oldCard;
  };

  r.getCard = function (id) {
    for (var i = 0; i < this._cards.length; i++) {
      var card = this._cards[i];
      if (card.getID() == id) return card;
    }
    return -1;
  };

  r.removeAll = function () {
    var tmp = this._cards.slice();
    tmp.forEach(function (card) {
      card.reset();
    });
    this._cards = [];
    return tmp;
  };

  return Field;
})();

module.exports = Field;

},{}],18:[function(require,module,exports){
/*var $ = require("jquery");*/ /*
                               var CardManager = require("./CardManager");*/ /*
                                                                             var PubSub = require("./pubsub");*/
"use strict";

var Card = require("./Card");

var Hand = (function () {
  var Hand = function Hand() {
    if (!(this instanceof Hand)) {
      return new Hand();
    }
    /**
     * constructor here
     */

    this._hand = [];
  };
  var r = Hand.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r._hand = null;

  r.add = function (card) {
    this._hand.push(card);
  };

  r.getCards = function () {
    return this._hand;
  };

  r.getCard = function (id) {
    for (var i = 0; i < this.length(); i++) {
      var card = this.getCards()[i];
      if (card.getID() === id) return card;
    }
    return -1;
  };

  r.remove = function (id) {
    var n = this.length();

    //console.trace(id);
    id = id instanceof Card ? id.getID() : id;

    for (var i = 0; i < n; i++) {
      if (this._hand[i].getID() != id) continue;
      return this._hand.splice(i, 1);
    }

    return -1;
  };

  r.getRandomCard = function () {
    var rnd = Math.random() * this._hand.length | 0;
    return this._hand[rnd];
  };

  r.getLength = function () {
    return this._hand.length;
  };

  r.length = function () {
    return this._hand.length;
  };

  r.find = function (key, val) {
    var res = [];
    this._hand.forEach(function (card) {
      if (card.getProperty(key) == val) {
        res.push(card);
      }
    });
    return res;
  };

  return Hand;
})();

module.exports = Hand;

},{"./Card":15}],19:[function(require,module,exports){
"use strict";

var Battle = require("../../server/Battle");
var Card = require("../../server/Card");
var data = require("../../assets/data/abilities");

describe("pubsub", function () {
  var battle, card1, card2;

  beforeEach(function () {
    battle = {};
    battle.runEvent = Battle.prototype.runEvent;
    battle.on = Battle.prototype.on;
    battle.off = Battle.prototype.off;
    battle.events = {};
    battle.update = function () {};

    card1 = Card("kaedweni_siege_expert");
    card2 = Card("dun_banner_medic");
  });

  it("on: has correct arguments", function () {
    //this.on("EachTurn", ability.onEachTurn, this, [card])

    battle.on("EachTurn", function (card) {
      expect(card).toEqual(card1);
    }, this, [card1]);
    battle.runEvent("EachTurn");
  });
  it("runEvent: has correct arguments", function () {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    battle.on("EachTurn", function (c) {
      expect(c).toEqual(card1);
    });
    battle.runEvent("EachTurn", null, [card1]);
  });
  it("on + runEvent: has correct arguments", function () {
    //this.on("EachTurn", ability.onEachTurn, this, [card])
    battle.on("EachTurn", function (c1, c2) {
      expect(c1).toEqual(card1);
      expect(c2).toEqual(card2);
    }, null, [card1]);
    battle.runEvent("EachTurn", null, [card2]);
  });
  it("test context", function () {

    battle.on("EachTurn", function (card) {
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card2.id);
    }, card2, [card1]);
    battle.runEvent("EachTurn");
  });
  it("test context", function () {

    battle.on("EachTurn", function (card) {
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card2.id);
    }, null, [card1]);
    battle.runEvent("EachTurn", card2);
  });
  it("test context", function () {

    battle.on("EachTurn", function (card) {
      expect(card.id).toEqual(card1.id);
      expect(this.id).toEqual(card1.id);
    }, card1, [card1]);
    battle.runEvent("EachTurn", card2);
  });

  it("should handle off correctly", function () {
    var cb1 = function cb1() {},
        cb2 = function cb2() {};
    var obj = {
      cb1: cb1,
      cb2: cb2
    };

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
  });
});

},{"../../assets/data/abilities":1,"../../server/Battle":13,"../../server/Card":15}],20:[function(require,module,exports){
"use strict";

var Card = require("../../server/Card");
var Battleside = require("../../server/Battleside");
var data = require("../../assets/data/abilities");

describe("filter", function () {
  var card, side, filter, cards;
  beforeEach(function () {
    filter = Battleside.prototype.filter;
    cards = [];
    cards.push(Card("iorveth"));
    cards.push(Card("toruviel"));
    cards.push(Card("isengrim_faoiltiarnah"));
    cards.push(Card("decoy"));
  });

  it("it should filter heroes out", function () {
    var res = filter(cards, {
      "ability": "hero"
    });
    expect(res.length).toBe(2);
  });

  it("it should filter hero and special cards out", function () {
    var res = filter(cards, {
      "ability": "hero",
      "type": Card.TYPE.SPECIAL
    });
    expect(res.length).toBe(1);
  });
});

},{"../../assets/data/abilities":1,"../../server/Battleside":14,"../../server/Card":15}],21:[function(require,module,exports){
"use strict";

require("./filterSpec");
require("./PubSubSpec");

(function main() {})();

},{"./PubSubSpec":19,"./filterSpec":20}]},{},[21])(21)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvYXNzZXRzL2RhdGEvYWJpbGl0aWVzLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L2Fzc2V0cy9kYXRhL2NhcmRzLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L2Fzc2V0cy9kYXRhL2RlY2suanMiLCJub2RlX21vZHVsZXMvc2hvcnRpZC9saWIvYWxwaGFiZXQuanMiLCJub2RlX21vZHVsZXMvc2hvcnRpZC9saWIvZGVjb2RlLmpzIiwibm9kZV9tb2R1bGVzL3Nob3J0aWQvbGliL2VuY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9zaG9ydGlkL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaG9ydGlkL2xpYi9pcy12YWxpZC5qcyIsIm5vZGVfbW9kdWxlcy9zaG9ydGlkL2xpYi9yYW5kb20vcmFuZG9tLWJ5dGUtYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9zaG9ydGlkL2xpYi9yYW5kb20vcmFuZG9tLWZyb20tc2VlZC5qcyIsIm5vZGVfbW9kdWxlcy9zaG9ydGlkL2xpYi91dGlsL2NsdXN0ZXItd29ya2VyLWlkLWJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3NlcnZlci9CYXR0bGUuanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvc2VydmVyL0JhdHRsZXNpZGUuanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvc2VydmVyL0NhcmQuanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvc2VydmVyL0RlY2suanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvc2VydmVyL0ZpZWxkLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3NlcnZlci9IYW5kLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3Rlc3Qvc3JjL1B1YlN1YlNwZWMuanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvdGVzdC9zcmMvZmlsdGVyU3BlYy5qcyIsIlk6L2h0ZG9jcy90aW0vMjAxNS9nd2VudC90ZXN0L3NyYy9tYWluU3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixTQUFPLEVBQUU7QUFDUCxtQkFBZSxFQUFFLElBQUk7QUFDckIsaUJBQWEsRUFBRSx1QkFBUyxJQUFJLEVBQUM7QUFDM0IsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsVUFBUyxJQUFJLEVBQUM7QUFDdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDbkIsa0JBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDeEIsQ0FBQyxDQUFBO0tBQ0g7R0FDRjtBQUNELFNBQU8sRUFBRTtBQUNQLGdCQUFZLEVBQUUsSUFBSTtBQUNsQixnQkFBWSxFQUFFLHNCQUFTLElBQUksRUFBQztBQUMxQixVQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0FBRWhDLGFBQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUM3QixpQkFBUyxFQUFFLE1BQU07QUFDakIsY0FBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVnREEsSUFBSSxVQUFVLEdB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SSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FB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QUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkUsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxRQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFB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LFlBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsWUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQixFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEIsVUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUM1QyxDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsY0FBYyxFQUFFLFlBQVU7O0FBRTNCLFVBQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVMsSUFBSSxFQUFDO0FBQ2xDLFlBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsQyxZQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbkMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ25CLFVBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDN0IsQ0FBQyxDQUFBO0FBQ0YsSUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFVOztBQUUzQixVQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFTLElBQUksRUFBQztBQUNsQyxZQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEMsWUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ25DLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsQixVQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxLQUFLLENB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LENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzVCLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBVTtBQUMxRCxRQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3RCLGVBQVMsRUFBRSxNQUFNO0FBQ2pCLFlBQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87S0FDMUIsQ0FBQyxDQUFBO0FBQ0YsVUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDNUIsQ0FBQyxDQUFBO0NBR0gsQ0FBQyxDQUFBOzs7OztBQ2hDRixPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV4QixDQUFDLFNBQVMsSUFBSSxHQUFFLEVBRWYsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIFwiYWdpbGVcIjoge1xyXG4gICAgY2FuY2VsUGxhY2VtZW50OiB0cnVlLFxyXG4gICAgb25CZWZvcmVQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgdGhpcy5zZW5kKFwicGxheWVkOmFnaWxlXCIsIHtjYXJkSUQ6IGNhcmQuZ2V0SUQoKX0sIHRydWUpO1xyXG4gICAgICB0aGlzLm9uKFwiYWdpbGU6c2V0RmllbGRcIiwgZnVuY3Rpb24odHlwZSl7XHJcbiAgICAgICAgc2VsZi5vZmYoXCJhZ2lsZTpzZXRGaWVsZFwiKTtcclxuICAgICAgICBjYXJkLmNoYW5nZVR5cGUodHlwZSlcclxuICAgICAgICBzZWxmLnBsYWNlQ2FyZChjYXJkLCB7XHJcbiAgICAgICAgICBkaXNhYmxlZDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlbGYuaGFuZC5yZW1vdmUoY2FyZCk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBcIm1lZGljXCI6IHtcclxuICAgIHdhaXRSZXNwb25zZTogdHJ1ZSxcclxuICAgIG9uQWZ0ZXJQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciBkaXNjYXJkID0gdGhpcy5nZXREaXNjYXJkKCk7XHJcblxyXG4gICAgICBkaXNjYXJkID0gdGhpcy5maWx0ZXIoZGlzY2FyZCwge1xyXG4gICAgICAgIFwiYWJpbGl0eVwiOiBcImhlcm9cIixcclxuICAgICAgICBcInR5cGVcIjogY2FyZC5jb25zdHJ1Y3Rvci5UWVBFLlNQRUNJQUxcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRoaXMuc2VuZChcInBsYXllZDptZWRpY1wiLCB7XHJcbiAgICAgICAgY2FyZHM6IEpTT04uc3RyaW5naWZ5KGRpc2NhcmQpXHJcbiAgICAgIH0sIHRydWUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJtb3JhbGVfYm9vc3RcIjoge1xyXG5cclxuICAgIG9uRWFjaENhcmRQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGRbY2FyZC5nZXRUeXBlKCldO1xyXG4gICAgICB2YXIgaWQgPSBjYXJkLmdldElEKCk7XHJcbiAgICAgIGlmKCFmaWVsZC5pc09uRmllbGQoY2FyZCkpe1xyXG4gICAgICAgIGZpZWxkLmdldCgpLmZvckVhY2goZnVuY3Rpb24oX2NhcmQpe1xyXG4gICAgICAgICAgaWYoX2NhcmQuZ2V0SUQoKSA9PSBpZCkgcmV0dXJuO1xyXG4gICAgICAgICAgaWYoX2NhcmQuZ2V0VHlwZSgpICE9IGNhcmQuZ2V0VHlwZSgpKSByZXR1cm47XHJcbiAgICAgICAgICBfY2FyZC5zZXRCb29zdChpZCwgMCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAvKnRoaXMub2ZmKFwiRWFjaENhcmRQbGFjZVwiKSovXHJcbiAgICAgICAgdGhpcy5vZmYoXCJFYWNoQ2FyZFBsYWNlXCIsIGNhcmQuZ2V0VWlkRXZlbnRzKFwiRWFjaENhcmRQbGFjZVwiKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmaWVsZC5nZXQoKS5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKXtcclxuICAgICAgICBpZihfY2FyZC5nZXRJRCgpID09IGlkKSByZXR1cm47XHJcbiAgICAgICAgaWYoX2NhcmQuZ2V0VHlwZSgpICE9IGNhcmQuZ2V0VHlwZSgpKSByZXR1cm47XHJcbiAgICAgICAgX2NhcmQuc2V0Qm9vc3QoaWQsIDEpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJtdXN0ZXJcIjoge1xyXG4gICAgbmFtZTogXCJtdXN0ZXJcIixcclxuICAgIG9uQWZ0ZXJQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciBtdXN0ZXJUeXBlID0gY2FyZC5nZXRNdXN0ZXJUeXBlKCk7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBjYXJkc0RlY2sgPSB0aGlzLmRlY2suZmluZChcIm11c3RlclR5cGVcIiwgbXVzdGVyVHlwZSk7XHJcbiAgICAgIHZhciBjYXJkc0hhbmQgPSB0aGlzLmhhbmQuZmluZChcIm11c3RlclR5cGVcIiwgbXVzdGVyVHlwZSk7XHJcblxyXG4gICAgICBjYXJkc0RlY2suZm9yRWFjaChmdW5jdGlvbihfY2FyZCl7XHJcbiAgICAgICAgc2VsZi5kZWNrLnJlbW92ZUZyb21EZWNrKF9jYXJkKTtcclxuICAgICAgICBzZWxmLnBsYWNlQ2FyZChfY2FyZCwge1xyXG4gICAgICAgICAgc3VwcHJlc3M6IFwibXVzdGVyXCJcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgY2FyZHNIYW5kLmZvckVhY2goZnVuY3Rpb24oX2NhcmQpe1xyXG4gICAgICAgIHNlbGYuaGFuZC5yZW1vdmUoX2NhcmQpO1xyXG4gICAgICAgIHNlbGYucGxhY2VDYXJkKF9jYXJkLCB7XHJcbiAgICAgICAgICBzdXBwcmVzczogXCJtdXN0ZXJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJ0aWdodF9ib25kXCI6IHtcclxuICAgIG9uQWZ0ZXJQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGRbY2FyZC5nZXRUeXBlKCldO1xyXG4gICAgICB2YXIgY2FyZHMgPSBmaWVsZC5nZXQoKTtcclxuICAgICAgdmFyIGxhc3RJbnNlcnQgPSBjYXJkcy5sZW5ndGg7XHJcblxyXG4gICAgICBpZihsYXN0SW5zZXJ0IDwgMikgcmV0dXJuO1xyXG5cclxuICAgICAgaWYoY2FyZHNbbGFzdEluc2VydCAtIDJdLmdldE5hbWUoKSA9PSBjYXJkc1tsYXN0SW5zZXJ0IC0gMV0uZ2V0TmFtZSgpKXtcclxuICAgICAgICBjYXJkc1tsYXN0SW5zZXJ0IC0gMl0uYm9vc3QoK2NhcmRzW2xhc3RJbnNlcnQgLSAyXS5nZXRQb3dlcigpKTtcclxuICAgICAgICBjYXJkc1tsYXN0SW5zZXJ0IC0gMV0uYm9vc3QoK2NhcmRzW2xhc3RJbnNlcnQgLSAxXS5nZXRQb3dlcigpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJzcHlcIjoge1xyXG4gICAgY2hhbmdlU2lkZTogdHJ1ZSxcclxuICAgIG9uQWZ0ZXJQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHRoaXMuZHJhdygyKTtcclxuICAgIH1cclxuICB9LFxyXG4gIFwid2VhdGhlcl9mb2dcIjoge1xyXG4gICAgb25FYWNoVHVybjogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciB0YXJnZXRSb3cgPSBjYXJkLmNvbnN0cnVjdG9yLlRZUEUuUkFOR0VEO1xyXG4gICAgICB2YXIgZm9yY2VkUG93ZXIgPSAxO1xyXG4gICAgICB2YXIgZmllbGQxID0gdGhpcy5maWVsZFt0YXJnZXRSb3ddLmdldCgpO1xyXG4gICAgICB2YXIgZmllbGQyID0gdGhpcy5mb2UuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuXHJcbiAgICAgIHZhciBmaWVsZCA9IGZpZWxkMS5jb25jYXQoZmllbGQyKTtcclxuXHJcbiAgICAgIGZpZWxkLmZvckVhY2goZnVuY3Rpb24oX2NhcmQpe1xyXG4gICAgICAgIGlmKF9jYXJkLmdldFJhd0FiaWxpdHkoKSA9PSBcImhlcm9cIikgcmV0dXJuO1xyXG4gICAgICAgIF9jYXJkLnNldEZvcmNlZFBvd2VyKGZvcmNlZFBvd2VyKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25FYWNoQ2FyZFBsYWNlOiBmdW5jdGlvbihjYXJkKXtcclxuICAgICAgdmFyIHRhcmdldFJvdyA9IGNhcmQuY29uc3RydWN0b3IuVFlQRS5SQU5HRUQ7XHJcbiAgICAgIHZhciBmb3JjZWRQb3dlciA9IDE7XHJcbiAgICAgIHZhciBmaWVsZDEgPSB0aGlzLmZpZWxkW3RhcmdldFJvd10uZ2V0KCk7XHJcbiAgICAgIHZhciBmaWVsZDIgPSB0aGlzLmZvZS5maWVsZFt0YXJnZXRSb3ddLmdldCgpO1xyXG5cclxuICAgICAgdmFyIGZpZWxkID0gZmllbGQxLmNvbmNhdChmaWVsZDIpO1xyXG5cclxuICAgICAgZmllbGQuZm9yRWFjaChmdW5jdGlvbihfY2FyZCl7XHJcbiAgICAgICAgaWYoX2NhcmQuZ2V0UmF3QWJpbGl0eSgpID09IFwiaGVyb1wiKSByZXR1cm47XHJcbiAgICAgICAgX2NhcmQuc2V0Rm9yY2VkUG93ZXIoZm9yY2VkUG93ZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIFwid2VhdGhlcl9yYWluXCI6IHtcclxuICAgIG9uRWFjaFR1cm46IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgICB2YXIgdGFyZ2V0Um93ID0gY2FyZC5jb25zdHJ1Y3Rvci5UWVBFLlNJRUdFO1xyXG4gICAgICB2YXIgZm9yY2VkUG93ZXIgPSAxO1xyXG4gICAgICB2YXIgZmllbGQxID0gdGhpcy5maWVsZFt0YXJnZXRSb3ddLmdldCgpO1xyXG4gICAgICB2YXIgZmllbGQyID0gdGhpcy5mb2UuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuXHJcbiAgICAgIHZhciBmaWVsZCA9IGZpZWxkMS5jb25jYXQoZmllbGQyKTtcclxuXHJcbiAgICAgIGZpZWxkLmZvckVhY2goZnVuY3Rpb24oX2NhcmQpe1xyXG4gICAgICAgIGlmKF9jYXJkLmdldFJhd0FiaWxpdHkoKSA9PSBcImhlcm9cIikgcmV0dXJuO1xyXG4gICAgICAgIF9jYXJkLnNldEZvcmNlZFBvd2VyKGZvcmNlZFBvd2VyKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJ3ZWF0aGVyX2Zyb3N0XCI6IHtcclxuICAgIG9uRWFjaFR1cm46IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgICB2YXIgdGFyZ2V0Um93ID0gY2FyZC5jb25zdHJ1Y3Rvci5UWVBFLkNMT1NFX0NPTUJBVDtcclxuICAgICAgdmFyIGZvcmNlZFBvd2VyID0gMTtcclxuICAgICAgdmFyIGZpZWxkMSA9IHRoaXMuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuICAgICAgdmFyIGZpZWxkMiA9IHRoaXMuZm9lLmZpZWxkW3RhcmdldFJvd10uZ2V0KCk7XHJcblxyXG4gICAgICB2YXIgZmllbGQgPSBmaWVsZDEuY29uY2F0KGZpZWxkMik7XHJcblxyXG4gICAgICBmaWVsZC5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKXtcclxuICAgICAgICBpZihfY2FyZC5nZXRSYXdBYmlsaXR5KCkgPT0gXCJoZXJvXCIpIHJldHVybjtcclxuICAgICAgICBfY2FyZC5zZXRGb3JjZWRQb3dlcihmb3JjZWRQb3dlcik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9LFxyXG4gIFwiY2xlYXJfd2VhdGhlclwiOiB7XHJcbiAgICBvbkFmdGVyUGxhY2U6IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgICB2YXIgdGFyZ2V0Um93ID0gY2FyZC5jb25zdHJ1Y3Rvci5UWVBFLldFQVRIRVI7XHJcbiAgICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuXHJcbiAgICAgIC8vdG9kbzogcmVtb3ZlIHdlYXRoZXIgY2FyZHNcclxuICAgIH1cclxuICB9LFxyXG4gIFwiZGVjb3lcIjoge1xyXG4gICAgcmVwbGFjZVdpdGg6IHRydWVcclxuICB9LFxyXG4gIFwiZm9sdGVzdF9sZWFkZXIxXCI6IHtcclxuICAgIG9uQWN0aXZhdGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBjYXJkcyA9IHRoaXMuZGVjay5maW5kKFwia2V5XCIsIFwiaW1wZW5ldHJhYmxlX2ZvZ1wiKVxyXG4gICAgICBpZighY2FyZHMubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgIHZhciBjYXJkID0gdGhpcy5kZWNrLnJlbW92ZUZyb21EZWNrKGNhcmRzWzBdKTtcclxuICAgICAgdGhpcy5wbGFjZUNhcmQoY2FyZCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBcImZyYW5jZXNjYV9sZWFkZXIxXCI6IHt9LFxyXG4gIFwiZnJhbmNlc2NhX2xlYWRlcjJcIjoge30sXHJcbiAgXCJmcmFuY2VzY2FfbGVhZGVyM1wiOiB7fSxcclxuICBcImZyYW5jZXNjYV9sZWFkZXI0XCI6IHt9LFxyXG4gIFwiZXJlZGluX2xlYWRlcjFcIjoge30sXHJcbiAgXCJlcmVkaW5fbGVhZGVyMlwiOiB7fSxcclxuICBcImVyZWRpbl9sZWFkZXIzXCI6IHt9LFxyXG4gIFwiZXJlZGluX2xlYWRlcjRcIjoge30sXHJcbiAgXCJoZXJvXCI6IHt9XHJcbn0iLCIvKipcclxuICogdHlwZXNcclxuICogMCBjbG9zZSBjb21iYXRcclxuICogMSByYW5nZWRcclxuICogMiBzaWVnZVxyXG4gKiAzIGxlYWRlclxyXG4gKiA0IHNwZWNpYWwgKGRlY295KVxyXG4gKiA1IHdlYXRoZXJcclxuICovXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgXCJyZWRhbmlhbl9mb290X3NvbGRpZXJcIjoge1xyXG4gICAgbmFtZTogXCJSZWRhbmlhbiBGb290IFNvbGRpZXJcIixcclxuICAgIHBvd2VyOiAxLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJmb290X3NvbGRpZXIxXCIsXHJcbiAgICBmYWN0aW9uOiBcIk5vcnRoZXJuIFJlYWxtXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcInBvb3JfZnVja2luZ19pbmZhbnRyeVwiOiB7XHJcbiAgICBuYW1lOiBcIlBvb3IgRnVja2luZyBJbmZhbnRyeVwiLFxyXG4gICAgcG93ZXI6IDEsXHJcbiAgICBhYmlsaXR5OiBcInRpZ2h0X2JvbmRcIixcclxuICAgIGltZzogXCJpbmZhbnRyeVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ5YXJwZW5femlncmluXCI6IHtcclxuICAgIG5hbWU6IFwiWWFycGVuIFppZ3JpblwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInlhcnBlblwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJibHVlX3N0cmlwZXNfY29tbWFuZG9cIjoge1xyXG4gICAgbmFtZTogXCJCbHVlIFN0cmlwZXMgQ29tbWFuZG9cIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogXCJ0aWdodF9ib25kXCIsXHJcbiAgICBpbWc6IFwiY29tbWFuZG9cIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwic2lnaXNtdW50X2RpamtzdHJhXCI6IHtcclxuICAgIG5hbWU6IFwiU2lnaXNtdW50IERpamtzdHJhXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IFwic3B5XCIsXHJcbiAgICBpbWc6IFwiZGlqa3N0cmFcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwicHJpbmNlX3N0ZW5uaXNcIjoge1xyXG4gICAgbmFtZTogXCJQcmluY2UgU3Rlbm5pc1wiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBcInNweVwiLFxyXG4gICAgaW1nOiBcInN0ZW5uaXNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwic2llZ2ZyaWVkX29mX2RlbmVzbGVcIjoge1xyXG4gICAgbmFtZTogXCJTaWVnZnJpZWQgb2YgRGVuZXNsZVwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNpZWdmcmllZFwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ2ZXNcIjoge1xyXG4gICAgbmFtZTogXCJWZXNcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJ2ZXNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwidmVybm9uX3JvY2hlXCI6IHtcclxuICAgIG5hbWU6IFwiVmVybm9uIFJvY2hlXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJyb2NoZVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJqb2huX25hdGFsaXNcIjoge1xyXG4gICAgbmFtZTogXCJKb2huIE5hdGFsaXNcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcIm5hdGFsaXNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwic2hlbGRvbl9za2FnZ3NcIjoge1xyXG4gICAgbmFtZTogXCJTaGVsZG9uIFNrYWdnc1wiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNrYWdnc1wiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJzYWJyaW5hX2dsZXZpc3NpZ1wiOiB7XHJcbiAgICBuYW1lOiBcIlNhYnJpbmEgR2xldmlzc2lnXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwic2FicmluYVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJjcmluZnJpZF9yZWF2ZXJzX2RyYWdvbl9odW50ZXJcIjoge1xyXG4gICAgbmFtZTogXCJDcmluZnJpZCBSZWF2ZXIncyBEcmFnb24gSHVudGVyXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IFwidGlnaHRfYm9uZFwiLFxyXG4gICAgaW1nOiBcImNyaW5mcmlkXCIsXHJcbiAgICBmYWN0aW9uOiBcIk5vcnRoZXJuIFJlYWxtXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcInNpbGVfZGVfdGFuc2FydmlsbGVcIjoge1xyXG4gICAgbmFtZTogXCJTw61sZSBkZSBUYW5zYXJ2aWxsZVwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNpbGVcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwia2VpcmFfbWV0elwiOiB7XHJcbiAgICBuYW1lOiBcIktlaXJhIE1ldHpcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJrZWlyYVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJkZXRobW9sZFwiOiB7XHJcbiAgICBuYW1lOiBcIkRldGhtb2xkXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZGV0aG1vbGRcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwia2FlZHdlbmlfc2llZ2VfZXhwZXJ0XCI6IHtcclxuICAgIG5hbWU6IFwiS2FlZHdlbmkgU2llZ2UgRXhwZXJ0XCIsXHJcbiAgICBwb3dlcjogMSxcclxuICAgIGFiaWxpdHk6IFwibW9yYWxlX2Jvb3N0XCIsXHJcbiAgICBpbWc6IFwic2llZ2VfZXhwZXJ0MVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJkdW5fYmFubmVyX21lZGljXCI6IHtcclxuICAgIG5hbWU6IFwiRHVuIEJhbm5lciBNZWRpY1wiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBcIm1lZGljXCIsXHJcbiAgICBpbWc6IFwibWVkaWNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDJcclxuICB9LFxyXG4gIFwiYmFsbGlzdGFcIjoge1xyXG4gICAgbmFtZTogXCJCYWxsaXN0YVwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImJhbGxpc3RhMVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJ0cmVidWNoZXRcIjoge1xyXG4gICAgbmFtZTogXCJUcmVidWNoZXRcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJ0cmVidWNoZXQxXCIsXHJcbiAgICBmYWN0aW9uOiBcIk5vcnRoZXJuIFJlYWxtXCIsXHJcbiAgICB0eXBlOiAyXHJcbiAgfSxcclxuICBcInRoYWxlclwiOiB7XHJcbiAgICBuYW1lOiBcIlRoYWxlclwiLFxyXG4gICAgcG93ZXI6IDEsXHJcbiAgICBhYmlsaXR5OiBcInNweVwiLFxyXG4gICAgaW1nOiBcInRoYWxlclwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJmb2x0ZXN0X2tpbmdfb2ZfdGVtZXJpYVwiOiB7XHJcbiAgICBuYW1lOiBcIkZvbHRlc3Q6IEtpbmcgb2YgVGVtZXJpYVwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJmb2x0ZXN0X2xlYWRlcjFcIixcclxuICAgIGltZzogXCJmb2x0ZXN0X2tpbmdcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDNcclxuICB9LFxyXG4gIFwiZGVjb3lcIjoge1xyXG4gICAgbmFtZTogXCJEZWNveVwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJkZWNveVwiLFxyXG4gICAgaW1nOiBcImRlY295XCIsXHJcbiAgICBmYWN0aW9uOiBudWxsLFxyXG4gICAgdHlwZTogNFxyXG4gIH0sXHJcbiAgXCJpbXBlbmV0cmFibGVfZm9nXCI6IHtcclxuICAgIG5hbWU6IFwiSW1wZW5ldHJhYmxlIEZvZ1wiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJ3ZWF0aGVyX2ZvZ1wiLFxyXG4gICAgaW1nOiBcImZvZ1wiLFxyXG4gICAgZmFjdGlvbjogbnVsbCxcclxuICAgIHR5cGU6IDVcclxuICB9LFxyXG5cclxuXHJcbiAgXCJmcmFuY2VzY2FfcHVyZWJsb29kX2VsZlwiOiB7XHJcbiAgICBuYW1lOiBcIkZyYW5jZXNjYSwgUHVyZWJsb29kIEVsZlwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJmcmFuY2VzY2FfbGVhZGVyMVwiLFxyXG4gICAgaW1nOiBcImZyYW5jZXNjYV9wdXJlYmxvb2RcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogM1xyXG4gIH0sXHJcbiAgXCJmcmFuY2VzY2FfdGhlX2JlYXV0aWZ1bFwiOiB7XHJcbiAgICBuYW1lOiBcIkZyYW5jZXNjYSBUaGUgQmVhdXRpZnVsXCIsXHJcbiAgICBwb3dlcjogLTEsXHJcbiAgICBhYmlsaXR5OiBcImZyYW5jZXNjYV9sZWFkZXIyXCIsXHJcbiAgICBpbWc6IFwiZnJhbmNlc2NhX2JlYXRpZnVsXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDNcclxuICB9LFxyXG4gIFwiZnJhbmNlc2NhX2RhaXN5X29mX3RoZV92YWxsZXlcIjoge1xyXG4gICAgbmFtZTogXCJGcmFuY2VzY2EsIERhaXN5IG9mIFRoZSBWYWxsZXlcIixcclxuICAgIHBvd2VyOiAtMSxcclxuICAgIGFiaWxpdHk6IFwiZnJhbmNlc2NhX2xlYWRlcjNcIixcclxuICAgIGltZzogXCJmcmFuY2VzY2FfZGFpc3lcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogM1xyXG4gIH0sXHJcbiAgXCJmcmFuY2VzY2FfcXVlZW5fb2ZfZG9sX2JsYXRoYW5uYVwiOiB7XHJcbiAgICBuYW1lOiBcIkZyYW5jZXNjYSwgUXVlZW4gb2YgRG9sIEJsYXRoYW5uYVwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJmcmFuY2VzY2FfbGVhZGVyNFwiLFxyXG4gICAgaW1nOiBcImZyYW5jZXNjYV9xdWVlblwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAzXHJcbiAgfSxcclxuICBcInNhZXNlbnRoZXNzaXNcIjoge1xyXG4gICAgbmFtZTogXCJTYWVzZW50aGVzc2lzXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJzYWVzZW50aGVzc2lzXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiaW9ydmV0aFwiOiB7XHJcbiAgICBuYW1lOiBcIklvcnZldGhcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcImlvcnZldGhcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJpc2VuZ3JpbV9mYW9pbHRpYXJuYWhcIjoge1xyXG4gICAgbmFtZTogXCJJc2VuZ3JpbSBGYW9pbHRpYXJuYWhcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFtcImhlcm9cIiwgXCJtb3JhbGVfYm9vc3RcIl0sXHJcbiAgICBpbWc6IFwiaXNlbmdyaW1cIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJlaXRobmVcIjoge1xyXG4gICAgbmFtZTogXCJFaXRobmVcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcImVpdGhuZVwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImhhdmVrYXJfaGVhbGVyXCI6IHtcclxuICAgIG5hbWU6IFwiSGF2ZWthciBIZWFsZXJcIixcclxuICAgIHBvd2VyOiAwLFxyXG4gICAgYWJpbGl0eTogXCJtZWRpY1wiLFxyXG4gICAgaW1nOiBcImhlYWxlclwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcInJpb3JkYWluXCI6IHtcclxuICAgIG5hbWU6IFwiUmlvcmRhaW5cIixcclxuICAgIHBvd2VyOiAxLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJyaW9yZGFpblwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcInRvcnV2aWVsXCI6IHtcclxuICAgIG5hbWU6IFwiVG9ydXZpZWxcIixcclxuICAgIHBvd2VyOiAyLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJ0b3J1dmllbFwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImVsdmVuX3NraXJtaXNoZXJcIjoge1xyXG4gICAgbmFtZTogXCJFbHZlbiBTa2lybWlzaGVyXCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcInNraXJtaXNoZXJcIixcclxuICAgIGltZzogXCJlbHZlbl9za2lybWlzaGVyMlwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImR3YXJ2ZW5fc2tpcm1pc2hlclwiOiB7XHJcbiAgICBuYW1lOiBcIkR3YXJ2ZW4gU2tpcm1pc2hlclwiLFxyXG4gICAgcG93ZXI6IDMsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJza2lybWlzaGVyXCIsXHJcbiAgICBpbWc6IFwic2tpcm1pc2hlcjJcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJjaWFyYW5fYWVwX2Vhc25pbGxpZW5cIjoge1xyXG4gICAgbmFtZTogXCJDaWFyYW4gYWVwIEVhc25pbGxpZW5cIixcclxuICAgIHBvd2VyOiAzLFxyXG4gICAgYWJpbGl0eTogXCJhZ2lsZVwiLFxyXG4gICAgaW1nOiBcImVhc25pbGxpZW5cIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJ2cmloZWRkX2JyaWdhZGVfcmVjcnVpdFwiOiB7XHJcbiAgICBuYW1lOiBcIlZyaWhlZGQgQnJpZ2FkZSBSZWNydWl0XCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwicmVjcnVpdFwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImRvbF9ibGF0aGFubmFfYXJjaGVyXCI6IHtcclxuICAgIG5hbWU6IFwiRG9sIEJsYXRoYW5uYSBBcmNoZXJcIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJhcmNoZXJcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sIC8qXHJcbiAgXCJoYXZfY2FhcmVuX21lZGljXCI6IHtcclxuICAgIG5hbWU6IFwiSGF24oCZY2FhcmVuIE1lZGljXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiXCIsIC8vbWlzc2luZyBpbWFnZVxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSwqL1xyXG4gIFwiaGF2ZWthcl9zbXVnZ2xlclwiOiB7XHJcbiAgICBuYW1lOiBcIkhhdmVrYXIgU211Z2dsZXJcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogXCJzcHlcIixcclxuICAgIGltZzogXCJzbXVnZ2xlcjFcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJtYWhha2FtYW5fZGVmZW5kZXJcIjoge1xyXG4gICAgbmFtZTogXCJNYWhha2FtYW4gRGVmZW5kZXJcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJkZWZlbmRlcjJcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ2cmloZWRkX2JyaWdhZGVfdmV0ZXJhblwiOiB7XHJcbiAgICBuYW1lOiBcIlZyaWhlZGQgQnJpZ2FkZSBWZXRlcmFuXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IFwiYWdpbGVcIixcclxuICAgIGltZzogXCJ2ZXRlcmFuMVwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImRlbm5pc19jcmFubWVyXCI6IHtcclxuICAgIG5hbWU6IFwiRGVubmlzIENyYW5tZXJcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJjcmFubWVyXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiZmlsYXZhbmRyZWxfYWVuX2ZpZGhhaWxcIjoge1xyXG4gICAgbmFtZTogXCJGaWxhdmFuZHJlbCBhw6luIEZpZGjDoWlsXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IFwiYWdpbGVcIixcclxuICAgIGltZzogXCJmaWRoYWlsXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiaWRhX2VtZWFuX2FlcF9zaXZuZXlcIjoge1xyXG4gICAgbmFtZTogXCJJZGEgRW1lYW4gYWVwIFNpdm5leVwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNpdm5leVwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcInlhZXZpbm5cIjoge1xyXG4gICAgbmFtZTogXCJZYWV2aW5uXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IFwiYWdpbGVcIixcclxuICAgIGltZzogXCJ5YWV2aW5uXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiYmFyY2xheV9lbHNcIjoge1xyXG4gICAgbmFtZTogXCJCYXJjbGF5IEVsc1wiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBcImFnaWxlXCIsXHJcbiAgICBpbWc6IFwiYmFyY2xheVwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImRvbF9ibGF0aGFubmFfc2NvdXRcIjoge1xyXG4gICAgbmFtZTogXCJEb2wgQmxhdGhhbm5hIFNjb3V0XCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IFwiYWdpbGVcIixcclxuICAgIGltZzogXCJzY291dDJcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJtaWx2YVwiOiB7XHJcbiAgICBuYW1lOiBcIk1pbHZhXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcIm1vcmFsZV9ib29zdFwiLFxyXG4gICAgaW1nOiBcIm1pbHZhXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG5cclxuXHJcbiAgXCJlcmVkaW5fY29tbWFuZGVyX29mX3RoZV9yZWRfcmlkZXJzXCI6IHtcclxuICAgIG5hbWU6IFwiRXJlZGluLCBDb21tYW5kZXIgb2YgdGhlIFJlZCBSaWRlcnNcIixcclxuICAgIHBvd2VyOiAtMSxcclxuICAgIGFiaWxpdHk6IFwiZXJlZGluX2xlYWRlcjFcIixcclxuICAgIGltZzogXCJlcmVkaW5fY29tbWFuZGVyXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDNcclxuICB9LFxyXG4gIFwiZXJlZGluX2JyaW5nZXJfb2ZfZGVhdGhcIjoge1xyXG4gICAgbmFtZTogXCJFcmVkaW4sIEJyaW5nZXIgb2YgRGVhdGhcIixcclxuICAgIHBvd2VyOiAtMSxcclxuICAgIGFiaWxpdHk6IFwiZXJlZGluX2xlYWRlcjJcIixcclxuICAgIGltZzogXCJlcmVkaW5fYnJpbmdlclwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAzXHJcbiAgfSxcclxuICBcImVyZWRpbl9kZXN0cm95ZXJfb2Zfd29ybGRzXCI6IHtcclxuICAgIG5hbWU6IFwiRXJlZGluLCBEZXN0cm95ZXIgb2YgV29ybGRzXCIsXHJcbiAgICBwb3dlcjogLTEsXHJcbiAgICBhYmlsaXR5OiBcImVyZWRpbl9sZWFkZXIzXCIsXHJcbiAgICBpbWc6IFwiZXJlZGluX2Rlc3Ryb3llclwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAzXHJcbiAgfSxcclxuICBcImVyZWRpbl9raW5nX29mX3RoZV93aWxkX2h1bnRcIjoge1xyXG4gICAgbmFtZTogXCJFcmVkaW4sIEtpbmcgb2YgVGhlIFdpbGQgSHVudFwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJlcmVkaW5fbGVhZGVyNFwiLFxyXG4gICAgaW1nOiBcImVyZWRpbl9raW5nXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDNcclxuICB9LFxyXG4gIFwia2F5cmFuXCI6IHtcclxuICAgIG5hbWU6IFwiS2F5cmFuXCIsXHJcbiAgICBwb3dlcjogOCxcclxuICAgIGFiaWxpdHk6IFtcImhlcm9cIiwgXCJtb3JhbGVfYm9vc3RcIl0sXHJcbiAgICBpbWc6IFwia2F5cmFuXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwibGVzaGVuXCI6IHtcclxuICAgIG5hbWU6IFwiTGVzaGVuXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJsZXNoZW5cIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJpbWxlcml0aFwiOiB7XHJcbiAgICBuYW1lOiBcIkltbGVyaXRoXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJpbWxlcml0aFwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImRyYXVnXCI6IHtcclxuICAgIG5hbWU6IFwiRHJhdWdcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcImRyYXVnXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiZ2hvdWxcIjoge1xyXG4gICAgbmFtZTogXCJHaG91bFwiLFxyXG4gICAgcG93ZXI6IDEsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJnaG91bFwiLFxyXG4gICAgaW1nOiBcImdob3VsMVwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcIm5la2tlclwiOiB7XHJcbiAgICBuYW1lOiBcIk5la2tlclwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJuZWtrZXJcIixcclxuICAgIGltZzogXCJuZWtrZXJcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ3eXZlcm5cIjoge1xyXG4gICAgbmFtZTogXCJXeXZlcm5cIixcclxuICAgIHBvd2VyOiAyLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJ3eXZlcm5cIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJmb2dsZXRcIjoge1xyXG4gICAgbmFtZTogXCJGb2dsZXRcIixcclxuICAgIHBvd2VyOiAyLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJmb2dsZXRcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJjZWxhZW5vX2hhcnB5XCI6IHtcclxuICAgIG5hbWU6IFwiQ2VsYWVubyBIYXJweVwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImNlbGFlbm9faGFycHlcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJnYXJnb3lsZVwiOiB7XHJcbiAgICBuYW1lOiBcIkdhcmdveWxlXCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZ2FyZ295bGVcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJjb2NrYXRyaWNlXCI6IHtcclxuICAgIG5hbWU6IFwiQ29ja2F0cmljZVwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImNvY2thdHJpY2VcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJoYXJweVwiOiB7XHJcbiAgICBuYW1lOiBcIkhhcnB5XCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IFwiYWdpbGVcIixcclxuICAgIGltZzogXCJoYXJweVwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImVuZHJlZ2FcIjoge1xyXG4gICAgbmFtZTogXCJFbmRyZWdhXCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZW5kcmVnYVwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcInZhbXBpcmVfYnJ1eGFcIjoge1xyXG4gICAgbmFtZTogXCJWYW1waXJlOiBCcnV4YVwiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJ2YW1waXJlXCIsXHJcbiAgICBpbWc6IFwidmFtcGlyZV9icnV4YVwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcInZhbXBpcmVfZmxlZGVyXCI6IHtcclxuICAgIG5hbWU6IFwiVmFtcGlyZTogRmxlZGVyXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcInZhbXBpcmVcIixcclxuICAgIGltZzogXCJ2YW1waXJlX2ZsZWRlclwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcInZhbXBpcmVfZ2Fya2FpblwiOiB7XHJcbiAgICBuYW1lOiBcIlZhbXBpcmU6IEdhcmthaW5cIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwidmFtcGlyZVwiLFxyXG4gICAgaW1nOiBcInZhbXBpcmVfZ2Fya2FpblwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcInZhbXBpcmVfZWtpbW1hcmFcIjoge1xyXG4gICAgbmFtZTogXCJWYW1waXJlOiBFa2ltbWFyYVwiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJ2YW1waXJlXCIsXHJcbiAgICBpbWc6IFwidmFtcGlyZV9la2ltbWFyYVwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImFyYWNoYXNcIjoge1xyXG4gICAgbmFtZTogXCJBcmFjaGFzXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcImFyYWNoYXNcIixcclxuICAgIGltZzogXCJhcmFjaGFzMVwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImJvdGNobGluZ1wiOiB7XHJcbiAgICBuYW1lOiBcIkJvdGNobGluZ1wiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImJvdGNobGluZ1wiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImZvcmt0YWlsXCI6IHtcclxuICAgIG5hbWU6IFwiRm9ya3RhaWxcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJmb3JrdGFpbFwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcInBsYWd1ZV9tYWlkZW5cIjoge1xyXG4gICAgbmFtZTogXCJQbGFndWUgTWFpZGVuXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZm9ya3RhaWxcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJncmlmZmluXCI6IHtcclxuICAgIG5hbWU6IFwiR3JpZmZpblwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImdyaWZmaW5cIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ3ZXJld29sZlwiOiB7XHJcbiAgICBuYW1lOiBcIldlcmV3b2xmXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwid2VyZXdvbGZcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJmcmlnaHRlbmVyXCI6IHtcclxuICAgIG5hbWU6IFwiRnJpZ2h0ZW5lclwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImZyaWdodGVuZXJcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJpY2VfZ2lhbnRcIjoge1xyXG4gICAgbmFtZTogXCJJY2UgR2lhbnRcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJpY2VfZ2lhbnRcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJncmF2ZV9oYWdcIjoge1xyXG4gICAgbmFtZTogXCJHcmF2ZSBIYWdcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJncmF2ZV9oYWdcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgLypcInZhbXBpcmVfa2F0YWthblwiOiB7XHJcbiAgICBuYW1lOiBcIlZhbXBpcmU6IEthdGFrYW5cIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuIG11c3RlclR5cGU6IFwidmFtcGlyZVwiLFxyXG4gICAgaW1nOiBcInZhbXBpcmVfa2F0YWthblwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSwqL1xyXG4gIFwiY3JvbmVfd2hpc3Blc3NcIjoge1xyXG4gICAgbmFtZTogXCJDcm9uZTogV2hpc3Blc3NcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwiY3JvbmVcIixcclxuICAgIGltZzogXCJjcm9uZV93aGlzcGVzc1wiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImNyb25lX2JyZXdlc3NcIjoge1xyXG4gICAgbmFtZTogXCJDcm9uZTogQnJld2Vzc1wiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJjcm9uZVwiLFxyXG4gICAgaW1nOiBcImNyb25lX2JyZXdlc3NcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJjcm9uZV93ZWF2ZXNzXCI6IHtcclxuICAgIG5hbWU6IFwiQ3JvbmU6IFdlYXZlc3NcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwiY3JvbmVcIixcclxuICAgIGltZzogXCJjcm9uZV93ZWF2ZXNzXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiYXJhY2hhc19iZWhlbW90aFwiOiB7XHJcbiAgICBuYW1lOiBcIkFyYWNoYXMgQmVoZW1vdGhcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwiYXJhY2hhc1wiLFxyXG4gICAgaW1nOiBcImFyYWNoYXNfYmVoZW1vdGhcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJmaXJlX2VsZW1lbnRhbFwiOiB7XHJcbiAgICBuYW1lOiBcIkZpcmUgRWxlbWVudGFsXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZmlyZV9lbGVtZW50YWxcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJmaWVuZFwiOiB7XHJcbiAgICBuYW1lOiBcIkZpZW5kXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZmllbmRcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJlYXJ0aF9lbGVtZW50YWxcIjoge1xyXG4gICAgbmFtZTogXCJFYXJ0aCBFbGVtZW50YWxcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJlYXJ0aF9lbGVtZW50YWxcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgXCJub3J0aGVybl9yZWFsbVwiOiBbXHJcbiAgICBcInJlZGFuaWFuX2Zvb3Rfc29sZGllclwiLFxyXG4gICAgXCJwb29yX2Z1Y2tpbmdfaW5mYW50cnlcIixcclxuICAgIFwicmVkYW5pYW5fZm9vdF9zb2xkaWVyXCIsXHJcbiAgICBcInBvb3JfZnVja2luZ19pbmZhbnRyeVwiLFxyXG4gICAgXCJ5YXJwZW5femlncmluXCIsXHJcbiAgICBcImJsdWVfc3RyaXBlc19jb21tYW5kb1wiLFxyXG4gICAgXCJzaWdpc211bnRfZGlqa3N0cmFcIixcclxuICAgIFwicHJpbmNlX3N0ZW5uaXNcIixcclxuICAgIFwic2llZ2ZyaWVkX29mX2RlbmVzbGVcIixcclxuICAgIFwidmVzXCIsXHJcbiAgICBcInZlcm5vbl9yb2NoZVwiLFxyXG4gICAgXCJqb2huX25hdGFsaXNcIixcclxuICAgIFwic2hlbGRvbl9za2FnZ3NcIixcclxuICAgIFwic2FicmluYV9nbGV2aXNzaWdcIixcclxuICAgIFwiY3JpbmZyaWRfcmVhdmVyc19kcmFnb25faHVudGVyXCIsXHJcbiAgICBcInNpbGVfZGVfdGFuc2FydmlsbGVcIixcclxuICAgIFwia2VpcmFfbWV0elwiLFxyXG4gICAgXCJkZXRobW9sZFwiLFxyXG4gICAgXCJrYWVkd2VuaV9zaWVnZV9leHBlcnRcIixcclxuICAgIFwiZHVuX2Jhbm5lcl9tZWRpY1wiLFxyXG4gICAgXCJiYWxsaXN0YVwiLFxyXG4gICAgXCJ0cmVidWNoZXRcIixcclxuICAgIFwidGhhbGVyXCIsXHJcbiAgICBcImZvbHRlc3Rfa2luZ19vZl90ZW1lcmlhXCIsXHJcbiAgICBcImRlY295XCIsXHJcbiAgICBcImltcGVuZXRyYWJsZV9mb2dcIlxyXG4gIF0sXHJcblxyXG4gIFwic2NvaWF0YWVsXCI6IFtcclxuICAgIFwiZnJhbmNlc2NhX2RhaXN5X29mX3RoZV92YWxsZXlcIixcclxuICAgIFwic2Flc2VudGhlc3Npc1wiLFxyXG4gICAgXCJpb3J2ZXRoXCIsXHJcbiAgICBcImlzZW5ncmltX2Zhb2lsdGlhcm5haFwiLFxyXG4gICAgXCJlaXRobmVcIixcclxuICAgIFwiaGF2ZWthcl9oZWFsZXJcIixcclxuICAgIFwicmlvcmRhaW5cIixcclxuICAgIFwidG9ydXZpZWxcIixcclxuICAgIFwiZGVjb3lcIixcclxuICAgIFwiZGVjb3lcIixcclxuICAgIFwiaW1wZW5ldHJhYmxlX2ZvZ1wiLFxyXG4gICAgXCJlbHZlbl9za2lybWlzaGVyXCIsXHJcbiAgICBcImVsdmVuX3NraXJtaXNoZXJcIixcclxuICAgIFwiZHdhcnZlbl9za2lybWlzaGVyXCIsXHJcbiAgICBcImR3YXJ2ZW5fc2tpcm1pc2hlclwiLFxyXG4gICAgXCJjaWFyYW5fYWVwX2Vhc25pbGxpZW5cIixcclxuICAgIFwidnJpaGVkZF9icmlnYWRlX3JlY3J1aXRcIixcclxuICAgIFwiZG9sX2JsYXRoYW5uYV9hcmNoZXJcIixcclxuICAgIFwiaGF2ZWthcl9zbXVnZ2xlclwiLFxyXG4gICAgXCJtYWhha2FtYW5fZGVmZW5kZXJcIixcclxuICAgIFwidnJpaGVkZF9icmlnYWRlX3ZldGVyYW5cIixcclxuICAgIFwiZGVubmlzX2NyYW5tZXJcIixcclxuICAgIFwiZmlsYXZhbmRyZWxfYWVuX2ZpZGhhaWxcIixcclxuICAgIFwiZmlsYXZhbmRyZWxfYWVuX2ZpZGhhaWxcIixcclxuICAgIFwiaWRhX2VtZWFuX2FlcF9zaXZuZXlcIixcclxuICAgIFwieWFldmlublwiLFxyXG4gICAgXCJiYXJjbGF5X2Vsc1wiLFxyXG4gICAgXCJkb2xfYmxhdGhhbm5hX3Njb3V0XCIsXHJcbiAgICBcIm1pbHZhXCJcclxuICBdLFxyXG5cclxuICBcIm1vbnN0ZXJcIjogW1xyXG4gICAgXCJlcmVkaW5fa2luZ19vZl90aGVfd2lsZF9odW50XCIsXHJcbiAgICBcImtheXJhblwiLFxyXG4gICAgXCJsZXNoZW5cIixcclxuICAgIFwiaW1sZXJpdGhcIixcclxuICAgIFwiZHJhdWdcIixcclxuICAgIFwiZ2hvdWxcIixcclxuICAgIFwiZGVjb3lcIixcclxuICAgIFwiZGVjb3lcIixcclxuICAgIFwibmVra2VyXCIsXHJcbiAgICBcIm5la2tlclwiLFxyXG4gICAgXCJ3eXZlcm5cIixcclxuICAgIFwiZm9nbGV0XCIsXHJcbiAgICBcImNlbGFlbm9faGFycHlcIixcclxuICAgIFwiZ2FyZ295bGVcIixcclxuICAgIFwiY29ja2F0cmljZVwiLFxyXG4gICAgXCJoYXJweVwiLFxyXG4gICAgXCJpbXBlbmV0cmFibGVfZm9nXCIsXHJcbiAgICBcImVuZHJlZ2FcIixcclxuICAgIFwidmFtcGlyZV9icnV4YVwiLFxyXG4gICAgXCJ2YW1waXJlX2JydXhhXCIsXHJcbiAgICBcInZhbXBpcmVfZmxlZGVyXCIsXHJcbiAgICBcInZhbXBpcmVfZmxlZGVyXCIsXHJcbiAgICBcInZhbXBpcmVfZ2Fya2FpblwiLFxyXG4gICAgXCJ2YW1waXJlX2dhcmthaW5cIixcclxuICAgIFwidmFtcGlyZV9la2ltbWFyYVwiLFxyXG4gICAgXCJ2YW1waXJlX2VraW1tYXJhXCIsXHJcbiAgICBcImFyYWNoYXNcIixcclxuICAgIFwiYm90Y2hsaW5nXCIsXHJcbiAgICBcImZvcmt0YWlsXCIsXHJcbiAgICBcInBsYWd1ZV9tYWlkZW5cIixcclxuICAgIFwiZ3JpZmZpblwiLFxyXG4gICAgXCJ3ZXJld29sZlwiLFxyXG4gICAgXCJmcmlnaHRlbmVyXCIsXHJcbiAgICBcImljZV9naWFudFwiLFxyXG4gICAgXCJncmF2ZV9oYWdcIixcclxuICAgIC8vXCJ2YW1waXJlX2thdGFrYW5cIixcclxuICAgIFwiY3JvbmVfd2hpc3Blc3NcIixcclxuICAgIFwiY3JvbmVfYnJld2Vzc1wiLFxyXG4gICAgXCJjcm9uZV9icmV3ZXNzXCIsXHJcbiAgICBcImNyb25lX3doaXNwZXNzXCIsXHJcbiAgICBcImNyb25lX3dlYXZlc3NcIixcclxuICAgIFwiY3JvbmVfd2VhdmVzc1wiLFxyXG4gICAgXCJhcmFjaGFzX2JlaGVtb3RoXCIsXHJcbiAgICBcImZpcmVfZWxlbWVudGFsXCIsXHJcbiAgICBcImZpZW5kXCIsXHJcbiAgICBcImVhcnRoX2VsZW1lbnRhbFwiXHJcbiAgXVxyXG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmFuZG9tRnJvbVNlZWQgPSByZXF1aXJlKCcuL3JhbmRvbS9yYW5kb20tZnJvbS1zZWVkJyk7XG5cbnZhciBPUklHSU5BTCA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl8tJztcbnZhciBhbHBoYWJldDtcbnZhciBwcmV2aW91c1NlZWQ7XG5cbnZhciBzaHVmZmxlZDtcblxuZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgc2h1ZmZsZWQgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hhcmFjdGVycyhfYWxwaGFiZXRfKSB7XG4gICAgaWYgKCFfYWxwaGFiZXRfKSB7XG4gICAgICAgIGlmIChhbHBoYWJldCAhPT0gT1JJR0lOQUwpIHtcbiAgICAgICAgICAgIGFscGhhYmV0ID0gT1JJR0lOQUw7XG4gICAgICAgICAgICByZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoX2FscGhhYmV0XyA9PT0gYWxwaGFiZXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChfYWxwaGFiZXRfLmxlbmd0aCAhPT0gT1JJR0lOQUwubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3VzdG9tIGFscGhhYmV0IGZvciBzaG9ydGlkIG11c3QgYmUgJyArIE9SSUdJTkFMLmxlbmd0aCArICcgdW5pcXVlIGNoYXJhY3RlcnMuIFlvdSBzdWJtaXR0ZWQgJyArIF9hbHBoYWJldF8ubGVuZ3RoICsgJyBjaGFyYWN0ZXJzOiAnICsgX2FscGhhYmV0Xyk7XG4gICAgfVxuXG4gICAgdmFyIHVuaXF1ZSA9IF9hbHBoYWJldF8uc3BsaXQoJycpLmZpbHRlcihmdW5jdGlvbihpdGVtLCBpbmQsIGFycil7XG4gICAgICAgcmV0dXJuIGluZCAhPT0gYXJyLmxhc3RJbmRleE9mKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHVuaXF1ZS5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXN0b20gYWxwaGFiZXQgZm9yIHNob3J0aWQgbXVzdCBiZSAnICsgT1JJR0lOQUwubGVuZ3RoICsgJyB1bmlxdWUgY2hhcmFjdGVycy4gVGhlc2UgY2hhcmFjdGVycyB3ZXJlIG5vdCB1bmlxdWU6ICcgKyB1bmlxdWUuam9pbignLCAnKSk7XG4gICAgfVxuXG4gICAgYWxwaGFiZXQgPSBfYWxwaGFiZXRfO1xuICAgIHJlc2V0KCk7XG59XG5cbmZ1bmN0aW9uIGNoYXJhY3RlcnMoX2FscGhhYmV0Xykge1xuICAgIHNldENoYXJhY3RlcnMoX2FscGhhYmV0Xyk7XG4gICAgcmV0dXJuIGFscGhhYmV0O1xufVxuXG5mdW5jdGlvbiBzZXRTZWVkKHNlZWQpIHtcbiAgICByYW5kb21Gcm9tU2VlZC5zZWVkKHNlZWQpO1xuICAgIGlmIChwcmV2aW91c1NlZWQgIT09IHNlZWQpIHtcbiAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgcHJldmlvdXNTZWVkID0gc2VlZDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNodWZmbGUoKSB7XG4gICAgaWYgKCFhbHBoYWJldCkge1xuICAgICAgICBzZXRDaGFyYWN0ZXJzKE9SSUdJTkFMKTtcbiAgICB9XG5cbiAgICB2YXIgc291cmNlQXJyYXkgPSBhbHBoYWJldC5zcGxpdCgnJyk7XG4gICAgdmFyIHRhcmdldEFycmF5ID0gW107XG4gICAgdmFyIHIgPSByYW5kb21Gcm9tU2VlZC5uZXh0VmFsdWUoKTtcbiAgICB2YXIgY2hhcmFjdGVySW5kZXg7XG5cbiAgICB3aGlsZSAoc291cmNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICByID0gcmFuZG9tRnJvbVNlZWQubmV4dFZhbHVlKCk7XG4gICAgICAgIGNoYXJhY3RlckluZGV4ID0gTWF0aC5mbG9vcihyICogc291cmNlQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgdGFyZ2V0QXJyYXkucHVzaChzb3VyY2VBcnJheS5zcGxpY2UoY2hhcmFjdGVySW5kZXgsIDEpWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldEFycmF5LmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBnZXRTaHVmZmxlZCgpIHtcbiAgICBpZiAoc2h1ZmZsZWQpIHtcbiAgICAgICAgcmV0dXJuIHNodWZmbGVkO1xuICAgIH1cbiAgICBzaHVmZmxlZCA9IHNodWZmbGUoKTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG59XG5cbi8qKlxuICogbG9va3VwIHNodWZmbGVkIGxldHRlclxuICogQHBhcmFtIGluZGV4XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBsb29rdXAoaW5kZXgpIHtcbiAgICB2YXIgYWxwaGFiZXRTaHVmZmxlZCA9IGdldFNodWZmbGVkKCk7XG4gICAgcmV0dXJuIGFscGhhYmV0U2h1ZmZsZWRbaW5kZXhdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjaGFyYWN0ZXJzOiBjaGFyYWN0ZXJzLFxuICAgIHNlZWQ6IHNldFNlZWQsXG4gICAgbG9va3VwOiBsb29rdXAsXG4gICAgc2h1ZmZsZWQ6IGdldFNodWZmbGVkXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFscGhhYmV0ID0gcmVxdWlyZSgnLi9hbHBoYWJldCcpO1xuXG4vKipcbiAqIERlY29kZSB0aGUgaWQgdG8gZ2V0IHRoZSB2ZXJzaW9uIGFuZCB3b3JrZXJcbiAqIE1haW5seSBmb3IgZGVidWdnaW5nIGFuZCB0ZXN0aW5nLlxuICogQHBhcmFtIGlkIC0gdGhlIHNob3J0aWQtZ2VuZXJhdGVkIGlkLlxuICovXG5mdW5jdGlvbiBkZWNvZGUoaWQpIHtcbiAgICB2YXIgY2hhcmFjdGVycyA9IGFscGhhYmV0LnNodWZmbGVkKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmVyc2lvbjogY2hhcmFjdGVycy5pbmRleE9mKGlkLnN1YnN0cigwLCAxKSkgJiAweDBmLFxuICAgICAgICB3b3JrZXI6IGNoYXJhY3RlcnMuaW5kZXhPZihpZC5zdWJzdHIoMSwgMSkpICYgMHgwZlxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVjb2RlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmFuZG9tQnl0ZSA9IHJlcXVpcmUoJy4vcmFuZG9tL3JhbmRvbS1ieXRlJyk7XG5cbmZ1bmN0aW9uIGVuY29kZShsb29rdXAsIG51bWJlcikge1xuICAgIHZhciBsb29wQ291bnRlciA9IDA7XG4gICAgdmFyIGRvbmU7XG5cbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgICAgc3RyID0gc3RyICsgbG9va3VwKCAoIChudW1iZXIgPj4gKDQgKiBsb29wQ291bnRlcikpICYgMHgwZiApIHwgcmFuZG9tQnl0ZSgpICk7XG4gICAgICAgIGRvbmUgPSBudW1iZXIgPCAoTWF0aC5wb3coMTYsIGxvb3BDb3VudGVyICsgMSApICk7XG4gICAgICAgIGxvb3BDb3VudGVyKys7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW5jb2RlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYWxwaGFiZXQgPSByZXF1aXJlKCcuL2FscGhhYmV0Jyk7XG52YXIgZW5jb2RlID0gcmVxdWlyZSgnLi9lbmNvZGUnKTtcbnZhciBkZWNvZGUgPSByZXF1aXJlKCcuL2RlY29kZScpO1xudmFyIGlzVmFsaWQgPSByZXF1aXJlKCcuL2lzLXZhbGlkJyk7XG5cbi8vIElnbm9yZSBhbGwgbWlsbGlzZWNvbmRzIGJlZm9yZSBhIGNlcnRhaW4gdGltZSB0byByZWR1Y2UgdGhlIHNpemUgb2YgdGhlIGRhdGUgZW50cm9weSB3aXRob3V0IHNhY3JpZmljaW5nIHVuaXF1ZW5lc3MuXG4vLyBUaGlzIG51bWJlciBzaG91bGQgYmUgdXBkYXRlZCBldmVyeSB5ZWFyIG9yIHNvIHRvIGtlZXAgdGhlIGdlbmVyYXRlZCBpZCBzaG9ydC5cbi8vIFRvIHJlZ2VuZXJhdGUgYG5ldyBEYXRlKCkgLSAwYCBhbmQgYnVtcCB0aGUgdmVyc2lvbi4gQWx3YXlzIGJ1bXAgdGhlIHZlcnNpb24hXG52YXIgUkVEVUNFX1RJTUUgPSAxNDI2NDUyNDE0MDkzO1xuXG4vLyBkb24ndCBjaGFuZ2UgdW5sZXNzIHdlIGNoYW5nZSB0aGUgYWxnb3Mgb3IgUkVEVUNFX1RJTUVcbi8vIG11c3QgYmUgYW4gaW50ZWdlciBhbmQgbGVzcyB0aGFuIDE2XG52YXIgdmVyc2lvbiA9IDU7XG5cbi8vIGlmIHlvdSBhcmUgdXNpbmcgY2x1c3RlciBvciBtdWx0aXBsZSBzZXJ2ZXJzIHVzZSB0aGlzIHRvIG1ha2UgZWFjaCBpbnN0YW5jZVxuLy8gaGFzIGEgdW5pcXVlIHZhbHVlIGZvciB3b3JrZXJcbi8vIE5vdGU6IEkgZG9uJ3Qga25vdyBpZiB0aGlzIGlzIGF1dG9tYXRpY2FsbHkgc2V0IHdoZW4gdXNpbmcgdGhpcmRcbi8vIHBhcnR5IGNsdXN0ZXIgc29sdXRpb25zIHN1Y2ggYXMgcG0yLlxudmFyIGNsdXN0ZXJXb3JrZXJJZCA9IHJlcXVpcmUoJy4vdXRpbC9jbHVzdGVyLXdvcmtlci1pZCcpIHx8IDA7XG5cbi8vIENvdW50ZXIgaXMgdXNlZCB3aGVuIHNob3J0aWQgaXMgY2FsbGVkIG11bHRpcGxlIHRpbWVzIGluIG9uZSBzZWNvbmQuXG52YXIgY291bnRlcjtcblxuLy8gUmVtZW1iZXIgdGhlIGxhc3QgdGltZSBzaG9ydGlkIHdhcyBjYWxsZWQgaW4gY2FzZSBjb3VudGVyIGlzIG5lZWRlZC5cbnZhciBwcmV2aW91c1NlY29uZHM7XG5cbi8qKlxuICogR2VuZXJhdGUgdW5pcXVlIGlkXG4gKiBSZXR1cm5zIHN0cmluZyBpZFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZSgpIHtcblxuICAgIHZhciBzdHIgPSAnJztcblxuICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIFJFRFVDRV9USU1FKSAqIDAuMDAxKTtcblxuICAgIGlmIChzZWNvbmRzID09PSBwcmV2aW91c1NlY29uZHMpIHtcbiAgICAgICAgY291bnRlcisrO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICBwcmV2aW91c1NlY29uZHMgPSBzZWNvbmRzO1xuICAgIH1cblxuICAgIHN0ciA9IHN0ciArIGVuY29kZShhbHBoYWJldC5sb29rdXAsIHZlcnNpb24pO1xuICAgIHN0ciA9IHN0ciArIGVuY29kZShhbHBoYWJldC5sb29rdXAsIGNsdXN0ZXJXb3JrZXJJZCk7XG4gICAgaWYgKGNvdW50ZXIgPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ciArIGVuY29kZShhbHBoYWJldC5sb29rdXAsIGNvdW50ZXIpO1xuICAgIH1cbiAgICBzdHIgPSBzdHIgKyBlbmNvZGUoYWxwaGFiZXQubG9va3VwLCBzZWNvbmRzKTtcblxuICAgIHJldHVybiBzdHI7XG59XG5cblxuLyoqXG4gKiBTZXQgdGhlIHNlZWQuXG4gKiBIaWdobHkgcmVjb21tZW5kZWQgaWYgeW91IGRvbid0IHdhbnQgcGVvcGxlIHRvIHRyeSB0byBmaWd1cmUgb3V0IHlvdXIgaWQgc2NoZW1hLlxuICogZXhwb3NlZCBhcyBzaG9ydGlkLnNlZWQoaW50KVxuICogQHBhcmFtIHNlZWQgSW50ZWdlciB2YWx1ZSB0byBzZWVkIHRoZSByYW5kb20gYWxwaGFiZXQuICBBTFdBWVMgVVNFIFRIRSBTQU1FIFNFRUQgb3IgeW91IG1pZ2h0IGdldCBvdmVybGFwcy5cbiAqL1xuZnVuY3Rpb24gc2VlZChzZWVkVmFsdWUpIHtcbiAgICBhbHBoYWJldC5zZWVkKHNlZWRWYWx1ZSk7XG4gICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vKipcbiAqIFNldCB0aGUgY2x1c3RlciB3b3JrZXIgb3IgbWFjaGluZSBpZFxuICogZXhwb3NlZCBhcyBzaG9ydGlkLndvcmtlcihpbnQpXG4gKiBAcGFyYW0gd29ya2VySWQgd29ya2VyIG11c3QgYmUgcG9zaXRpdmUgaW50ZWdlci4gIE51bWJlciBsZXNzIHRoYW4gMTYgaXMgcmVjb21tZW5kZWQuXG4gKiByZXR1cm5zIHNob3J0aWQgbW9kdWxlIHNvIGl0IGNhbiBiZSBjaGFpbmVkLlxuICovXG5mdW5jdGlvbiB3b3JrZXIod29ya2VySWQpIHtcbiAgICBjbHVzdGVyV29ya2VySWQgPSB3b3JrZXJJZDtcbiAgICByZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8qKlxuICpcbiAqIHNldHMgbmV3IGNoYXJhY3RlcnMgdG8gdXNlIGluIHRoZSBhbHBoYWJldFxuICogcmV0dXJucyB0aGUgc2h1ZmZsZWQgYWxwaGFiZXRcbiAqL1xuZnVuY3Rpb24gY2hhcmFjdGVycyhuZXdDaGFyYWN0ZXJzKSB7XG4gICAgaWYgKG5ld0NoYXJhY3RlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhbHBoYWJldC5jaGFyYWN0ZXJzKG5ld0NoYXJhY3RlcnMpO1xuICAgIH1cblxuICAgIHJldHVybiBhbHBoYWJldC5zaHVmZmxlZCgpO1xufVxuXG5cbi8vIEV4cG9ydCBhbGwgb3RoZXIgZnVuY3Rpb25zIGFzIHByb3BlcnRpZXMgb2YgdGhlIGdlbmVyYXRlIGZ1bmN0aW9uXG5tb2R1bGUuZXhwb3J0cyA9IGdlbmVyYXRlO1xubW9kdWxlLmV4cG9ydHMuZ2VuZXJhdGUgPSBnZW5lcmF0ZTtcbm1vZHVsZS5leHBvcnRzLnNlZWQgPSBzZWVkO1xubW9kdWxlLmV4cG9ydHMud29ya2VyID0gd29ya2VyO1xubW9kdWxlLmV4cG9ydHMuY2hhcmFjdGVycyA9IGNoYXJhY3RlcnM7XG5tb2R1bGUuZXhwb3J0cy5kZWNvZGUgPSBkZWNvZGU7XG5tb2R1bGUuZXhwb3J0cy5pc1ZhbGlkID0gaXNWYWxpZDtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhbHBoYWJldCA9IHJlcXVpcmUoJy4vYWxwaGFiZXQnKTtcblxuZnVuY3Rpb24gaXNTaG9ydElkKGlkKSB7XG4gICAgaWYgKCFpZCB8fCB0eXBlb2YgaWQgIT09ICdzdHJpbmcnIHx8IGlkLmxlbmd0aCA8IDYgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgY2hhcmFjdGVycyA9IGFscGhhYmV0LmNoYXJhY3RlcnMoKTtcbiAgICB2YXIgaW52YWxpZENoYXJhY3RlcnMgPSBpZC5zcGxpdCgnJykubWFwKGZ1bmN0aW9uKGNoYXIpe1xuICAgICAgICBpZiAoY2hhcmFjdGVycy5pbmRleE9mKGNoYXIpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGNoYXI7XG4gICAgICAgIH1cbiAgICB9KS5qb2luKCcnKS5zcGxpdCgnJykuam9pbignJyk7XG5cbiAgICByZXR1cm4gaW52YWxpZENoYXJhY3RlcnMubGVuZ3RoID09PSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU2hvcnRJZDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyeXB0byA9IHdpbmRvdy5jcnlwdG8gfHwgd2luZG93Lm1zQ3J5cHRvOyAvLyBJRSAxMSB1c2VzIHdpbmRvdy5tc0NyeXB0b1xuXG5mdW5jdGlvbiByYW5kb21CeXRlKCkge1xuICAgIGlmICghY3J5cHRvIHx8ICFjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpICYgMHgzMDtcbiAgICB9XG4gICAgdmFyIGRlc3QgPSBuZXcgVWludDhBcnJheSgxKTtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGRlc3QpO1xuICAgIHJldHVybiBkZXN0WzBdICYgMHgzMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByYW5kb21CeXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBGb3VuZCB0aGlzIHNlZWQtYmFzZWQgcmFuZG9tIGdlbmVyYXRvciBzb21ld2hlcmVcbi8vIEJhc2VkIG9uIFRoZSBDZW50cmFsIFJhbmRvbWl6ZXIgMS4zIChDKSAxOTk3IGJ5IFBhdWwgSG91bGUgKGhvdWxlQG1zYy5jb3JuZWxsLmVkdSlcblxudmFyIHNlZWQgPSAxO1xuXG4vKipcbiAqIHJldHVybiBhIHJhbmRvbSBudW1iZXIgYmFzZWQgb24gYSBzZWVkXG4gKiBAcGFyYW0gc2VlZFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0TmV4dFZhbHVlKCkge1xuICAgIHNlZWQgPSAoc2VlZCAqIDkzMDEgKyA0OTI5NykgJSAyMzMyODA7XG4gICAgcmV0dXJuIHNlZWQvKDIzMzI4MC4wKTtcbn1cblxuZnVuY3Rpb24gc2V0U2VlZChfc2VlZF8pIHtcbiAgICBzZWVkID0gX3NlZWRfO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBuZXh0VmFsdWU6IGdldE5leHRWYWx1ZSxcbiAgICBzZWVkOiBzZXRTZWVkXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IDA7XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kLFxuICAgIG5hdGl2ZUNyZWF0ZSAgICAgICA9IE9iamVjdC5jcmVhdGU7XG5cbiAgLy8gTmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOC4zJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIG90aGVyKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBIG1vc3RseS1pbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZFxuICAvLyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXJcbiAgLy8gaWRlbnRpdHksIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICB2YXIgY2IgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBjYih2YWx1ZSwgY29udGV4dCwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCB1bmRlZmluZWRPbmx5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICAgIGwgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoIXVuZGVmaW5lZE9ubHkgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIHZhciBiYXNlQ3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBwcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgLy8gQXZvaWRzIGEgdmVyeSBuYXN0eSBpT1MgOCBKSVQgYnVnIG9uIEFSTS02NC4gIzIwOTRcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBnZXRMZW5ndGggPSBwcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gIH07XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIHJlZHVjaW5nIGZ1bmN0aW9uIGl0ZXJhdGluZyBsZWZ0IG9yIHJpZ2h0LlxuICBmdW5jdGlvbiBjcmVhdGVSZWR1Y2UoZGlyKSB7XG4gICAgLy8gT3B0aW1pemVkIGl0ZXJhdG9yIGZ1bmN0aW9uIGFzIHVzaW5nIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAvLyBpbiB0aGUgbWFpbiBmdW5jdGlvbiB3aWxsIGRlb3B0aW1pemUgdGhlLCBzZWUgIzE5OTEuXG4gICAgZnVuY3Rpb24gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCkge1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICAgIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBpbml0aWFsIHZhbHVlIGlmIG5vbmUgaXMgcHJvdmlkZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgbWVtbyA9IG9ialtrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGRpcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXk7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGtleSA9IF8uZmluZEluZGV4KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0gXy5maW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwICYmIGtleSAhPT0gLTEpIHJldHVybiBvYmpba2V5XTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBmdW5jID0gaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXTtcbiAgICAgIHJldHVybiBmdW5jID09IG51bGwgPyBmdW5jIDogZnVuYy5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNldCA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBzZXQubGVuZ3RoO1xuICAgIHZhciBzaHVmZmxlZCA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCByYW5kOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKDAsIGluZGV4KTtcbiAgICAgIGlmIChyYW5kICE9PSBpbmRleCkgc2h1ZmZsZWRbaW5kZXhdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHNldFtpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRlZS5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICAgIChwcmVkaWNhdGUodmFsdWUsIGtleSwgb2JqKSA/IHBhc3MgOiBmYWlsKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgcmV0dXJuIF8uaW5pdGlhbChhcnJheSwgYXJyYXkubGVuZ3RoIC0gbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIF8ucmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBzdGFydEluZGV4KSB7XG4gICAgdmFyIG91dHB1dCA9IFtdLCBpZHggPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldLFxuICAgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG4gICAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgICAgaWYgKCFpIHx8IHNlZW4gIT09IGNvbXB1dGVkKSByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHNlZW4gPSBjb21wdXRlZDtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfLmNvbnRhaW5zKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuemlwKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ29tcGxlbWVudCBvZiBfLnppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXNcbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCBnZXRMZW5ndGgpLmxlbmd0aCB8fCAwO1xuICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IF8ucGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGZpbmRJbmRleCBhbmQgZmluZExhc3RJbmRleCBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoMSk7XG4gIF8uZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBpbmRleE9mIGFuZCBsYXN0SW5kZXhPZiBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlSW5kZXhGaW5kZXIoZGlyLCBwcmVkaWNhdGVGaW5kLCBzb3J0ZWRJbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgaXRlbSwgaWR4KSB7XG4gICAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICBpZiAodHlwZW9mIGlkeCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgaSA9IGlkeCA+PSAwID8gaWR4IDogTWF0aC5tYXgoaWR4ICsgbGVuZ3RoLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIF8uaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigxLCBfLmZpbmRJbmRleCwgXy5zb3J0ZWRJbmRleCk7XG4gIF8ubGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgXy5maW5kTGFzdEluZGV4KTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChzdG9wID09IG51bGwpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSBvYmplY3QuXG4gIC8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gIC8vIGNyZWF0ZWQgb2JqZWN0LlxuICBfLmNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIGlmIChwcm9wcykgXy5leHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIC8vIEl0J3MgZG9uZSBoZXJlIHNpbmNlIHdlIG9ubHkgbmVlZCB0aGVtIGZvciBvYmplY3RzIGFuZCBhcnJheXMgY29tcGFyaXNvbi5cbiAgICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gICAgYlN0YWNrID0gYlN0YWNrIHx8IFtdO1xuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoYXJlQXJyYXlzKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFlcShhW2xlbmd0aF0sIGJbbGVuZ3RoXSwgYVN0YWNrLCBiU3RhY2spKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgdmFyIGtleXMgPSBfLmtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgaWYgKF8ua2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBrZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSAmJiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopIHx8IF8uaXNBcmd1bWVudHMob2JqKSkpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBfLmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAsIGlzRXJyb3IuXG4gIF8uZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJywgJ0Vycm9yJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSA8IDkpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgLy8gSUUgMTEgKCMxNjIxKSwgYW5kIGluIFNhZmFyaSA4ICgjMTkyOSkuXG4gIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT09ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIF8ucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mXG4gIC8vIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXIgPSBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIGF0dHJzID0gXy5leHRlbmRPd24oe30sIGF0dHJzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5pc01hdGNoKG9iaiwgYXR0cnMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZFxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIF8ua2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9O1xuICBfLmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcbiAgXy51bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIGZhbGxiYWNrKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB2b2lkIDAgOiBvYmplY3RbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICB2YWx1ZSA9IGZhbGxiYWNrO1xuICAgIH1cbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVyLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZlc3QuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIF8ucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3h5IGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfLnByb3RvdHlwZS52YWx1ZU9mID0gXy5wcm90b3R5cGUudG9KU09OID0gXy5wcm90b3R5cGUudmFsdWU7XG5cbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsInZhciBCYXR0bGVzaWRlID0gcmVxdWlyZShcIi4vQmF0dGxlc2lkZVwiKTtcclxudmFyIENhcmQgPSByZXF1aXJlKFwiLi9DYXJkXCIpO1xyXG52YXIgc2hvcnRpZCA9IHJlcXVpcmUoXCJzaG9ydGlkXCIpO1xyXG5cclxuXHJcbnZhciBCYXR0bGUgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgQmF0dGxlID0gZnVuY3Rpb24oaWQsIHAxLCBwMiwgc29ja2V0KXtcclxuICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mIEJhdHRsZSkpe1xyXG4gICAgICByZXR1cm4gKG5ldyBCYXR0bGUoaWQsIHAxLCBwMiwgc29ja2V0KSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yIGhlcmVcclxuICAgICAqL1xyXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcclxuICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB0aGlzLl91c2VyMSA9IHAxO1xyXG4gICAgdGhpcy5fdXNlcjIgPSBwMjtcclxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xyXG4gICAgdGhpcy5jaGFubmVsID0ge307XHJcbiAgfTtcclxuICB2YXIgciA9IEJhdHRsZS5wcm90b3R5cGU7XHJcbiAgLyoqXHJcbiAgICogbWV0aG9kcyAmJiBwcm9wZXJ0aWVzIGhlcmVcclxuICAgKiByLnByb3BlcnR5ID0gbnVsbDtcclxuICAgKiByLmdldFByb3BlcnR5ID0gZnVuY3Rpb24oKSB7Li4ufVxyXG4gICAqL1xyXG5cclxuICByLnAxID0gbnVsbDtcclxuICByLnAyID0gbnVsbDtcclxuICByLl91c2VyMSA9IG51bGw7XHJcbiAgci5fdXNlcjIgPSBudWxsO1xyXG4gIHIudHVybiA9IDA7XHJcblxyXG4gIHIuc29ja2V0ID0gbnVsbDtcclxuICByLmNoYW5uZWwgPSBudWxsO1xyXG5cclxuICByLl9pZCA9IG51bGw7XHJcblxyXG4gIHIuZXZlbnRzID0gbnVsbDtcclxuXHJcbiAgci5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIC8qUHViU3ViLnN1YnNjcmliZShcInVwZGF0ZVwiLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTsqL1xyXG4gICAgdGhpcy5vbihcIlVwZGF0ZVwiLCB0aGlzLnVwZGF0ZSk7XHJcbiAgICAvKlxyXG4gICAgICAgIHRoaXMub24oXCJBZnRlclBsYWNlXCIsIHRoaXMuY2hlY2tBYmlsaXR5T25BZnRlclBsYWNlKSovXHJcblxyXG5cclxuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuc29ja2V0LnN1YnNjcmliZSh0aGlzLl9pZCk7XHJcbiAgICB0aGlzLnAxID0gQmF0dGxlc2lkZSh0aGlzLl91c2VyMS5nZXROYW1lKCksIDAsIHRoaXMsIHRoaXMuX3VzZXIxKTtcclxuICAgIHRoaXMucDIgPSBCYXR0bGVzaWRlKHRoaXMuX3VzZXIyLmdldE5hbWUoKSwgMSwgdGhpcywgdGhpcy5fdXNlcjIpO1xyXG4gICAgdGhpcy5wMS5mb2UgPSB0aGlzLnAyO1xyXG4gICAgdGhpcy5wMi5mb2UgPSB0aGlzLnAxO1xyXG4gICAgdGhpcy5wMS5zZXRVcFdlYXRoZXJGaWVsZFdpdGgodGhpcy5wMik7XHJcblxyXG5cclxuICAgIHRoaXMuc3RhcnQoKTtcclxuICB9XHJcblxyXG4gIHIuc3RhcnQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5wMS5zZXRMZWFkZXJjYXJkKCk7XHJcbiAgICB0aGlzLnAyLnNldExlYWRlcmNhcmQoKTtcclxuICAgIHRoaXMucDEuZHJhdyg1KTtcclxuICAgIHRoaXMucDIuZHJhdyg1KTtcclxuXHJcbiAgICB0aGlzLnAxLmhhbmQuYWRkKENhcmQoXCJrYWVkd2VuaV9zaWVnZV9leHBlcnRcIikpO1xyXG4gICAgdGhpcy5wMi5oYW5kLmFkZChDYXJkKFwia2FlZHdlbmlfc2llZ2VfZXhwZXJ0XCIpKTtcclxuICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImJhbGxpc3RhXCIpKTtcclxuICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImRlY295XCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImRlY295XCIpKTtcclxuICAgIC8qXHJcbiAgICB0aGlzLnAxLmhhbmQuYWRkKENhcmQoXCJkdW5fYmFubmVyX21lZGljXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImR1bl9iYW5uZXJfbWVkaWNcIikpO1xyXG4gICAgdGhpcy5wMS5oYW5kLmFkZChDYXJkKFwiaXNlbmdyaW1fZmFvaWx0aWFybmFoXCIpKTtcclxuICAgIHRoaXMucDIuaGFuZC5hZGQoQ2FyZChcImlzZW5ncmltX2Zhb2lsdGlhcm5haFwiKSk7Ki9cclxuXHJcbiAgICAvKnRoaXMucDEuYWRkVG9EaXNjYXJkKFtDYXJkKFwia2FlZHdlbmlfc2llZ2VfZXhwZXJ0XCIpXSk7XHJcbiAgICB0aGlzLnAyLmFkZFRvRGlzY2FyZChbQ2FyZChcImthZWR3ZW5pX3NpZWdlX2V4cGVydFwiKV0pOyovXHJcbiAgICAvKlxyXG4gICAgICAgIHRoaXMucDEuaGFuZC5hZGQoQ2FyZChcImRlY295XCIpKTtcclxuICAgICAgICB0aGlzLnAxLmhhbmQuYWRkKENhcmQoXCJpbXBlbmV0cmFibGVfZm9nXCIpKTtcclxuICAgICAgICB0aGlzLnAyLmhhbmQuYWRkKENhcmQoXCJkZWNveVwiKSk7XHJcbiAgICAgICAgdGhpcy5wMi5oYW5kLmFkZChDYXJkKFwiaW1wZW5ldHJhYmxlX2ZvZ1wiKSk7Ki9cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHJcbiAgICAvKlB1YlN1Yi5zdWJzY3JpYmUoXCJuZXh0VHVyblwiLCB0aGlzLnN3aXRjaFR1cm4uYmluZCh0aGlzKSk7Ki9cclxuICAgIHRoaXMub24oXCJOZXh0VHVyblwiLCB0aGlzLnN3aXRjaFR1cm4pO1xyXG5cclxuICAgIHRoaXMuc3dpdGNoVHVybihNYXRoLnJhbmRvbSgpID4gLjUgPyB0aGlzLnAxIDogdGhpcy5wMik7XHJcbiAgfVxyXG5cclxuICByLnN3aXRjaFR1cm4gPSBmdW5jdGlvbihzaWRlLCBfX2ZsYWcpe1xyXG4gICAgX19mbGFnID0gdHlwZW9mIF9fZmxhZyA9PSBcInVuZGVmaW5lZFwiID8gMCA6IDE7XHJcblxyXG5cclxuICAgIGlmKCEoc2lkZSBpbnN0YW5jZW9mIEJhdHRsZXNpZGUpKXtcclxuICAgICAgY29uc29sZS50cmFjZShcInNpZGUgaXMgbm90IGEgYmF0dGxlc2lkZSFcIik7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgaWYoc2lkZS5pc1Bhc3NpbmcoKSl7XHJcbiAgICAgIGlmKF9fZmxhZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnROZXh0Um91bmQoKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5zd2l0Y2hUdXJuKHNpZGUuZm9lLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJ1bkV2ZW50KFwiRWFjaFR1cm5cIik7XHJcbiAgICB0aGlzLnJ1bkV2ZW50KFwiVHVyblwiICsgc2lkZS5nZXRJRCgpKTtcclxuICAgIGNvbnNvbGUubG9nKFwiY3VycmVudCBUdXJuOiBcIiwgc2lkZS5nZXROYW1lKCkpO1xyXG5cclxuICB9XHJcblxyXG4gIHIuc3RhcnROZXh0Um91bmQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGxvc2VyID0gdGhpcy5jaGVja1J1YmllcygpO1xyXG4gICAgaWYodGhpcy5jaGVja0lmSXNPdmVyKCkpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIml0cyBvdmVyIVwiKTtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucDEucmVzZXROZXdSb3VuZCgpO1xyXG4gICAgdGhpcy5wMi5yZXNldE5ld1JvdW5kKCk7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJzdGFydCBuZXcgcm91bmQhXCIpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB0aGlzLnN3aXRjaFR1cm4obG9zZXIpO1xyXG4gIH1cclxuXHJcbiAgci51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5fdXBkYXRlKHRoaXMucDEpO1xyXG4gICAgdGhpcy5fdXBkYXRlKHRoaXMucDIpO1xyXG4gIH1cclxuXHJcbiAgci5fdXBkYXRlID0gZnVuY3Rpb24ocCl7XHJcbiAgICBwLnNlbmQoXCJ1cGRhdGU6aW5mb1wiLCB7XHJcbiAgICAgIGluZm86IHAuZ2V0SW5mbygpLFxyXG4gICAgICBsZWFkZXI6IHAuZmllbGRbQ2FyZC5UWVBFLkxFQURFUl0uZ2V0KClbMF1cclxuICAgIH0pXHJcbiAgICBwLnNlbmQoXCJ1cGRhdGU6aGFuZFwiLCB7XHJcbiAgICAgIGNhcmRzOiBKU09OLnN0cmluZ2lmeShwLmhhbmQuZ2V0Q2FyZHMoKSlcclxuICAgIH0pO1xyXG4gICAgcC5zZW5kKFwidXBkYXRlOmZpZWxkc1wiLCB7XHJcbiAgICAgIGNsb3NlOiBwLmZpZWxkW0NhcmQuVFlQRS5DTE9TRV9DT01CQVRdLFxyXG4gICAgICByYW5nZWQ6IHAuZmllbGRbQ2FyZC5UWVBFLlJBTkdFRF0sXHJcbiAgICAgIHNpZWdlOiBwLmZpZWxkW0NhcmQuVFlQRS5TSUVHRV0sXHJcbiAgICAgIHdlYXRoZXI6IHAuZmllbGRbQ2FyZC5UWVBFLldFQVRIRVJdXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgci5zZW5kID0gZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xyXG4gICAgdGhpcy5jaGFubmVsLnB1Ymxpc2goe1xyXG4gICAgICBldmVudDogZXZlbnQsXHJcbiAgICAgIGRhdGE6IGRhdGFcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgci5ydW5FdmVudCA9IGZ1bmN0aW9uKGV2ZW50aWQsIGN0eCwgYXJncywgdWlkKXtcclxuICAgIGN0eCA9IGN0eCB8fCB0aGlzO1xyXG4gICAgdWlkID0gdWlkIHx8IG51bGw7XHJcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcclxuICAgIHZhciBldmVudCA9IFwib25cIiArIGV2ZW50aWQ7XHJcblxyXG4gICAgaWYoIXRoaXMuZXZlbnRzW2V2ZW50XSl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZih1aWQpe1xyXG4gICAgICB2YXIgb2JqID0gdGhpcy5ldmVudHNbZXZlbnRdW3VpZF07XHJcbiAgICAgIG9iai5jYiA9IG9iai5jYi5iaW5kKGN0eClcclxuICAgICAgb2JqLmNiLmFwcGx5KGN0eCwgb2JqLm9uQXJncy5jb25jYXQoYXJncykpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGZvcih2YXIgX3VpZCBpbiB0aGlzLmV2ZW50c1tldmVudF0pIHtcclxuICAgICAgICB2YXIgb2JqID0gdGhpcy5ldmVudHNbZXZlbnRdW191aWRdO1xyXG4gICAgICAgIG9iai5jYiA9IG9iai5jYi5iaW5kKGN0eClcclxuICAgICAgICBvYmouY2IuYXBwbHkoY3R4LCBvYmoub25BcmdzLmNvbmNhdChhcmdzKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICByLm9uID0gZnVuY3Rpb24oZXZlbnRpZCwgY2IsIGN0eCwgYXJncyl7XHJcbiAgICBjdHggPSBjdHggfHwgbnVsbDtcclxuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xyXG4gICAgdmFyIGV2ZW50ID0gXCJvblwiICsgZXZlbnRpZDtcclxuICAgIHZhciB1aWRfZXZlbnQgPSBzaG9ydGlkLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgaWYoIWN0eCl7XHJcbiAgICAgIG9iai5jYiA9IGNiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG9iai5jYiA9IGNiLmJpbmQoY3R4KTtcclxuICAgIH1cclxuICAgIG9iai5vbkFyZ3MgPSBhcmdzO1xyXG5cclxuICAgIGlmKCEoZXZlbnQgaW4gdGhpcy5ldmVudHMpKXtcclxuICAgICAgLyp0aGlzLmV2ZW50c1tldmVudF0gPSBbXTsqL1xyXG4gICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0eXBlb2YgY2IgIT09IFwiZnVuY3Rpb25cIil7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImNiIG5vdCBhIGZ1bmN0aW9uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZXZlbnRzW2V2ZW50XVt1aWRfZXZlbnRdID0gb2JqO1xyXG5cclxuICAgIHJldHVybiB1aWRfZXZlbnQ7XHJcbiAgfVxyXG5cclxuICByLm9mZiA9IGZ1bmN0aW9uKGV2ZW50aWQsIHVpZCl7XHJcbiAgICB1aWQgPSB1aWQgfHwgbnVsbDtcclxuICAgIHZhciBldmVudCA9IFwib25cIiArIGV2ZW50aWQ7XHJcbiAgICBpZighdGhpcy5ldmVudHNbZXZlbnRdKSByZXR1cm47XHJcbiAgICBpZih1aWQpe1xyXG4gICAgICB0aGlzLmV2ZW50c1tldmVudF1bdWlkXSA9IG51bGw7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF1bdWlkXTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yKHZhciBfdWlkIGluIHRoaXMuZXZlbnRzW2V2ZW50XSl7XHJcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50XVtfdWlkXSA9IG51bGw7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF1bX3VpZF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByLmNoZWNrSWZJc092ZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuICEodGhpcy5wMS5nZXRSdWJpZXMoKSAmJiB0aGlzLnAyLmdldFJ1YmllcygpKTtcclxuICB9XHJcblxyXG4gIHIuY2hlY2tSdWJpZXMgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHNjb3JlUDEgPSB0aGlzLnAxLmdldFNjb3JlKCk7XHJcbiAgICB2YXIgc2NvcmVQMiA9IHRoaXMucDIuZ2V0U2NvcmUoKTtcclxuXHJcbiAgICBpZihzY29yZVAxID4gc2NvcmVQMil7XHJcbiAgICAgIHRoaXMucDIucmVtb3ZlUnVieSgpO1xyXG4gICAgICByZXR1cm4gdGhpcy5wMjtcclxuICAgIH1cclxuICAgIGlmKHNjb3JlUDIgPiBzY29yZVAxKXtcclxuICAgICAgdGhpcy5wMS5yZW1vdmVSdWJ5KCk7XHJcbiAgICAgIHJldHVybiB0aGlzLnAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vdGllXHJcbiAgICB0aGlzLnAxLnJlbW92ZVJ1YnkoKTtcclxuICAgIHRoaXMucDIucmVtb3ZlUnVieSgpO1xyXG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPiAwLjUgPyB0aGlzLnAxIDogdGhpcy5wMjtcclxuICB9XHJcblxyXG4gIHIudXNlckxlZnQgPSBmdW5jdGlvbihzaWRlTmFtZSl7XHJcbiAgICB2YXIgc2lkZSA9IHRoaXNbc2lkZU5hbWVdO1xyXG5cclxuICAgIHNpZGUuZm9lLnNlbmQoXCJmb2U6bGVmdFwiLCBudWxsLCB0cnVlKTtcclxuXHJcbiAgfVxyXG5cclxuICByLnNodXREb3duID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2hhbm5lbCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gQmF0dGxlO1xyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXR0bGU7IiwidmFyIERlY2tEYXRhID0gcmVxdWlyZShcIi4uL2Fzc2V0cy9kYXRhL2RlY2tcIik7XHJcbnZhciBEZWNrID0gcmVxdWlyZShcIi4vRGVja1wiKTtcclxudmFyIEhhbmQgPSByZXF1aXJlKFwiLi9IYW5kXCIpO1xyXG52YXIgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmRcIik7XHJcbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkXCIpO1xyXG52YXIgXyA9IHJlcXVpcmUoXCJ1bmRlcnNjb3JlXCIpO1xyXG5cclxuXHJcbnZhciBCYXR0bGVzaWRlO1xyXG5CYXR0bGVzaWRlID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIEJhdHRsZXNpZGUgPSBmdW5jdGlvbihuYW1lLCBuLCBiYXR0bGUsIHVzZXIpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgQmF0dGxlc2lkZSkpe1xyXG4gICAgICByZXR1cm4gKG5ldyBCYXR0bGVzaWRlKG5hbWUsIG4sIGJhdHRsZSwgdXNlcikpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuXHJcbiAgICB2YXIgZGVjayA9IHVzZXIuZ2V0RGVjaygpO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5faXNXYWl0aW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuc29ja2V0ID0gdXNlci5zb2NrZXQ7XHJcbiAgICB0aGlzLmZpZWxkID0ge307XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5MRUFERVJdID0gRmllbGQoQ2FyZC5UWVBFLkxFQURFUik7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5DTE9TRV9DT01CQVRdID0gRmllbGQoQ2FyZC5UWVBFLkNMT1NFX0NPTUJBVCk7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5SQU5HRURdID0gRmllbGQoQ2FyZC5UWVBFLlJBTkdFRCk7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5TSUVHRV0gPSBGaWVsZChDYXJkLlRZUEUuU0lFR0UpO1xyXG4gICAgdGhpcy5uID0gbiA/IFwicDJcIiA6IFwicDFcIjtcclxuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5iYXR0bGUgPSBiYXR0bGU7XHJcbiAgICB0aGlzLmhhbmQgPSBIYW5kKCk7XHJcbiAgICB0aGlzLmRlY2sgPSBEZWNrKERlY2tEYXRhW2RlY2tdKTtcclxuICAgIHRoaXMuX2Rpc2NhcmQgPSBbXTtcclxuXHJcbiAgICB0aGlzLnJ1bkV2ZW50ID0gdGhpcy5iYXR0bGUucnVuRXZlbnQuYmluZCh0aGlzLmJhdHRsZSk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5iYXR0bGUub24uYmluZCh0aGlzLmJhdHRsZSk7XHJcbiAgICB0aGlzLm9mZiA9IHRoaXMuYmF0dGxlLm9mZi5iaW5kKHRoaXMuYmF0dGxlKTtcclxuXHJcblxyXG4gICAgdGhpcy5yZWNlaXZlKFwiYWN0aXZhdGU6bGVhZGVyXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKHNlbGYuX2lzV2FpdGluZykgcmV0dXJuO1xyXG4gICAgICBpZihzZWxmLmlzUGFzc2luZygpKSByZXR1cm47XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcImxlYWRlciBhY3RpdmF0ZWRcIik7XHJcblxyXG4gICAgICB2YXIgbGVhZGVyQ2FyZCA9IHNlbGYuZ2V0TGVhZGVyKCk7XHJcbiAgICAgIGlmKGxlYWRlckNhcmQuaXNEaXNhYmxlZCgpKSByZXR1cm47XHJcblxyXG5cclxuICAgICAgdmFyIGFiaWxpdHkgPSBsZWFkZXJDYXJkLmdldEFiaWxpdHkoKTtcclxuXHJcbiAgICAgIGFiaWxpdHkub25BY3RpdmF0ZS5hcHBseShzZWxmKTtcclxuICAgICAgbGVhZGVyQ2FyZC5zZXREaXNhYmxlZCh0cnVlKTtcclxuICAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJwbGF5OmNhcmRGcm9tSGFuZFwiLCBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgaWYoc2VsZi5faXNXYWl0aW5nKSByZXR1cm47XHJcbiAgICAgIGlmKHNlbGYuaXNQYXNzaW5nKCkpIHJldHVybjtcclxuICAgICAgdmFyIGNhcmRJRCA9IGRhdGEuaWQ7XHJcbiAgICAgIHZhciBjYXJkID0gc2VsZi5oYW5kLmdldENhcmQoY2FyZElEKTtcclxuXHJcbiAgICAgIHNlbGYucGxheUNhcmQoY2FyZCk7XHJcbiAgICB9KVxyXG4gICAgdGhpcy5yZWNlaXZlKFwiZGVjb3k6cmVwbGFjZVdpdGhcIiwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIGlmKHNlbGYuX2lzV2FpdGluZykgcmV0dXJuO1xyXG4gICAgICB2YXIgY2FyZCA9IHNlbGYuZmluZENhcmRPbkZpZWxkQnlJRChkYXRhLmNhcmRJRCk7XHJcbiAgICAgIGlmKGNhcmQgPT09IC0xKSB0aHJvdyBuZXcgRXJyb3IoXCJkZWNveTpyZXBsYWNlIHwgdW5rbm93biBjYXJkXCIpO1xyXG4gICAgICBzZWxmLnJ1bkV2ZW50KFwiRGVjb3k6cmVwbGFjZVdpdGhcIiwgc2VsZiwgW2NhcmRdKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJjYW5jZWw6ZGVjb3lcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgc2VsZi5vZmYoXCJEZWNveTpyZXBsYWNlV2l0aFwiKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJzZXQ6cGFzc2luZ1wiLCBmdW5jdGlvbigpe1xyXG4gICAgICBzZWxmLnNldFBhc3NpbmcodHJ1ZSk7XHJcbiAgICAgIHNlbGYudXBkYXRlKCk7XHJcbiAgICAgIHNlbGYucnVuRXZlbnQoXCJOZXh0VHVyblwiLCBudWxsLCBbc2VsZi5mb2VdKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJtZWRpYzpjaG9vc2VDYXJkRnJvbURpc2NhcmRcIiwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIGlmKCFkYXRhKXtcclxuICAgICAgICBzZWxmLnJ1bkV2ZW50KFwiTmV4dFR1cm5cIiwgbnVsbCwgW3NlbGYuZm9lXSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBjYXJkSUQgPSBkYXRhLmNhcmRJRDtcclxuICAgICAgdmFyIGNhcmQgPSBzZWxmLmdldENhcmRGcm9tRGlzY2FyZChjYXJkSUQpO1xyXG4gICAgICBpZihjYXJkID09PSAtMSkgdGhyb3cgbmV3IEVycm9yKFwibWVkaWM6Y2hvb3NlQ2FyZEZyb21EaXNjYXJkIHwgdW5rbm93biBjYXJkOiBcIiwgY2FyZCk7XHJcblxyXG4gICAgICBzZWxmLnJlbW92ZUZyb21EaXNjYXJkKGNhcmQpO1xyXG5cclxuICAgICAgc2VsZi5wbGF5Q2FyZChjYXJkKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJhZ2lsZTpmaWVsZFwiLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHZhciBmaWVsZFR5cGUgPSBkYXRhLmZpZWxkO1xyXG4gICAgICBzZWxmLnJ1bkV2ZW50KFwiYWdpbGU6c2V0RmllbGRcIiwgbnVsbCwgW2ZpZWxkVHlwZV0pO1xyXG4gICAgICBzZWxmLnJ1bkV2ZW50KFwiTmV4dFR1cm5cIiwgbnVsbCwgW3NlbGYuZm9lXSk7XHJcbiAgICB9KVxyXG4gICAgdGhpcy5yZWNlaXZlKFwiY2FuY2VsOmFnaWxlXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHNlbGYub2ZmKFwiYWdpbGU6c2V0RmllbGRcIik7XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICB0aGlzLm9uKFwiVHVyblwiICsgdGhpcy5nZXRJRCgpLCB0aGlzLm9uVHVyblN0YXJ0LCB0aGlzKTtcclxuICB9O1xyXG4gIHZhciByID0gQmF0dGxlc2lkZS5wcm90b3R5cGU7XHJcbiAgLyoqXHJcbiAgICogbWV0aG9kcyAmJiBwcm9wZXJ0aWVzIGhlcmVcclxuICAgKiByLnByb3BlcnR5ID0gbnVsbDtcclxuICAgKiByLmdldFByb3BlcnR5ID0gZnVuY3Rpb24oKSB7Li4ufVxyXG4gICAqL1xyXG4gIHIuX25hbWUgPSBudWxsO1xyXG4gIHIuX2Rpc2NhcmQgPSBudWxsO1xyXG5cclxuICByLl9ydWJpZXMgPSAyO1xyXG4gIHIuX3Njb3JlID0gMDtcclxuICByLl9pc1dhaXRpbmcgPSBudWxsO1xyXG4gIHIuX3Bhc3NpbmcgPSBudWxsO1xyXG5cclxuICByLmZpZWxkID0gbnVsbDtcclxuXHJcbiAgci5zb2NrZXQgPSBudWxsO1xyXG4gIHIubiA9IG51bGw7XHJcblxyXG4gIHIuZm9lID0gbnVsbDtcclxuICByLmhhbmQgPSBudWxsO1xyXG4gIHIuYmF0dGxlID0gbnVsbDtcclxuICByLmRlY2sgPSBudWxsO1xyXG5cclxuICByLmlzUGFzc2luZyA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcGFzc2luZztcclxuICB9XHJcblxyXG4gIHIuc2V0VXBXZWF0aGVyRmllbGRXaXRoID0gZnVuY3Rpb24ocDIpe1xyXG4gICAgdGhpcy5maWVsZFtDYXJkLlRZUEUuV0VBVEhFUl0gPSBwMi5maWVsZFtDYXJkLlRZUEUuV0VBVEhFUl0gPSBGaWVsZChDYXJkLlRZUEUuV0VBVEhFUik7XHJcbiAgfVxyXG5cclxuICByLmZpbmRDYXJkT25GaWVsZEJ5SUQgPSBmdW5jdGlvbihpZCl7XHJcbiAgICBmb3IodmFyIGtleSBpbiB0aGlzLmZpZWxkKSB7XHJcbiAgICAgIHZhciBmaWVsZCA9IHRoaXMuZmllbGRba2V5XTtcclxuICAgICAgdmFyIGNhcmQgPSBmaWVsZC5nZXRDYXJkKGlkKTtcclxuICAgICAgaWYoY2FyZCAhPT0gLTEpIHJldHVybiBjYXJkO1xyXG4gICAgfVxyXG4gICAgLypcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fZGlzY2FyZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIGMgPSB0aGlzLl9kaXNjYXJkW2ldO1xyXG4gICAgICAgICAgaWYoYy5nZXRJRCgpID09PSBpZCkgcmV0dXJuIGM7XHJcbiAgICAgICAgfSovXHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICByLmdldENhcmRGcm9tRGlzY2FyZCA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9kaXNjYXJkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gdGhpcy5fZGlzY2FyZFtpXTtcclxuICAgICAgaWYoYy5nZXRJRCgpID09PSBpZCkgcmV0dXJuIGM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICByLnNldFBhc3NpbmcgPSBmdW5jdGlvbihiKXtcclxuICAgIHRoaXMuX3Bhc3NpbmcgPSBiO1xyXG4gICAgdGhpcy5zZW5kKFwic2V0OnBhc3NpbmdcIiwge3Bhc3Npbmc6IHRoaXMuX3Bhc3Npbmd9LCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHIud2FpdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLl9pc1dhaXRpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5zZW5kKFwic2V0OndhaXRpbmdcIiwge3dhaXRpbmc6IHRoaXMuX2lzV2FpdGluZ30sIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgci50dXJuID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuX2lzV2FpdGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5zZW5kKFwic2V0OndhaXRpbmdcIiwge3dhaXRpbmc6IHRoaXMuX2lzV2FpdGluZ30sIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgci5zZXRMZWFkZXJjYXJkID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBsZWFkZXJDYXJkID0gdGhpcy5kZWNrLmZpbmQoXCJ0eXBlXCIsIENhcmQuVFlQRS5MRUFERVIpO1xyXG4gICAgdGhpcy5kZWNrLnJlbW92ZUZyb21EZWNrKGxlYWRlckNhcmRbMF0pO1xyXG4gICAgLypcclxuICAgICAgICB0aGlzLmdldFlvdXJzaWRlKCkuc2V0RmllbGQoXCJsZWFkZXJcIiwgbGVhZGVyQ2FyZFswXSk7Ki9cclxuICAgIHRoaXMuZmllbGRbQ2FyZC5UWVBFLkxFQURFUl0uYWRkKGxlYWRlckNhcmRbMF0pO1xyXG4gIH1cclxuXHJcbiAgci5nZXRMZWFkZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuZmllbGRbQ2FyZC5UWVBFLkxFQURFUl0uZ2V0KClbMF07XHJcbiAgfVxyXG5cclxuICByLmdldElEID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLm47XHJcbiAgfVxyXG5cclxuICByLmRyYXcgPSBmdW5jdGlvbih0aW1lcyl7XHJcbiAgICB3aGlsZSh0aW1lcy0tKSB7XHJcbiAgICAgIHZhciBjYXJkID0gdGhpcy5kZWNrLmRyYXcoKTtcclxuICAgICAgdGhpcy5oYW5kLmFkZChjYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyhcInVwZGF0ZTpoYW5kIGZpcmVkXCIpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICByLmNhbGNTY29yZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgc2NvcmUgPSAwO1xyXG4gICAgZm9yKHZhciBrZXkgaW4gdGhpcy5maWVsZCkge1xyXG4gICAgICBzY29yZSArPSArdGhpcy5maWVsZFtrZXldLmdldFNjb3JlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fc2NvcmUgPSBzY29yZTtcclxuICB9XHJcblxyXG4gIHIuZ2V0SW5mbyA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuYW1lOiB0aGlzLmdldE5hbWUoKSxcclxuICAgICAgbGl2ZXM6IHRoaXMuX3J1YmllcyxcclxuICAgICAgc2NvcmU6IHRoaXMuY2FsY1Njb3JlKCksXHJcbiAgICAgIGhhbmQ6IHRoaXMuaGFuZC5sZW5ndGgoKSxcclxuICAgICAgZGlzY2FyZDogdGhpcy5nZXREaXNjYXJkKHRydWUpLFxyXG4gICAgICBwYXNzaW5nOiB0aGlzLl9wYXNzaW5nXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByLmdldFJ1YmllcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcnViaWVzO1xyXG4gIH1cclxuXHJcbiAgci5nZXRTY29yZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gK3RoaXMuY2FsY1Njb3JlKCk7XHJcbiAgfVxyXG5cclxuICByLnJlbW92ZVJ1YnkgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5fcnViaWVzLS07XHJcbiAgfVxyXG5cclxuICByLmdldE5hbWUgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgfVxyXG5cclxuICByLnNlbmQgPSBmdW5jdGlvbihldmVudCwgbXNnLCBpc1ByaXZhdGUpe1xyXG4gICAgbXNnID0gbXNnIHx8IHt9O1xyXG4gICAgaXNQcml2YXRlID0gdHlwZW9mIGlzUHJpdmF0ZSA9PT0gXCJ1bmRlZmluZWRcIiA/IGZhbHNlIDogaXNQcml2YXRlO1xyXG4gICAgbXNnLl9yb29tU2lkZSA9IHRoaXMubjtcclxuXHJcbiAgICBpZihpc1ByaXZhdGUpe1xyXG4gICAgICByZXR1cm4gdGhpcy5zb2NrZXQuZW1pdChldmVudCwgbXNnKTtcclxuICAgIH1cclxuICAgIHRoaXMuYmF0dGxlLnNlbmQoZXZlbnQsIG1zZyk7XHJcbiAgfVxyXG5cclxuICByLnJlY2VpdmUgPSBmdW5jdGlvbihldmVudCwgY2Ipe1xyXG4gICAgdGhpcy5zb2NrZXQub24oZXZlbnQsIGNiKTtcclxuICB9XHJcblxyXG4gIHIudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuICAgIC8vUHViU3ViLnB1Ymxpc2goXCJ1cGRhdGVcIik7XHJcbiAgICB0aGlzLnJ1bkV2ZW50KFwiVXBkYXRlXCIpO1xyXG4gIH1cclxuXHJcbiAgci5vblR1cm5TdGFydCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmZvZS53YWl0KCk7XHJcbiAgICB0aGlzLnR1cm4oKTtcclxuXHJcbiAgICAvL3dhaXQgZm9yIGNhcmRwbGF5IGV2ZW50XHJcblxyXG5cclxuICB9O1xyXG5cclxuICByLnBsYXlDYXJkID0gZnVuY3Rpb24oY2FyZCl7XHJcbiAgICBpZihjYXJkID09PSBudWxsIHx8IGNhcmQgPT09IC0xKSByZXR1cm47XHJcblxyXG4gICAgaWYoIXRoaXMucGxhY2VDYXJkKGNhcmQpKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5oYW5kLnJlbW92ZShjYXJkKTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuXHJcbiAgICB0aGlzLnJ1bkV2ZW50KFwiTmV4dFR1cm5cIiwgbnVsbCwgW3RoaXMuZm9lXSk7XHJcbiAgfVxyXG5cclxuICByLnBsYWNlQ2FyZCA9IGZ1bmN0aW9uKGNhcmQsIG9iail7XHJcbiAgICBvYmogPSBfLmV4dGVuZCh7fSwgb2JqKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrQWJpbGl0aWVzKGNhcmQsIG9iaik7XHJcbiAgICBpZihvYmouX2NhbmNlbFBsYWNlbWVudCkgcmV0dXJuIDA7XHJcblxyXG4gICAgdmFyIGZpZWxkID0gb2JqLnRhcmdldFNpZGUuZmllbGRbY2FyZC5nZXRUeXBlKCldO1xyXG4gICAgZmllbGQuYWRkKGNhcmQpO1xyXG5cclxuXHJcbiAgICB0aGlzLnJ1bkV2ZW50KFwiRWFjaENhcmRQbGFjZVwiKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrQWJpbGl0eU9uQWZ0ZXJQbGFjZShjYXJkLCBvYmopO1xyXG4gICAgLypcclxuICAgICAgICB0aGlzLnJ1bkV2ZW50KFwiQWZ0ZXJQbGFjZVwiLCB0aGlzLCBbY2FyZCwgb2JqXSk7Ki9cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIGlmKG9iai5fd2FpdFJlc3BvbnNlKXtcclxuICAgICAgdGhpcy5oYW5kLnJlbW92ZShjYXJkKTtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICByLmNoZWNrQWJpbGl0aWVzID0gZnVuY3Rpb24oY2FyZCwgb2JqLCBfX2ZsYWcpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgb2JqLnRhcmdldFNpZGUgPSB0aGlzO1xyXG4gICAgaWYob2JqLmRpc2FibGVkKSByZXR1cm47XHJcbiAgICB2YXIgYWJpbGl0eSA9IEFycmF5LmlzQXJyYXkoX19mbGFnKSB8fCBjYXJkLmdldEFiaWxpdHkoKTtcclxuXHJcbiAgICBpZihBcnJheS5pc0FycmF5KGFiaWxpdHkpICYmIGFiaWxpdHkubGVuZ3RoKXtcclxuICAgICAgdmFyIHJldCA9IGFiaWxpdHkuc2xpY2UoKTtcclxuICAgICAgcmV0ID0gcmV0LnNwbGljZSgwLCAxKTtcclxuICAgICAgdGhpcy5jaGVja0FiaWxpdGllcyhjYXJkLCBvYmosIHJldCk7XHJcbiAgICAgIGFiaWxpdHkgPSBhYmlsaXR5WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGFiaWxpdHkgJiYgYWJpbGl0eS5uYW1lID09PSBvYmouc3VwcHJlc3Mpe1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGFiaWxpdHkgJiYgIUFycmF5LmlzQXJyYXkoYWJpbGl0eSkpe1xyXG4gICAgICBpZihhYmlsaXR5Lm9uQmVmb3JlUGxhY2UpIHtcclxuICAgICAgICBhYmlsaXR5Lm9uQmVmb3JlUGxhY2UuYXBwbHkodGhpcywgW2NhcmRdKTtcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5LmNhbmNlbFBsYWNlbWVudCkge1xyXG4gICAgICAgIG9iai5fY2FuY2VsUGxhY2VtZW50ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5LndhaXRSZXNwb25zZSl7XHJcbiAgICAgICAgb2JqLl93YWl0UmVzcG9uc2UgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGFiaWxpdHkuY2hhbmdlU2lkZSl7XHJcbiAgICAgICAgb2JqLnRhcmdldFNpZGUgPSB0aGlzLmZvZTtcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5Lm9uUmVzZXQpe1xyXG4gICAgICAgIHRoaXMub24oXCJSZXNldFwiLCBhYmlsaXR5Lm9uUmVzZXQsIHRoaXMsIFtjYXJkXSlcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5LnJlcGxhY2VXaXRoKXtcclxuICAgICAgICBvYmouX2NhbmNlbFBsYWNlbWVudCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vbihcIkRlY295OnJlcGxhY2VXaXRoXCIsIGZ1bmN0aW9uKHJlcGxhY2VDYXJkKXtcclxuICAgICAgICAgIGlmKHJlcGxhY2VDYXJkLmdldFR5cGUoKSA9PSBDYXJkLlRZUEUuTEVBREVSIHx8XHJcbiAgICAgICAgICByZXBsYWNlQ2FyZC5nZXRUeXBlKCkgPT0gQ2FyZC5UWVBFLldFQVRIRVIgfHxcclxuICAgICAgICAgIHJlcGxhY2VDYXJkLmdldFR5cGUoKSA9PSBDYXJkLlRZUEUuU1BFQ0lBTCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKHJlcGxhY2VDYXJkLmdldE5hbWUoKSA9PT0gY2FyZC5nZXROYW1lKCkpIHJldHVybjtcclxuICAgICAgICAgIHNlbGYub2ZmKFwiRGVjb3k6cmVwbGFjZVdpdGhcIik7XHJcbiAgICAgICAgICB2YXIgZmllbGQgPSBzZWxmLmZpZWxkW3JlcGxhY2VDYXJkLmdldFR5cGUoKV07XHJcblxyXG5cclxuICAgICAgICAgIGZpZWxkLnJlcGxhY2VXaXRoKHJlcGxhY2VDYXJkLCBjYXJkKTtcclxuICAgICAgICAgIHNlbGYucnVuRXZlbnQoXCJFYWNoQ2FyZFBsYWNlXCIpO1xyXG5cclxuICAgICAgICAgIHNlbGYuaGFuZC5hZGQocmVwbGFjZUNhcmQpO1xyXG4gICAgICAgICAgc2VsZi5oYW5kLnJlbW92ZShjYXJkKTtcclxuICAgICAgICAgIHNlbGYudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgc2VsZi5ydW5FdmVudChcIk5leHRUdXJuXCIsIG51bGwsIFtzZWxmLmZvZV0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgaWYoYWJpbGl0eS5vbkVhY2hUdXJuKXtcclxuICAgICAgICB2YXIgdWlkID0gdGhpcy5vbihcIkVhY2hUdXJuXCIsIGFiaWxpdHkub25FYWNoVHVybiwgdGhpcywgW2NhcmRdKVxyXG4gICAgICAgIGNhcmQuX3VpZEV2ZW50c1tcIkVhY2hUdXJuXCJdID0gdWlkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGFiaWxpdHkub25FYWNoQ2FyZFBsYWNlKXtcclxuICAgICAgICB2YXIgdWlkID0gdGhpcy5vbihcIkVhY2hDYXJkUGxhY2VcIiwgYWJpbGl0eS5vbkVhY2hDYXJkUGxhY2UsIHRoaXMsIFtjYXJkXSk7XHJcbiAgICAgICAgY2FyZC5fdWlkRXZlbnRzW1wiRWFjaENhcmRQbGFjZVwiXSA9IHVpZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIuY2hlY2tBYmlsaXR5T25BZnRlclBsYWNlID0gZnVuY3Rpb24oY2FyZCwgb2JqKXtcclxuICAgIHZhciBhYmlsaXR5ID0gY2FyZC5nZXRBYmlsaXR5KCk7XHJcbiAgICBpZihhYmlsaXR5KXtcclxuICAgICAgaWYoYWJpbGl0eS5uYW1lICYmIGFiaWxpdHkubmFtZSA9PT0gb2JqLnN1cHByZXNzKXtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5Lm9uQWZ0ZXJQbGFjZSl7XHJcbiAgICAgICAgYWJpbGl0eS5vbkFmdGVyUGxhY2UuY2FsbCh0aGlzLCBjYXJkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByLmNsZWFyTWFpbkZpZWxkcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgY2FyZHMxID0gdGhpcy5maWVsZFtDYXJkLlRZUEUuQ0xPU0VfQ09NQkFUXS5yZW1vdmVBbGwoKTtcclxuICAgIHZhciBjYXJkczIgPSB0aGlzLmZpZWxkW0NhcmQuVFlQRS5SQU5HRURdLnJlbW92ZUFsbCgpO1xyXG4gICAgdmFyIGNhcmRzMyA9IHRoaXMuZmllbGRbQ2FyZC5UWVBFLlNJRUdFXS5yZW1vdmVBbGwoKTtcclxuXHJcbiAgICB2YXIgY2FyZHMgPSBjYXJkczEuY29uY2F0KGNhcmRzMi5jb25jYXQoY2FyZHMzKSk7XHJcbiAgICB0aGlzLmFkZFRvRGlzY2FyZChjYXJkcyk7XHJcbiAgfVxyXG5cclxuICByLmFkZFRvRGlzY2FyZCA9IGZ1bmN0aW9uKGNhcmRzKXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIGNhcmRzLmZvckVhY2goZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHNlbGYuX2Rpc2NhcmQucHVzaChjYXJkKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgci5yZW1vdmVGcm9tRGlzY2FyZCA9IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2Rpc2NhcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSB0aGlzLl9kaXNjYXJkW2ldO1xyXG4gICAgICBpZihjLmdldElEKCkgPT09IGNhcmQuZ2V0SUQoKSl7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc2NhcmQuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByLmdldERpc2NhcmQgPSBmdW5jdGlvbihqc29uKXtcclxuICAgIGlmKGpzb24pe1xyXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5fZGlzY2FyZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fZGlzY2FyZDtcclxuICB9XHJcblxyXG4gIHIucmVzZXROZXdSb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNsZWFyTWFpbkZpZWxkcygpO1xyXG4gICAgdGhpcy5zZXRQYXNzaW5nKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHIuZmlsdGVyID0gZnVuY3Rpb24oYXJyQ2FyZHMsIG9wdCl7XHJcbiAgICB2YXIgYXJyID0gYXJyQ2FyZHMuc2xpY2UoKTtcclxuXHJcbiAgICBmb3IodmFyIGtleSBpbiBvcHQpIHtcclxuICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICB2YXIgcHJvcCA9IGtleSwgdmFsID0gb3B0W2tleV07XHJcblxyXG5cclxuICAgICAgYXJyQ2FyZHMuZm9yRWFjaChmdW5jdGlvbihjYXJkKXtcclxuICAgICAgICB2YXIgcHJvcGVydHkgPSBjYXJkLmdldFByb3BlcnR5KHByb3ApO1xyXG4gICAgICAgIGlmKF8uaXNBcnJheShwcm9wZXJ0eSkpe1xyXG4gICAgICAgICAgdmFyIF9mID0gZmFsc2U7XHJcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvcGVydHkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYocHJvcGVydHlbaV0gPT09IHZhbCkge1xyXG4gICAgICAgICAgICAgIF9mID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoIV9mKXtcclxuICAgICAgICAgICAgcmVzLnB1c2goY2FyZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoY2FyZC5nZXRQcm9wZXJ0eShwcm9wKSAhPT0gdmFsKXtcclxuICAgICAgICAgIHJlcy5wdXNoKGNhcmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgYXJyID0gXy5pbnRlcnNlY3Rpb24oYXJyLCByZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcnI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gQmF0dGxlc2lkZTtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmF0dGxlc2lkZTsiLCJ2YXIgQ2FyZERhdGEgPSByZXF1aXJlKFwiLi4vYXNzZXRzL2RhdGEvY2FyZHNcIik7XHJcbnZhciBBYmlsaXR5RGF0YSA9IHJlcXVpcmUoXCIuLi9hc3NldHMvZGF0YS9hYmlsaXRpZXNcIik7XHJcblxyXG52YXIgQ2FyZCA9IChmdW5jdGlvbigpe1xyXG4gIHZhciBDYXJkID0gZnVuY3Rpb24oa2V5KXtcclxuICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mIENhcmQpKXtcclxuICAgICAgcmV0dXJuIChuZXcgQ2FyZChrZXkpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY29uc3RydWN0b3IgaGVyZVxyXG4gICAgICovXHJcbiAgICB0aGlzLl91aWRFdmVudHMgPSB7fTtcclxuICAgIHRoaXMuc2V0RGlzYWJsZWQoZmFsc2UpO1xyXG4gICAgdGhpcy5fa2V5ID0ga2V5O1xyXG4gICAgdGhpcy5fZGF0YSA9IENhcmREYXRhW2tleV07XHJcbiAgICB0aGlzLl9kYXRhLmtleSA9IGtleTtcclxuICAgIHRoaXMuX2Jvb3N0ID0ge307XHJcbiAgICB0aGlzLl9mb3JjZWRQb3dlciA9IC0xO1xyXG4gICAgdGhpcy5faW5pdCgpO1xyXG5cclxuICB9O1xyXG4gIHZhciByID0gQ2FyZC5wcm90b3R5cGU7XHJcbiAgLyoqXHJcbiAgICogbWV0aG9kcyAmJiBwcm9wZXJ0aWVzIGhlcmVcclxuICAgKiByLnByb3BlcnR5ID0gbnVsbDtcclxuICAgKiByLmdldFByb3BlcnR5ID0gZnVuY3Rpb24oKSB7Li4ufVxyXG4gICAqL1xyXG4gIHIuX2tleSA9IG51bGw7XHJcbiAgci5fZGF0YSA9IG51bGw7XHJcbiAgci5faWQgPSBudWxsO1xyXG4gIHIuX293bmVyID0gbnVsbDtcclxuICByLl9ib29zdCA9IG51bGw7XHJcbiAgci5fZm9yY2VkUG93ZXIgPSBudWxsO1xyXG4gIHIuX2Rpc2FibGVkID0gbnVsbDtcclxuICByLl9jaGFuZ2VkVHlwZSA9IG51bGw7XHJcbiAgQ2FyZC5fX2lkID0gMDtcclxuICBDYXJkLlRZUEUgPSB7XHJcbiAgICBDTE9TRV9DT01CQVQ6IDAsXHJcbiAgICBSQU5HRUQ6IDEsXHJcbiAgICBTSUVHRTogMixcclxuICAgIExFQURFUjogMyxcclxuICAgIFNQRUNJQUw6IDQsXHJcbiAgICBXRUFUSEVSOiA1XHJcbiAgfTtcclxuXHJcbiAgci5fdWlkRXZlbnRzID0gbnVsbDtcclxuXHJcbiAgci5nZXRVaWRFdmVudHMgPSBmdW5jdGlvbihrZXkpIHtcclxuICAgIHJldHVybiB0aGlzLl91aWRFdmVudHNba2V5XTtcclxuICB9XHJcblxyXG4gIHIuX2luaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5faWQgPSArK0NhcmQuX19pZDtcclxuICB9XHJcblxyXG4gIHIuZ2V0TmFtZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5uYW1lO1xyXG4gIH1cclxuICByLmdldFBvd2VyID0gZnVuY3Rpb24oKXtcclxuICAgIGlmKHRoaXMuX2RhdGEucG93ZXIgPT09IC0xKSByZXR1cm4gMDtcclxuICAgIGlmKHRoaXMuX2ZvcmNlZFBvd2VyID4gLTEpe1xyXG4gICAgICByZXR1cm4gKHRoaXMuX2ZvcmNlZFBvd2VyID4gdGhpcy5fZGF0YS5wb3dlciA/IHRoaXMuX2RhdGEucG93ZXIgOiB0aGlzLl9mb3JjZWRQb3dlcikgKyB0aGlzLmdldEJvb3N0KCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5wb3dlciArIHRoaXMuZ2V0Qm9vc3QoKTtcclxuICB9XHJcbiAgci5nZXRSYXdQb3dlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5wb3dlcjtcclxuICB9XHJcbiAgLypyLmNhbGN1bGF0ZUJvb3N0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuX2Jvb3N0ID0gMDtcclxuICAgIGZvcih2YXIga2V5IGluIHRoaXMuX2Jvb3N0cykge1xyXG4gICAgICB2YXIgYm9vc3QgPSB0aGlzLl9ib29zdHNba2V5XTtcclxuICAgICAgdGhpcy5ib29zdChib29zdC5nZXRQb3dlcigpKTtcclxuICAgIH1cclxuICB9Ki9cclxuICByLnNldEZvcmNlZFBvd2VyID0gZnVuY3Rpb24obnIpe1xyXG4gICAgdGhpcy5fZm9yY2VkUG93ZXIgPSBucjtcclxuICB9XHJcbiAgci5nZXRSYXdBYmlsaXR5ID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLmFiaWxpdHk7XHJcbiAgfVxyXG4gIHIuZ2V0QWJpbGl0eSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KHRoaXMuX2RhdGEuYWJpbGl0eSkpe1xyXG4gICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgIHRoaXMuX2RhdGEuYWJpbGl0eS5mb3JFYWNoKGZ1bmN0aW9uKGFiaWxpdHkpe1xyXG4gICAgICAgIHJlcy5wdXNoKEFiaWxpdHlEYXRhW2FiaWxpdHldKTtcclxuICAgICAgfSlcclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHJldHVybiBBYmlsaXR5RGF0YVt0aGlzLl9kYXRhLmFiaWxpdHldO1xyXG4gIH1cclxuICByLmdldEltYWdlID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBcIi4uL2Fzc2V0cy9jYXJkcy9cIiArIHRoaXMuX2RhdGEuaW1nICsgXCIucG5nXCI7XHJcbiAgfVxyXG4gIHIuZ2V0RmFjdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5mYWN0aW9uO1xyXG4gIH1cclxuICByLmdldE11c3RlclR5cGUgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEubXVzdGVyVHlwZSB8fCBudWxsO1xyXG4gIH1cclxuICByLmdldFR5cGUgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5nZWRUeXBlID09IG51bGwgPyB0aGlzLl9kYXRhLnR5cGUgOiB0aGlzLl9jaGFuZ2VkVHlwZTtcclxuICB9XHJcbiAgci5jaGFuZ2VUeXBlID0gZnVuY3Rpb24odHlwZSl7XHJcbiAgICB0aGlzLl9jaGFuZ2VkVHlwZSA9IHR5cGU7XHJcbiAgfVxyXG4gIHIuZ2V0S2V5ID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9rZXk7XHJcbiAgfVxyXG5cclxuICByLmdldElEID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9pZDtcclxuICB9XHJcblxyXG4gIC8qci5ib29zdCA9IGZ1bmN0aW9uKG5yKXtcclxuICAgIHRoaXMuZ2V0UG93ZXIoKTsgLy90byByZWNhbGN1bGF0ZSB0aGlzLl9wb3dlcjtcclxuICAgIHRoaXMuX2Jvb3N0ICs9IG5yO1xyXG4gIH0qL1xyXG5cclxuICByLmdldEJvb3N0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVzID0gMDtcclxuICAgIGZvcih2YXIga2V5IGluIHRoaXMuX2Jvb3N0KSB7XHJcbiAgICAgIHJlcyArPSB0aGlzLl9ib29zdFtrZXldO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ib29zdCA9IHJlcztcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG5cclxuICByLnNldEJvb3N0ID0gZnVuY3Rpb24oa2V5LCB2YWwpIHtcclxuICAgIHRoaXMuX2Jvb3N0W2tleV0gPSB2YWw7XHJcbiAgICB0aGlzLmdldEJvb3N0KCk7IC8vdG8gcmVjYWxjdWxhdGUgdGhpcy5ib29zdFxyXG4gIH1cclxuXHJcbiAgci5pc0Rpc2FibGVkID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcclxuICB9XHJcblxyXG4gIHIuc2V0RGlzYWJsZWQgPSBmdW5jdGlvbihiKXtcclxuICAgIHRoaXMuX2Rpc2FibGVkID0gYjtcclxuICB9XHJcblxyXG4gIHIuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbihwcm9wKXtcclxuICAgIGlmKCF0aGlzLl9kYXRhW3Byb3BdKSByZXR1cm4ge307XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YVtwcm9wXTtcclxuICB9XHJcblxyXG4gIHIucmVzZXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5fY2hhbmdlZFR5cGUgPSBudWxsO1xyXG4gICAgdGhpcy5fYm9vc3QgPSB7fTtcclxuICAgIHRoaXMuYm9vc3QgPSAwO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIENhcmQ7XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmQ7IiwidmFyIENhcmQgPSByZXF1aXJlKFwiLi9DYXJkXCIpO1xyXG4vKnZhciBDYXJkTWFuYWdlciA9IHJlcXVpcmUoXCIuL0NhcmRNYW5hZ2VyXCIpOyovXHJcblxyXG52YXIgRGVjayA9IChmdW5jdGlvbigpe1xyXG4gIHZhciBEZWNrID0gZnVuY3Rpb24oZGVjayl7XHJcbiAgICBpZighKHRoaXMgaW5zdGFuY2VvZiBEZWNrKSl7XHJcbiAgICAgIHJldHVybiAobmV3IERlY2soZGVjaykpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2RlY2sgPSBbXTtcclxuXHJcbiAgICB0aGlzLl9vcmlnaW5hbERlY2sgPSBbXTtcclxuICAgIHRoaXMuc2V0RGVjayhkZWNrKTtcclxuICB9O1xyXG4gIHZhciByID0gRGVjay5wcm90b3R5cGU7XHJcbiAgLyoqXHJcbiAgICogbWV0aG9kcyAmJiBwcm9wZXJ0aWVzIGhlcmVcclxuICAgKiByLnByb3BlcnR5ID0gbnVsbDtcclxuICAgKiByLmdldFByb3BlcnR5ID0gZnVuY3Rpb24oKSB7Li4ufVxyXG4gICAqL1xyXG4gIHIuX2RlY2sgPSBudWxsO1xyXG4gIHIuX293bmVyID0gbnVsbDtcclxuICByLl9vcmlnaW5hbERlY2sgPSBudWxsO1xyXG5cclxuICByLnNldERlY2sgPSBmdW5jdGlvbihkZWNrRGF0YSl7XHJcbiAgICB0aGlzLl9vcmlnaW5hbERlY2sgPSBkZWNrRGF0YS5zbGljZSgpO1xyXG4gICAgdGhpcy5fZGVjayA9IGRlY2tEYXRhLnNsaWNlKCk7XHJcblxyXG4gICAgdGhpcy5fbG9hZENhcmRzKCk7XHJcbiAgICB0aGlzLnNodWZmbGUoKTtcclxuICB9XHJcblxyXG4gIHIuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9kZWNrLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHIubGVuZ3RoID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLmdldExlbmd0aCgpO1xyXG4gIH1cclxuXHJcbiAgci5nZXREZWNrID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9kZWNrO1xyXG4gIH1cclxuXHJcbiAgci5kcmF3ID0gZnVuY3Rpb24oKXtcclxuICAgIGlmKCF0aGlzLl9kZWNrLmxlbmd0aCkgcmV0dXJuIDA7XHJcbiAgICB2YXIgY2FyZCA9IHRoaXMucG9wKCk7XHJcbiAgICByZXR1cm4gY2FyZDtcclxuICB9XHJcblxyXG5cclxuICByLl9sb2FkQ2FyZHMgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5fZGVjayA9IHRoaXMuZ2V0RGVjaygpLm1hcChmdW5jdGlvbihjYXJka2V5KXtcclxuICAgICAgcmV0dXJuIENhcmQoY2FyZGtleSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHIucG9wID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBpZCA9IHRoaXMuX2RlY2sucG9wKCk7XHJcbiAgICAvKlxyXG4gICAgICAgIHZhciBjYXJkID0gQ2FyZE1hbmFnZXIoKS5nZXRDYXJkQnlJZChpZCk7Ki9cclxuICAgIHJldHVybiBpZDtcclxuICB9XHJcblxyXG4gIHIuZmluZCA9IGZ1bmN0aW9uKGtleSwgdmFsKXtcclxuICAgIHZhciByZXMgPSBbXTtcclxuICAgIHRoaXMuZ2V0RGVjaygpLmZvckVhY2goZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIGlmKGNhcmQuZ2V0UHJvcGVydHkoa2V5KSA9PSB2YWwpe1xyXG4gICAgICAgIHJlcy5wdXNoKGNhcmQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG5cclxuICByLnJlbW92ZUZyb21EZWNrID0gZnVuY3Rpb24oY2FyZCl7XHJcbiAgICB2YXIgbiA9IHRoaXMubGVuZ3RoKCk7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICB2YXIgYyA9IHRoaXMuZ2V0RGVjaygpW2ldO1xyXG4gICAgICBpZihjLmdldElEKCkgPT09IGNhcmQuZ2V0SUQoKSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVjaygpLnNwbGljZShpLCAxKVswXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxuXHJcbiAgci5zaHVmZmxlID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBkZWNrID0gdGhpcy5nZXREZWNrKCk7XHJcblxyXG4gICAgdmFyIG4gPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgZm9yKHZhciBpID0gbiAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgdmFyIGogPSAoTWF0aC5yYW5kb20oKSAqIGkpIHwgMDtcclxuICAgICAgdmFyIHRtcDtcclxuXHJcbiAgICAgIHRtcCA9IGRlY2tbal07XHJcbiAgICAgIGRlY2tbal0gPSBkZWNrW2ldO1xyXG4gICAgICBkZWNrW2ldID0gdG1wO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIERlY2s7XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERlY2s7IiwidmFyIEZpZWxkID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIEZpZWxkID0gZnVuY3Rpb24oKXtcclxuICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mIEZpZWxkKSl7XHJcbiAgICAgIHJldHVybiAobmV3IEZpZWxkKCkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuXHJcbiAgICB0aGlzLl9jYXJkcyA9IFtdO1xyXG4gIH07XHJcbiAgdmFyIHIgPSBGaWVsZC5wcm90b3R5cGU7XHJcbiAgLyoqXHJcbiAgICogbWV0aG9kcyAmJiBwcm9wZXJ0aWVzIGhlcmVcclxuICAgKiByLnByb3BlcnR5ID0gbnVsbDtcclxuICAgKiByLmdldFByb3BlcnR5ID0gZnVuY3Rpb24oKSB7Li4ufVxyXG4gICAqL1xyXG5cclxuICByLl9jYXJkcyA9IG51bGw7XHJcbiAgci5fc2NvcmUgPSAwO1xyXG5cclxuICByLmFkZCA9IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgdGhpcy5fY2FyZHMucHVzaChjYXJkKTtcclxuICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcclxuICB9XHJcblxyXG4gIHIuZ2V0ID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9jYXJkcztcclxuICB9XHJcblxyXG4gIHIuZ2V0U2NvcmUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlO1xyXG4gIH1cclxuXHJcbiAgci51cGRhdGVTY29yZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLl9zY29yZSA9IDA7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSB0aGlzLl9jYXJkc1tpXTtcclxuICAgICAgdGhpcy5fc2NvcmUgKz0gY2FyZC5nZXRQb3dlcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgci5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2NhcmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmKHRoaXMuX2NhcmRzW2ldLmdldElEKCkgPT09IGNhcmQuZ2V0SUQoKSkgcmV0dXJuIGk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICByLmlzT25GaWVsZCA9IGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0UG9zaXRpb24oY2FyZCkgPj0gMDtcclxuICB9XHJcblxyXG4gIHIucmVwbGFjZVdpdGggPSBmdW5jdGlvbihvbGRDYXJkLCBuZXdDYXJkKXtcclxuICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UG9zaXRpb24ob2xkQ2FyZCk7XHJcbiAgICB0aGlzLl9jYXJkc1tpbmRleF0gPSBuZXdDYXJkO1xyXG4gICAgb2xkQ2FyZC5yZXNldCgpO1xyXG4gICAgcmV0dXJuIG9sZENhcmQ7XHJcbiAgfVxyXG5cclxuICByLmdldENhcmQgPSBmdW5jdGlvbihpZCl7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGNhcmQgPSB0aGlzLl9jYXJkc1tpXTtcclxuICAgICAgaWYoY2FyZC5nZXRJRCgpID09IGlkKSByZXR1cm4gY2FyZDtcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIHIucmVtb3ZlQWxsID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciB0bXAgPSB0aGlzLl9jYXJkcy5zbGljZSgpO1xyXG4gICAgdG1wLmZvckVhY2goZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIGNhcmQucmVzZXQoKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLl9jYXJkcyA9IFtdO1xyXG4gICAgcmV0dXJuIHRtcDtcclxuICB9XHJcblxyXG4gIHJldHVybiBGaWVsZDtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7IiwiLyp2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7Ki8vKlxyXG52YXIgQ2FyZE1hbmFnZXIgPSByZXF1aXJlKFwiLi9DYXJkTWFuYWdlclwiKTsqLy8qXHJcbnZhciBQdWJTdWIgPSByZXF1aXJlKFwiLi9wdWJzdWJcIik7Ki9cclxudmFyIENhcmQgPSByZXF1aXJlKFwiLi9DYXJkXCIpO1xyXG5cclxuXHJcbnZhciBIYW5kID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIEhhbmQgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgSGFuZCkpe1xyXG4gICAgICByZXR1cm4gKG5ldyBIYW5kKCkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuXHJcbiAgICB0aGlzLl9oYW5kID0gW107XHJcbiAgfTtcclxuICB2YXIgciA9IEhhbmQucHJvdG90eXBlO1xyXG4gIC8qKlxyXG4gICAqIG1ldGhvZHMgJiYgcHJvcGVydGllcyBoZXJlXHJcbiAgICogci5wcm9wZXJ0eSA9IG51bGw7XHJcbiAgICogci5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKCkgey4uLn1cclxuICAgKi9cclxuICByLl9oYW5kID0gbnVsbDtcclxuXHJcbiAgci5hZGQgPSBmdW5jdGlvbihjYXJkKXtcclxuICAgIHRoaXMuX2hhbmQucHVzaChjYXJkKTtcclxuICB9XHJcblxyXG4gIHIuZ2V0Q2FyZHMgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhbmQ7XHJcbiAgfVxyXG5cclxuICByLmdldENhcmQgPSBmdW5jdGlvbihpZCkge1xyXG4gICAgZm9yKHZhciBpPTA7IGk8IHRoaXMubGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IHRoaXMuZ2V0Q2FyZHMoKVtpXTtcclxuICAgICAgaWYoY2FyZC5nZXRJRCgpID09PSBpZCkgcmV0dXJuIGNhcmQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICByLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIHZhciBuID0gdGhpcy5sZW5ndGgoKTtcclxuXHJcbiAgICAvL2NvbnNvbGUudHJhY2UoaWQpO1xyXG4gICAgaWQgPSBpZCBpbnN0YW5jZW9mIENhcmQgPyBpZC5nZXRJRCgpIDogaWQ7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICBpZih0aGlzLl9oYW5kW2ldLmdldElEKCkgIT0gaWQpIGNvbnRpbnVlO1xyXG4gICAgICByZXR1cm4gdGhpcy5faGFuZC5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxuXHJcbiAgci5nZXRSYW5kb21DYXJkID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBybmQgPSAoTWF0aC5yYW5kb20oKSAqIHRoaXMuX2hhbmQubGVuZ3RoKSB8IDA7XHJcbiAgICByZXR1cm4gdGhpcy5faGFuZFtybmRdO1xyXG4gIH1cclxuXHJcbiAgci5nZXRMZW5ndGggPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhbmQubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgci5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhbmQubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgci5maW5kID0gZnVuY3Rpb24oa2V5LCB2YWwpIHtcclxuICAgIHZhciByZXMgPSBbXTtcclxuICAgIHRoaXMuX2hhbmQuZm9yRWFjaChmdW5jdGlvbihjYXJkKXtcclxuICAgICAgaWYoY2FyZC5nZXRQcm9wZXJ0eShrZXkpID09IHZhbCl7XHJcbiAgICAgICAgcmVzLnB1c2goY2FyZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gSGFuZDtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFuZDsiLCJ2YXIgQmF0dGxlID0gcmVxdWlyZShcIi4uLy4uL3NlcnZlci9CYXR0bGVcIik7XG52YXIgQ2FyZCA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2ZXIvQ2FyZFwiKTtcbnZhciBkYXRhID0gcmVxdWlyZShcIi4uLy4uL2Fzc2V0cy9kYXRhL2FiaWxpdGllc1wiKTtcblxuZGVzY3JpYmUoXCJwdWJzdWJcIiwgZnVuY3Rpb24oKXtcbiAgdmFyIGJhdHRsZSwgY2FyZDEsIGNhcmQyO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKXtcbiAgICBiYXR0bGUgPSB7fTtcbiAgICBiYXR0bGUucnVuRXZlbnQgPSBCYXR0bGUucHJvdG90eXBlLnJ1bkV2ZW50O1xuICAgIGJhdHRsZS5vbiA9IEJhdHRsZS5wcm90b3R5cGUub247XG4gICAgYmF0dGxlLm9mZiA9IEJhdHRsZS5wcm90b3R5cGUub2ZmO1xuICAgIGJhdHRsZS5ldmVudHMgPSB7fTtcbiAgICBiYXR0bGUudXBkYXRlID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIGNhcmQxID0gQ2FyZChcImthZWR3ZW5pX3NpZWdlX2V4cGVydFwiKTtcbiAgICBjYXJkMiA9IENhcmQoXCJkdW5fYmFubmVyX21lZGljXCIpO1xuICB9KTtcblxuICBpdChcIm9uOiBoYXMgY29ycmVjdCBhcmd1bWVudHNcIiwgZnVuY3Rpb24oKXtcbiAgICAvL3RoaXMub24oXCJFYWNoVHVyblwiLCBhYmlsaXR5Lm9uRWFjaFR1cm4sIHRoaXMsIFtjYXJkXSlcblxuICAgIGJhdHRsZS5vbihcIkVhY2hUdXJuXCIsIGZ1bmN0aW9uKGNhcmQpe1xuICAgICAgZXhwZWN0KGNhcmQpLnRvRXF1YWwoY2FyZDEpO1xuICAgIH0sIHRoaXMsIFtjYXJkMV0pO1xuICAgIGJhdHRsZS5ydW5FdmVudChcIkVhY2hUdXJuXCIpO1xuXG5cbiAgfSlcbiAgaXQoXCJydW5FdmVudDogaGFzIGNvcnJlY3QgYXJndW1lbnRzXCIsIGZ1bmN0aW9uKCl7XG4gICAgLy90aGlzLm9uKFwiRWFjaFR1cm5cIiwgYWJpbGl0eS5vbkVhY2hUdXJuLCB0aGlzLCBbY2FyZF0pXG4gICAgYmF0dGxlLm9uKFwiRWFjaFR1cm5cIiwgZnVuY3Rpb24oYyl7XG4gICAgICBleHBlY3QoYykudG9FcXVhbChjYXJkMSk7XG4gICAgfSk7XG4gICAgYmF0dGxlLnJ1bkV2ZW50KFwiRWFjaFR1cm5cIiwgbnVsbCwgW2NhcmQxXSk7XG4gIH0pXG4gIGl0KFwib24gKyBydW5FdmVudDogaGFzIGNvcnJlY3QgYXJndW1lbnRzXCIsIGZ1bmN0aW9uKCl7XG4gICAgLy90aGlzLm9uKFwiRWFjaFR1cm5cIiwgYWJpbGl0eS5vbkVhY2hUdXJuLCB0aGlzLCBbY2FyZF0pXG4gICAgYmF0dGxlLm9uKFwiRWFjaFR1cm5cIiwgZnVuY3Rpb24oYzEsIGMyKXtcbiAgICAgIGV4cGVjdChjMSkudG9FcXVhbChjYXJkMSk7XG4gICAgICBleHBlY3QoYzIpLnRvRXF1YWwoY2FyZDIpO1xuICAgIH0sIG51bGwsIFtjYXJkMV0pO1xuICAgIGJhdHRsZS5ydW5FdmVudChcIkVhY2hUdXJuXCIsIG51bGwsIFtjYXJkMl0pO1xuICB9KVxuICBpdChcInRlc3QgY29udGV4dFwiLCBmdW5jdGlvbigpe1xuXG4gICAgYmF0dGxlLm9uKFwiRWFjaFR1cm5cIiwgZnVuY3Rpb24oY2FyZCl7XG4gICAgICBleHBlY3QoY2FyZC5pZCkudG9FcXVhbChjYXJkMS5pZCk7XG4gICAgICBleHBlY3QodGhpcy5pZCkudG9FcXVhbChjYXJkMi5pZCk7XG4gICAgfSwgY2FyZDIsIFtjYXJkMV0pO1xuICAgIGJhdHRsZS5ydW5FdmVudChcIkVhY2hUdXJuXCIpO1xuICB9KVxuICBpdChcInRlc3QgY29udGV4dFwiLCBmdW5jdGlvbigpe1xuXG4gICAgYmF0dGxlLm9uKFwiRWFjaFR1cm5cIiwgZnVuY3Rpb24oY2FyZCl7XG4gICAgICBleHBlY3QoY2FyZC5pZCkudG9FcXVhbChjYXJkMS5pZCk7XG4gICAgICBleHBlY3QodGhpcy5pZCkudG9FcXVhbChjYXJkMi5pZCk7XG4gICAgfSwgbnVsbCwgW2NhcmQxXSk7XG4gICAgYmF0dGxlLnJ1bkV2ZW50KFwiRWFjaFR1cm5cIiwgY2FyZDIpO1xuICB9KVxuICBpdChcInRlc3QgY29udGV4dFwiLCBmdW5jdGlvbigpe1xuXG4gICAgYmF0dGxlLm9uKFwiRWFjaFR1cm5cIiwgZnVuY3Rpb24oY2FyZCl7XG4gICAgICBleHBlY3QoY2FyZC5pZCkudG9FcXVhbChjYXJkMS5pZCk7XG4gICAgICBleHBlY3QodGhpcy5pZCkudG9FcXVhbChjYXJkMS5pZCk7XG4gICAgfSwgY2FyZDEsIFtjYXJkMV0pO1xuICAgIGJhdHRsZS5ydW5FdmVudChcIkVhY2hUdXJuXCIsIGNhcmQyKTtcbiAgfSlcblxuICBpdChcInNob3VsZCBoYW5kbGUgb2ZmIGNvcnJlY3RseVwiLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IxID0gZnVuY3Rpb24oKXt9LCBjYjIgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjYjE6IGNiMSxcbiAgICAgIGNiMjogY2IyXG4gICAgfVxuXG4gICAgc3B5T24ob2JqLCBcImNiMVwiKTtcbiAgICBzcHlPbihvYmosIFwiY2IyXCIpO1xuXG5cbiAgICB2YXIgdWlkMSA9IGJhdHRsZS5vbihcIkVhY2hDYXJkUGxhY2VcIiwgb2JqLmNiMSwgYmF0dGxlLCBbY2FyZDFdKTtcbiAgICB2YXIgdWlkMiA9IGJhdHRsZS5vbihcIkVhY2hDYXJkUGxhY2VcIiwgb2JqLmNiMiwgYmF0dGxlLCBbY2FyZDJdKTtcblxuXG4gICAgYmF0dGxlLm9mZihcIkVhY2hDYXJkUGxhY2VcIiwgdWlkMik7XG4gICAgYmF0dGxlLnJ1bkV2ZW50KFwiRWFjaENhcmRQbGFjZVwiKTtcblxuXG4gICAgZXhwZWN0KG9iai5jYjEpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICBleHBlY3Qob2JqLmNiMikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICAgIC8qYmF0dGxlLm9mZihcIkVhY2hDYXJkUGxhY2VcIiwgdWlkMSk7XG5cbiAgICBleHBlY3QoYmF0dGxlLmV2ZW50cykudG9FcXVhbCh7fSk7Ki9cbiAgfSlcblxuXG59KTtcbiIsInZhciBDYXJkID0gcmVxdWlyZShcIi4uLy4uL3NlcnZlci9DYXJkXCIpO1xyXG52YXIgQmF0dGxlc2lkZSA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2ZXIvQmF0dGxlc2lkZVwiKTtcclxudmFyIGRhdGEgPSByZXF1aXJlKFwiLi4vLi4vYXNzZXRzL2RhdGEvYWJpbGl0aWVzXCIpO1xyXG5cclxuXHJcbmRlc2NyaWJlKFwiZmlsdGVyXCIsIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNhcmQsIHNpZGUsIGZpbHRlciwgY2FyZHM7XHJcbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpe1xyXG4gICAgZmlsdGVyID0gQmF0dGxlc2lkZS5wcm90b3R5cGUuZmlsdGVyO1xyXG4gICAgY2FyZHMgPSBbXTtcclxuICAgIGNhcmRzLnB1c2goQ2FyZChcImlvcnZldGhcIikpO1xyXG4gICAgY2FyZHMucHVzaChDYXJkKFwidG9ydXZpZWxcIikpO1xyXG4gICAgY2FyZHMucHVzaChDYXJkKFwiaXNlbmdyaW1fZmFvaWx0aWFybmFoXCIpKTtcclxuICAgIGNhcmRzLnB1c2goQ2FyZChcImRlY295XCIpKTtcclxuICB9KVxyXG5cclxuICBpdChcIml0IHNob3VsZCBmaWx0ZXIgaGVyb2VzIG91dFwiLCBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHJlcyA9IGZpbHRlcihjYXJkcywge1xyXG4gICAgICBcImFiaWxpdHlcIjogXCJoZXJvXCJcclxuICAgIH0pXHJcbiAgICBleHBlY3QocmVzLmxlbmd0aCkudG9CZSgyKTtcclxuICB9KVxyXG5cclxuICBpdChcIml0IHNob3VsZCBmaWx0ZXIgaGVybyBhbmQgc3BlY2lhbCBjYXJkcyBvdXRcIiwgZnVuY3Rpb24oKXtcclxuICAgIHZhciByZXMgPSBmaWx0ZXIoY2FyZHMsIHtcclxuICAgICAgXCJhYmlsaXR5XCI6IFwiaGVyb1wiLFxyXG4gICAgICBcInR5cGVcIjogQ2FyZC5UWVBFLlNQRUNJQUxcclxuICAgIH0pXHJcbiAgICBleHBlY3QocmVzLmxlbmd0aCkudG9CZSgxKTtcclxuICB9KVxyXG5cclxuXHJcbn0pIiwicmVxdWlyZShcIi4vZmlsdGVyU3BlY1wiKTtcclxucmVxdWlyZShcIi4vUHViU3ViU3BlY1wiKTtcclxuXHJcbihmdW5jdGlvbiBtYWluKCl7XHJcblxyXG59KSgpO1xyXG4iXX0=
