(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = {

  "agile": {},
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
    onAfterPlace: function onAfterPlace(card) {
      var field = this.field[card.getType()];
      var cards = field.get();

      cards.forEach(function (_card) {
        if (_card.getID() == card.getID()) return;
        if (_card.getRawPower() === -1) return;
        _card.boost(1);
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
    ability: "morale_boost",
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
    ability: "muster",
    musterType: "defender",
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
  "crone_whispess", "crone_whispess", "crone_brewess", "crone_brewess", "crone_weavess", "crone_weavess", "arachas_behemoth", "fire_elemental", "fiend", "earth_elemental"]
};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
    if (obj._canclePlacement) return 0;

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
      if (ability.waitResponse) {
        obj._waitResponse = true;
      }
      if (ability.changeSide) {
        obj.targetSide = this.foe;
      }
      if (ability.replaceWith) {
        obj._canclePlacement = true;

        this.on("Decoy:replaceWith", function (replaceCard) {
          if (replaceCard.getType() == Card.TYPE.LEADER || replaceCard.getType() == Card.TYPE.WEATHER || replaceCard.getType() == Card.TYPE.SPECIAL) {
            return;
          }
          if (replaceCard.getName() === card.getName()) return;
          self.off("Decoy:replaceWith");
          var field = self.field[replaceCard.getType()];

          field.replaceWith(replaceCard, card);

          self.hand.add(replaceCard);
          self.hand.remove(card);
          self.update();

          self.runEvent("NextTurn", null, [self.foe]);
        });
      }
      if (ability.onEachTurn) {
        this.on("EachTurn", ability.onEachTurn, this, [card]);
      }
      if (ability.onEachCardPlace) {
        //PubSub.subscribe("onEachCardPlace", ability.onEachCardPlace.bind(this, card));
        this.on("EachCardPlace", ability.onEachCardPlace, this, [card]);
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

},{"../assets/data/deck":3,"./Card":6,"./Deck":7,"./Field":8,"./Hand":9,"underscore":4}],6:[function(require,module,exports){
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
    this.setDisabled(false);
    this.channel = {};
    this._key = key;
    this._data = CardData[key];
    this._data.key = key;
    this._boost = 0;
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
  Card.__id = 0;
  Card.TYPE = {
    CLOSE_COMBAT: 0,
    RANGED: 1,
    SIEGE: 2,
    LEADER: 3,
    SPECIAL: 4,
    WEATHER: 5
  };

  r.channel = null;

  r._init = function () {
    this._id = ++Card.__id;
  };

  r.getName = function () {
    return this._data.name;
  };
  r.getPower = function () {
    if (this._data.power === -1) return 0;
    if (this._forcedPower > -1) {
      return this._forcedPower + this._boost;
    }
    return this._data.power + this._boost;
  };
  r.getRawPower = function () {
    return this._data.power;
  };
  r.calculateBoost = function () {
    this._boost = 0;
    for (var key in this._boosts) {
      var boost = this._boosts[key];
      this.boost(boost.getPower());
    }
  };
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
    return this._data.type;
  };
  r.getKey = function () {
    return this._key;
  };

  r.getID = function () {
    return this._id;
  };

  r.boost = function (nr) {
    /*this.getPower(); //to recalculate this._power;*/
    this._boost += nr;
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

  r.resetBoost = function () {
    this._boost = 0;
  };

  return Card;
})();

module.exports = Card;

},{"../assets/data/abilities":1,"../assets/data/cards":2}],7:[function(require,module,exports){
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

},{"./Card":6}],8:[function(require,module,exports){
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

  r.replaceWith = function (oldCard, newCard) {
    var index = this.getPosition(oldCard);
    this._cards[index] = newCard;
    oldCard.resetBoost();
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
      card.resetBoost();
    });
    this._cards = [];
    return tmp;
  };

  return Field;
})();

module.exports = Field;

},{}],9:[function(require,module,exports){
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

},{"./Card":6}],10:[function(require,module,exports){
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

},{"../../assets/data/abilities":1,"../../server/Battleside":5,"../../server/Card":6}],11:[function(require,module,exports){
"use strict";

require("./filterSpec");

(function main() {})();

},{"./filterSpec":10}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJZOi9odGRvY3MvdGltLzIwMTUvZ3dlbnQvYXNzZXRzL2RhdGEvYWJpbGl0aWVzLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L2Fzc2V0cy9kYXRhL2NhcmRzLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L2Fzc2V0cy9kYXRhL2RlY2suanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3NlcnZlci9CYXR0bGVzaWRlLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3NlcnZlci9DYXJkLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3NlcnZlci9EZWNrLmpzIiwiWTovaHRkb2NzL3RpbS8yMDE1L2d3ZW50L3NlcnZlci9GaWVsZC5qcyIsIlk6L2h0ZG9jcy90aW0vMjAxNS9nd2VudC9zZXJ2ZXIvSGFuZC5qcyIsIlk6L2h0ZG9jcy90aW0vMjAxNS9nd2VudC90ZXN0L3NwZWMvZmlsdGVyU3BlYy5qcyIsIlk6L2h0ZG9jcy90aW0vMjAxNS9nd2VudC90ZXN0L3NwZWMvbWFpblNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7O0FBRWYsU0FBTyxFQUFFLEVBRVI7QUFDRCxTQUFPLEVBQUU7QUFDUCxnQkFBWSxFQUFFLElBQUk7QUFDbEIsZ0JBQVksRUFBRSxzQkFBUyxJQUFJLEVBQUU7QUFDM0IsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOztBQUVoQyxhQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDN0IsaUJBQVMsRUFBRSxNQUFNO0FBQ2pCLGNBQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxP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V0FBVyxFQUNYLFVBQVUsRUFDVixlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLFdBQVc7O0FBRVgsa0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsZUFBZSxFQUNmLGVBQWUsRUFDZixlQUFlLEVBQ2Ysa0JBQWtCLEVBQ2xCLGdCQUFnQixFQUNoQixPQUFPLEVBQ1AsaUJBQWlCLENBQ2xCO0NBQ0YsQ0FBQTs7O0FDL0dEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNWdEQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM5QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUc5QixJQUFJLFVBQVUsQ0FBQztBQUNmLFVBQVUsR0FBRyxDQUFDLFlBQVU7QUFDdEIsTUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQVksSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO0FBQzlDLFFBQUcsRUFBRSxJQUFJLFlBQVksVUFBVSxDQUFBLEFBQUMsRUFBQztBQUMvQixhQUFRLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFFO0tBQ2hEOzs7OztBQUtELFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxQixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkUsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxRQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUc3QyxRQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFlBQVU7QUFDeEMsVUFBRyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU87QUFDM0IsVUFBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTzs7QUFFNUIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVoQyxVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDbEMsVUFBRyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsT0FBTzs7QUFHbkMsVUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDOztBQUV0QyxhQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixnQkFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQVMsSUFBSSxFQUFDO0FBQzlDLFVBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPO0FBQzNCLFVBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU87QUFDNUIsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNyQixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFckMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyQixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQVMsSUFBSSxFQUFDO0FBQzlDLFVBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPO0FBQzNCLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsVUFBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hFLFVBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNsRCxDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxZQUFVO0FBQ3JDLFVBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUMvQixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxZQUFVO0FBQ3BDLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDN0MsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxVQUFTLElBQUksRUFBQztBQUN4RCxVQUFHLENBQUMsSUFBSSxFQUFDO0FBQ1AsWUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDNUMsZUFBTztPQUNSO0FBQ0QsVUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN6QixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsVUFBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFdEYsVUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU3QixVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCLENBQUMsQ0FBQTs7QUFHRixRQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUN4RCxDQUFDO0FBQ0YsTUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQzs7Ozs7O0FBTTdCLEdBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2YsR0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRWxCLEdBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsR0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDYixHQUFDLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUNwQixHQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsR0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWYsR0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDaEIsR0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRVgsR0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDYixHQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNkLEdBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLEdBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVkLEdBQUMsQ0FBQyxTQUFTLEdBQUcsWUFBVTtBQUN0QixXQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7R0FDdEIsQ0FBQTs7QUFFRCxHQUFDLENBQUMscUJBQXFCLEdBQUcsVUFBUyxFQUFFLEVBQUM7QUFDcEMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN4RixDQUFBOztBQUVELEdBQUMsQ0FBQyxtQkFBbUIsR0FBRyxVQUFTLEVBQUUsRUFBQztBQUNsQyxTQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDekIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLFVBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0tBQzdCOzs7Ozs7QUFNRCxXQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ1gsQ0FBQTs7QUFFRCxHQUFDLENBQUMsa0JBQWtCLEdBQUcsVUFBUyxFQUFFLEVBQUM7QUFDakMsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsVUFBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQy9CO0FBQ0QsV0FBTyxDQUFDLENBQUMsQ0FBQztHQUNYLENBQUE7O0FBRUQsR0FBQyxDQUFDLFVBQVUsR0FBRyxVQUFTLENBQUMsRUFBQztBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsQixRQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDMUQsQ0FBQTs7QUFFRCxHQUFDLENBQUMsSUFBSSxHQUFHLFlBQVU7QUFDakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzVELENBQUE7O0FBRUQsR0FBQyxDQUFDLElBQUksR0FBRyxZQUFVO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUM1RCxDQUFBOztBQUVELEdBQUMsQ0FBQyxhQUFhLEdBQUcsWUFBVTtBQUMxQixRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRCxRQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR3hDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakQsQ0FBQTs7QUFFRCxHQUFDLENBQUMsU0FBUyxHQUFHLFlBQVU7QUFDdEIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDOUMsQ0FBQTs7QUFFRCxHQUFDLENBQUMsS0FBSyxHQUFHLFlBQVU7QUFDbEIsV0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ2YsQ0FBQTs7QUFFRCxHQUFDLENBQUMsSUFBSSxHQUFHLFVBQVMsS0FBSyxFQUFDO0FBQ3RCLFdBQU0sS0FBSyxFQUFFLEVBQUU7QUFDYixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCOztBQUVELFdBQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2YsQ0FBQTs7QUFFRCxHQUFDLENBQUMsU0FBUyxHQUFHLFlBQVU7QUFDdEIsUUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsU0FBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3pCLFdBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdEM7QUFDRCxXQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0dBQzVCLENBQUE7O0FBRUQsR0FBQyxDQUFDLE9BQU8sR0FBRyxZQUFVO0FBQ3BCLFdBQU87QUFDTCxVQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNwQixXQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDbkIsV0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdkIsVUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3hCLGFBQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztBQUM5QixhQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7S0FDdkIsQ0FBQTtHQUNGLENBQUE7O0FBRUQsR0FBQyxDQUFDLFNBQVMsR0FBRyxZQUFVO0FBQ3RCLFdBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztHQUNyQixDQUFBOztBQUVELEdBQUMsQ0FBQyxRQUFRLEdBQUcsWUFBVTtBQUNyQixXQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0dBQzFCLENBQUE7O0FBRUQsR0FBQyxDQUFDLFVBQVUsR0FBRyxZQUFVO0FBQ3ZCLFFBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNoQixDQUFBOztBQUVELEdBQUMsQ0FBQyxPQUFPLEdBQUcsWUFBVTtBQUNwQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDbkIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsSUFBSSxHQUFHLFVBQVMsS0FBSyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUM7QUFDdEMsT0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUM7QUFDaEIsYUFBUyxHQUFHLE9BQU8sU0FBUyxLQUFLLFdBQVcsR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFDO0FBQ2pFLE9BQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFdkIsUUFBRyxTQUFTLEVBQUM7QUFDWCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyQztBQUNELFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztHQUM5QixDQUFBOztBQUVELEdBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUUsRUFBRSxFQUFDO0FBQzdCLFFBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztHQUMzQixDQUFBOztBQUVELEdBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBVTs7QUFFbkIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUN6QixDQUFBOztBQUVELEdBQUMsQ0FBQyxXQUFXLEdBQUcsWUFBVTtBQUN4QixRQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7O0dBS2IsQ0FBQzs7QUFFRixHQUFDLENBQUMsUUFBUSxHQUFHLFVBQVMsSUFBSSxFQUFDO0FBQ3pCLFFBQUcsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTzs7QUFFeEMsUUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTzs7QUFFakMsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFHZCxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUM3QyxDQUFBOztBQUVELEdBQUMsQ0FBQyxTQUFTLEdBQUcsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQy9CLE9BQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0IsUUFBRyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRWxDLFFBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELFNBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBR2hCLFFBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRS9CLFFBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7QUFJekMsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVkLFFBQUcsR0FBRyxDQUFDLGFBQWEsRUFBQztBQUNuQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxhQUFPLENBQUMsQ0FBQztLQUNWOztBQUVELFdBQU8sQ0FBQyxDQUFDO0dBQ1YsQ0FBQTs7QUFFRCxHQUFDLENBQUMsY0FBYyxHQUFHLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUM7QUFDNUMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE9BQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFFBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOztBQUV6RCxRQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBQztBQUMxQyxVQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUIsU0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwQyxhQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCOztBQUVELFFBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsRUFBQztBQUMxQyxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7QUFFRCxRQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUM7QUFDcEMsVUFBRyxPQUFPLENBQUMsWUFBWSxFQUFDO0FBQ3RCLFdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO09BQzFCO0FBQ0QsVUFBRyxPQUFPLENBQUMsVUFBVSxFQUFDO0FBQ3BCLFdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztPQUMzQjtBQUNELFVBQUcsT0FBTyxDQUFDLFdBQVcsRUFBQztBQUNyQixXQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOztBQUU1QixZQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFVBQVMsV0FBVyxFQUFDO0FBQ2hELGNBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUM1QyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQzFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQztBQUN6QyxtQkFBTztXQUNSO0FBQ0QsY0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU87QUFDcEQsY0FBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlCLGNBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7O0FBRzlDLGVBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVyQyxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzQixjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixjQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWQsY0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDN0MsQ0FBQyxDQUFBO09BQ0g7QUFDRCxVQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUM7QUFDcEIsWUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO09BQ3REO0FBQ0QsVUFBRyxPQUFPLENBQUMsZUFBZSxFQUFDOztBQUV6QixZQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDakU7O0FBRUQsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7R0FDRixDQUFBOztBQUVELEdBQUMsQ0FBQyx3QkFBd0IsR0FBRyxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDOUMsUUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2hDLFFBQUcsT0FBTyxFQUFDO0FBQ1QsVUFBRyxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLFFBQVEsRUFBQztBQUMvQyxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZCxlQUFPO09BQ1I7QUFDRCxVQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUM7QUFDdEIsZUFBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3RDO0tBQ0Y7R0FDRixDQUFBOztBQUVELEdBQUMsQ0FBQyxlQUFlLEdBQUcsWUFBVTtBQUM1QixRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDNUQsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3RELFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFckQsUUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDakQsUUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMxQixDQUFBOztBQUVELEdBQUMsQ0FBQyxZQUFZLEdBQUcsVUFBUyxLQUFLLEVBQUM7QUFDOUIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFNBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUM7QUFDMUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUIsQ0FBQyxDQUFDO0dBQ0osQ0FBQTs7QUFFRCxHQUFDLENBQUMsaUJBQWlCLEdBQUcsVUFBUyxJQUFJLEVBQUM7QUFDbEMsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsVUFBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDOztBQUU1QixZQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0IsZUFBTTtPQUNQO0tBQ0Y7R0FDRixDQUFBOztBQUVELEdBQUMsQ0FBQyxVQUFVLEdBQUcsVUFBUyxJQUFJLEVBQUM7QUFDM0IsUUFBRyxJQUFJLEVBQUM7QUFDTixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3RDO0FBQ0QsV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0dBQ3RCLENBQUE7O0FBRUQsR0FBQyxDQUFDLGFBQWEsR0FBRyxZQUFVO0FBQzFCLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hCLENBQUE7O0FBRUQsR0FBQyxDQUFDLE1BQU0sR0FBRyxVQUFTLFFBQVEsRUFBRSxHQUFHLEVBQUM7QUFDaEMsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUUzQixTQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUNsQixVQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixVQUFJLElBQUksR0FBRyxHQUFHO1VBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFHL0IsY0FBUSxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBQztBQUM3QixZQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLFlBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQztBQUNyQixjQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDZixlQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxnQkFBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQ3RCLGdCQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ1Ysb0JBQU07YUFDUDtXQUNGO0FBQ0QsY0FBRyxDQUFDLEVBQUUsRUFBQztBQUNMLGVBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDaEI7U0FDRixNQUNJLElBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUM7QUFDckMsYUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQjtPQUNGLENBQUMsQ0FBQTtBQUNGLFNBQUcsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNoQzs7QUFFRCxXQUFPLEdBQUcsQ0FBQztHQUNaLENBQUE7O0FBRUQsU0FBTyxVQUFVLENBQUM7Q0FDbkIsQ0FBQSxFQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7Ozs7O0FDdmI1QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUMvQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFdEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxZQUFVO0FBQ3BCLE1BQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFZLEdBQUcsRUFBQztBQUN0QixRQUFHLEVBQUUsSUFBSSxZQUFZLElBQUksQ0FBQSxBQUFDLEVBQUM7QUFDekIsYUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBRTtLQUN4Qjs7OztBQUlELFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDaEIsUUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBRWQsQ0FBQztBQUNGLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Ozs7OztBQU12QixHQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNkLEdBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2YsR0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDYixHQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNoQixHQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNoQixHQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUN0QixHQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUNuQixNQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNkLE1BQUksQ0FBQyxJQUFJLEdBQUc7QUFDVixnQkFBWSxFQUFFLENBQUM7QUFDZixVQUFNLEVBQUUsQ0FBQztBQUNULFNBQUssRUFBRSxDQUFDO0FBQ1IsVUFBTSxFQUFFLENBQUM7QUFDVCxXQUFPLEVBQUUsQ0FBQztBQUNWLFdBQU8sRUFBRSxDQUFDO0dBQ1gsQ0FBQzs7QUFFRixHQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTs7QUFHaEIsR0FBQyxDQUFDLEtBQUssR0FBRyxZQUFVO0FBQ2xCLFFBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQ3hCLENBQUE7O0FBRUQsR0FBQyxDQUFDLE9BQU8sR0FBRyxZQUFVO0FBQ3BCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7R0FDeEIsQ0FBQTtBQUNELEdBQUMsQ0FBQyxRQUFRLEdBQUcsWUFBVTtBQUNyQixRQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLFFBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBQztBQUN4QixhQUFPLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUN4QztBQUNELFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztHQUN2QyxDQUFBO0FBQ0QsR0FBQyxDQUFDLFdBQVcsR0FBRyxZQUFXO0FBQ3pCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7R0FDekIsQ0FBQTtBQUNELEdBQUMsQ0FBQyxjQUFjLEdBQUcsWUFBVztBQUM1QixRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixTQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDNUIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0dBQ0YsQ0FBQTtBQUNELEdBQUMsQ0FBQyxjQUFjLEdBQUcsVUFBUyxFQUFFLEVBQUM7QUFDN0IsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7R0FDeEIsQ0FBQTtBQUNELEdBQUMsQ0FBQyxhQUFhLEdBQUcsWUFBVTtBQUMxQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0dBQzNCLENBQUE7QUFDRCxHQUFDLENBQUMsVUFBVSxHQUFHLFlBQVU7QUFDdkIsUUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDcEMsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFO0FBQzNDLFdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDaEMsQ0FBQyxDQUFBO0FBQ0YsYUFBTyxHQUFHLENBQUM7S0FDWjtBQUNELFdBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDeEMsQ0FBQTtBQUNELEdBQUMsQ0FBQyxRQUFRLEdBQUcsWUFBVTtBQUNyQixXQUFPLGtCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztHQUNyRCxDQUFBO0FBQ0QsR0FBQyxDQUFDLFVBQVUsR0FBRyxZQUFVO0FBQ3ZCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7R0FDM0IsQ0FBQTtBQUNELEdBQUMsQ0FBQyxhQUFhLEdBQUcsWUFBVztBQUMzQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQztHQUN0QyxDQUFBO0FBQ0QsR0FBQyxDQUFDLE9BQU8sR0FBRyxZQUFVO0FBQ3BCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7R0FDeEIsQ0FBQTtBQUNELEdBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBVTtBQUNuQixXQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7R0FDbEIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsS0FBSyxHQUFHLFlBQVU7QUFDbEIsV0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0dBQ2pCLENBQUE7O0FBRUQsR0FBQyxDQUFDLEtBQUssR0FBRyxVQUFTLEVBQUUsRUFBQzs7QUFFcEIsUUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7R0FDbkIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsVUFBVSxHQUFHLFlBQVc7QUFDeEIsV0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0dBQ3ZCLENBQUE7O0FBRUQsR0FBQyxDQUFDLFdBQVcsR0FBRyxVQUFTLENBQUMsRUFBRTtBQUMxQixRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztHQUNwQixDQUFBOztBQUVELEdBQUMsQ0FBQyxXQUFXLEdBQUcsVUFBUyxJQUFJLEVBQUM7QUFDNUIsUUFBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDaEMsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3pCLENBQUE7O0FBRUQsR0FBQyxDQUFDLFVBQVUsR0FBRyxZQUFXO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQ2pCLENBQUE7O0FBRUQsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFBLEVBQUcsQ0FBQzs7QUFFTCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7Ozs7QUNwSXRCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzdCLElBQUksSUFBSSxHQUFHLENBQUMsWUFBVTtBQUNwQixNQUFJLElBQUksR0FBRyxTQUFQLElBQUksQ0FBWSxJQUFJLEVBQUM7QUFDdkIsUUFBRyxFQUFFLElBQUksWUFBWSxJQUFJLENBQUEsQUFBQyxFQUFDO0FBQ3pCLGFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUU7S0FDekI7Ozs7QUFJRCxRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwQixDQUFDO0FBQ0YsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7Ozs7O0FBTXZCLEdBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2YsR0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDaEIsR0FBQyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRXZCLEdBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxRQUFRLEVBQUM7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdEMsUUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDaEIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsU0FBUyxHQUFHLFlBQVU7QUFDdEIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztHQUMxQixDQUFBOztBQUVELEdBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBVTtBQUNuQixXQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztHQUN6QixDQUFBOztBQUVELEdBQUMsQ0FBQyxPQUFPLEdBQUcsWUFBVTtBQUNwQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDbkIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsSUFBSSxHQUFHLFlBQVU7QUFDakIsUUFBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hDLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0QixXQUFPLElBQUksQ0FBQztHQUNiLENBQUE7O0FBR0QsR0FBQyxDQUFDLFVBQVUsR0FBRyxZQUFVO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFTLE9BQU8sRUFBQztBQUMvQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN0QixDQUFDLENBQUM7R0FDSixDQUFBOztBQUVELEdBQUMsQ0FBQyxHQUFHLEdBQUcsWUFBVTtBQUNoQixRQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7QUFHMUIsV0FBTyxFQUFFLENBQUM7R0FDWCxDQUFBOztBQUVELEdBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBUyxHQUFHLEVBQUUsR0FBRyxFQUFDO0FBQ3pCLFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUM7QUFDbkMsVUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBQztBQUM5QixXQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2hCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0gsV0FBTyxHQUFHLENBQUM7R0FDWixDQUFBOztBQUVELEdBQUMsQ0FBQyxjQUFjLEdBQUcsVUFBUyxJQUFJLEVBQUM7QUFDL0IsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUV0QixTQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixVQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUM7QUFDNUIsZUFBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN2QztLQUNGO0FBQ0QsV0FBTyxDQUFDLENBQUMsQ0FBQztHQUNYLENBQUE7O0FBRUQsR0FBQyxDQUFDLE9BQU8sR0FBRyxZQUFVO0FBQ3BCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxHQUFHLEFBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxHQUFHLENBQUM7O0FBRVIsU0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLFVBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsVUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUNmO0dBQ0YsQ0FBQTs7QUFFRCxTQUFPLElBQUksQ0FBQztDQUNiLENBQUEsRUFBRyxDQUFDOztBQUVMLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7OztBQ3pHdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxZQUFVO0FBQ3JCLE1BQUksS0FBSyxHQUFHLFNBQVIsS0FBSyxHQUFhO0FBQ3BCLFFBQUcsRUFBRSxJQUFJLFlBQVksS0FBSyxDQUFBLEFBQUMsRUFBQztBQUMxQixhQUFRLElBQUksS0FBSyxFQUFFLENBQUU7S0FDdEI7Ozs7O0FBS0QsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDbEIsQ0FBQztBQUNGLE1BQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7Ozs7Ozs7QUFPeEIsR0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDaEIsR0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRWIsR0FBQyxDQUFDLEdBQUcsR0FBRyxVQUFTLElBQUksRUFBQztBQUNwQixRQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDcEIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsR0FBRyxHQUFHLFlBQVU7QUFDaEIsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0dBQ3BCLENBQUE7O0FBRUQsR0FBQyxDQUFDLFFBQVEsR0FBRyxZQUFVO0FBQ3JCLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQixXQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7R0FDcEIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsV0FBVyxHQUFHLFlBQVU7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsVUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDaEM7R0FDRixDQUFBOztBQUVELEdBQUMsQ0FBQyxXQUFXLEdBQUcsVUFBUyxJQUFJLEVBQUM7QUFDNUIsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLFVBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdEQ7QUFDRCxXQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ1gsQ0FBQTs7QUFFRCxHQUFDLENBQUMsV0FBVyxHQUFHLFVBQVMsT0FBTyxFQUFFLE9BQU8sRUFBQztBQUN4QyxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQzdCLFdBQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNyQixXQUFPLE9BQU8sQ0FBQztHQUNoQixDQUFBOztBQUVELEdBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBUyxFQUFFLEVBQUM7QUFDdEIsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFDLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsVUFBRyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDO0tBQ3BDO0FBQ0QsV0FBTyxDQUFDLENBQUMsQ0FBQztHQUNYLENBQUE7O0FBRUQsR0FBQyxDQUFDLFNBQVMsR0FBRyxZQUFXO0FBQ3ZCLFFBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDOUIsT0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBRTtBQUN6QixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkIsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsV0FBTyxHQUFHLENBQUM7R0FDWixDQUFBOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2QsQ0FBQSxFQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Ozs7Ozs7O0FDMUV2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRzdCLElBQUksSUFBSSxHQUFHLENBQUMsWUFBVTtBQUNwQixNQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBYTtBQUNuQixRQUFHLEVBQUUsSUFBSSxZQUFZLElBQUksQ0FBQSxBQUFDLEVBQUM7QUFDekIsYUFBUSxJQUFJLElBQUksRUFBRSxDQUFFO0tBQ3JCOzs7OztBQUtELFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0dBQ2pCLENBQUM7QUFDRixNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDOzs7Ozs7QUFNdkIsR0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWYsR0FBQyxDQUFDLEdBQUcsR0FBRyxVQUFTLElBQUksRUFBQztBQUNwQixRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUN2QixDQUFBOztBQUVELEdBQUMsQ0FBQyxRQUFRLEdBQUcsWUFBVTtBQUNyQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDbkIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsT0FBTyxHQUFHLFVBQVMsRUFBRSxFQUFFO0FBQ3ZCLFNBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbEMsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLFVBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQztLQUNyQztBQUNELFdBQU8sQ0FBQyxDQUFDLENBQUM7R0FDWCxDQUFBOztBQUVELEdBQUMsQ0FBQyxNQUFNLEdBQUcsVUFBUyxFQUFFLEVBQUM7QUFDckIsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7QUFHdEIsTUFBRSxHQUFHLEVBQUUsWUFBWSxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQzs7QUFFMUMsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QixVQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVM7QUFDekMsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEM7O0FBRUQsV0FBTyxDQUFDLENBQUMsQ0FBQztHQUNYLENBQUE7O0FBRUQsR0FBQyxDQUFDLGFBQWEsR0FBRyxZQUFVO0FBQzFCLFFBQUksR0FBRyxHQUFHLEFBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFJLENBQUMsQ0FBQztBQUNsRCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDeEIsQ0FBQTs7QUFFRCxHQUFDLENBQUMsU0FBUyxHQUFHLFlBQVU7QUFDdEIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztHQUMxQixDQUFBOztBQUVELEdBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBVTtBQUNuQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0dBQzFCLENBQUE7O0FBRUQsR0FBQyxDQUFDLElBQUksR0FBRyxVQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDMUIsUUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUM7QUFDL0IsVUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBQztBQUM5QixXQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2hCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0gsV0FBTyxHQUFHLENBQUM7R0FDWixDQUFBOztBQUdELFNBQU8sSUFBSSxDQUFDO0NBQ2IsQ0FBQSxFQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7O0FDbEZ0QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN4QyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNwRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFHbEQsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFVO0FBQzNCLE1BQUksSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDO0FBQzlCLFlBQVUsQ0FBQyxZQUFVO0FBQ25CLFVBQU0sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNyQyxTQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ1gsU0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUM1QixTQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFNBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUMxQyxTQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQzNCLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsNkJBQTZCLEVBQUUsWUFBVTtBQUMxQyxRQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3RCLGVBQVMsRUFBRSxNQUFNO0tBQ2xCLENBQUMsQ0FBQTtBQUNGLFVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzVCLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsNkNBQTZDLEVBQUUsWUFBVTtBQUMxRCxRQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ3RCLGVBQVMsRUFBRSxNQUFNO0FBQ2pCLFlBQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87S0FDMUIsQ0FBQyxDQUFBO0FBQ0YsVUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDNUIsQ0FBQyxDQUFBO0NBR0gsQ0FBQyxDQUFBOzs7OztBQ2hDRixPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXhCLENBQUMsU0FBUyxJQUFJLEdBQUUsRUFFZixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgXCJhZ2lsZVwiOiB7XHJcblxyXG4gIH0sXHJcbiAgXCJtZWRpY1wiOiB7XHJcbiAgICB3YWl0UmVzcG9uc2U6IHRydWUsXHJcbiAgICBvbkFmdGVyUGxhY2U6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgdmFyIGRpc2NhcmQgPSB0aGlzLmdldERpc2NhcmQoKTtcclxuXHJcbiAgICAgIGRpc2NhcmQgPSB0aGlzLmZpbHRlcihkaXNjYXJkLCB7XHJcbiAgICAgICAgXCJhYmlsaXR5XCI6IFwiaGVyb1wiLFxyXG4gICAgICAgIFwidHlwZVwiOiBjYXJkLmNvbnN0cnVjdG9yLlRZUEUuU1BFQ0lBTFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGhpcy5zZW5kKFwicGxheWVkOm1lZGljXCIsIHtcclxuICAgICAgICBjYXJkczogSlNPTi5zdHJpbmdpZnkoZGlzY2FyZClcclxuICAgICAgfSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBcIm1vcmFsZV9ib29zdFwiOiB7XHJcbiAgICAgIG9uQWZ0ZXJQbGFjZTogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICB2YXIgZmllbGQgPSB0aGlzLmZpZWxkW2NhcmQuZ2V0VHlwZSgpXTtcclxuICAgICAgdmFyIGNhcmRzID0gZmllbGQuZ2V0KCk7XHJcblxyXG4gICAgICBjYXJkcy5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKSB7XHJcbiAgICAgICAgaWYoX2NhcmQuZ2V0SUQoKSA9PSBjYXJkLmdldElEKCkpIHJldHVybjtcclxuICAgICAgICBpZihfY2FyZC5nZXRSYXdQb3dlcigpID09PSAtMSkgcmV0dXJuO1xyXG4gICAgICAgIF9jYXJkLmJvb3N0KDEpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJtdXN0ZXJcIjoge1xyXG4gICAgbmFtZTogXCJtdXN0ZXJcIixcclxuICAgIG9uQWZ0ZXJQbGFjZTogZnVuY3Rpb24oY2FyZCl7XHJcbiAgICAgIHZhciBtdXN0ZXJUeXBlID0gY2FyZC5nZXRNdXN0ZXJUeXBlKCk7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBjYXJkc0RlY2sgPSB0aGlzLmRlY2suZmluZChcIm11c3RlclR5cGVcIiwgbXVzdGVyVHlwZSk7XHJcbiAgICAgIHZhciBjYXJkc0hhbmQgPSB0aGlzLmhhbmQuZmluZChcIm11c3RlclR5cGVcIiwgbXVzdGVyVHlwZSk7XHJcblxyXG4gICAgICBjYXJkc0RlY2suZm9yRWFjaChmdW5jdGlvbihfY2FyZCkge1xyXG4gICAgICAgIHNlbGYuZGVjay5yZW1vdmVGcm9tRGVjayhfY2FyZCk7XHJcbiAgICAgICAgc2VsZi5wbGFjZUNhcmQoX2NhcmQsIHtcclxuICAgICAgICAgIHN1cHByZXNzOiBcIm11c3RlclwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIGNhcmRzSGFuZC5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKSB7XHJcbiAgICAgICAgc2VsZi5oYW5kLnJlbW92ZShfY2FyZCk7XHJcbiAgICAgICAgc2VsZi5wbGFjZUNhcmQoX2NhcmQsIHtcclxuICAgICAgICAgIHN1cHByZXNzOiBcIm11c3RlclwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBcInRpZ2h0X2JvbmRcIjoge1xyXG4gICAgb25BZnRlclBsYWNlOiBmdW5jdGlvbihjYXJkKXtcclxuICAgICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZFtjYXJkLmdldFR5cGUoKV07XHJcbiAgICAgIHZhciBjYXJkcyA9IGZpZWxkLmdldCgpO1xyXG4gICAgICB2YXIgbGFzdEluc2VydCA9IGNhcmRzLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmKGxhc3RJbnNlcnQgPCAyKSByZXR1cm47XHJcblxyXG4gICAgICBpZihjYXJkc1tsYXN0SW5zZXJ0IC0gMl0uZ2V0TmFtZSgpID09IGNhcmRzW2xhc3RJbnNlcnQgLSAxXS5nZXROYW1lKCkpe1xyXG4gICAgICAgIGNhcmRzW2xhc3RJbnNlcnQgLSAyXS5ib29zdCgrY2FyZHNbbGFzdEluc2VydCAtIDJdLmdldFBvd2VyKCkpO1xyXG4gICAgICAgIGNhcmRzW2xhc3RJbnNlcnQgLSAxXS5ib29zdCgrY2FyZHNbbGFzdEluc2VydCAtIDFdLmdldFBvd2VyKCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBcInNweVwiOiB7XHJcbiAgICBjaGFuZ2VTaWRlOiB0cnVlLFxyXG4gICAgb25BZnRlclBsYWNlOiBmdW5jdGlvbihjYXJkKXtcclxuICAgICAgdGhpcy5kcmF3KDIpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJ3ZWF0aGVyX2ZvZ1wiOiB7XHJcbiAgICBvbkVhY2hUdXJuOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgIHZhciB0YXJnZXRSb3cgPSBjYXJkLmNvbnN0cnVjdG9yLlRZUEUuUkFOR0VEO1xyXG4gICAgICB2YXIgZm9yY2VkUG93ZXIgPSAxO1xyXG4gICAgICB2YXIgZmllbGQxID0gdGhpcy5maWVsZFt0YXJnZXRSb3ddLmdldCgpO1xyXG4gICAgICB2YXIgZmllbGQyID0gdGhpcy5mb2UuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuXHJcbiAgICAgIHZhciBmaWVsZCA9IGZpZWxkMS5jb25jYXQoZmllbGQyKTtcclxuXHJcbiAgICAgIGZpZWxkLmZvckVhY2goZnVuY3Rpb24oX2NhcmQpIHtcclxuICAgICAgICBpZihfY2FyZC5nZXRSYXdBYmlsaXR5KCkgPT0gXCJoZXJvXCIpIHJldHVybjtcclxuICAgICAgICBfY2FyZC5zZXRGb3JjZWRQb3dlcihmb3JjZWRQb3dlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uRWFjaENhcmRQbGFjZTogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICB2YXIgdGFyZ2V0Um93ID0gY2FyZC5jb25zdHJ1Y3Rvci5UWVBFLlJBTkdFRDtcclxuICAgICAgdmFyIGZvcmNlZFBvd2VyID0gMTtcclxuICAgICAgdmFyIGZpZWxkMSA9IHRoaXMuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuICAgICAgdmFyIGZpZWxkMiA9IHRoaXMuZm9lLmZpZWxkW3RhcmdldFJvd10uZ2V0KCk7XHJcblxyXG4gICAgICB2YXIgZmllbGQgPSBmaWVsZDEuY29uY2F0KGZpZWxkMik7XHJcblxyXG4gICAgICBmaWVsZC5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKSB7XHJcbiAgICAgICAgaWYoX2NhcmQuZ2V0UmF3QWJpbGl0eSgpID09IFwiaGVyb1wiKSByZXR1cm47XHJcbiAgICAgICAgX2NhcmQuc2V0Rm9yY2VkUG93ZXIoZm9yY2VkUG93ZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIFwid2VhdGhlcl9yYWluXCI6IHtcclxuICAgIG9uRWFjaFR1cm46IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgdmFyIHRhcmdldFJvdyA9IGNhcmQuY29uc3RydWN0b3IuVFlQRS5TSUVHRTtcclxuICAgICAgdmFyIGZvcmNlZFBvd2VyID0gMTtcclxuICAgICAgdmFyIGZpZWxkMSA9IHRoaXMuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuICAgICAgdmFyIGZpZWxkMiA9IHRoaXMuZm9lLmZpZWxkW3RhcmdldFJvd10uZ2V0KCk7XHJcblxyXG4gICAgICB2YXIgZmllbGQgPSBmaWVsZDEuY29uY2F0KGZpZWxkMik7XHJcblxyXG4gICAgICBmaWVsZC5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKSB7XHJcbiAgICAgICAgaWYoX2NhcmQuZ2V0UmF3QWJpbGl0eSgpID09IFwiaGVyb1wiKSByZXR1cm47XHJcbiAgICAgICAgX2NhcmQuc2V0Rm9yY2VkUG93ZXIoZm9yY2VkUG93ZXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgfSxcclxuICBcIndlYXRoZXJfZnJvc3RcIjoge1xyXG4gICAgb25FYWNoVHVybjogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICB2YXIgdGFyZ2V0Um93ID0gY2FyZC5jb25zdHJ1Y3Rvci5UWVBFLkNMT1NFX0NPTUJBVDtcclxuICAgICAgdmFyIGZvcmNlZFBvd2VyID0gMTtcclxuICAgICAgdmFyIGZpZWxkMSA9IHRoaXMuZmllbGRbdGFyZ2V0Um93XS5nZXQoKTtcclxuICAgICAgdmFyIGZpZWxkMiA9IHRoaXMuZm9lLmZpZWxkW3RhcmdldFJvd10uZ2V0KCk7XHJcblxyXG4gICAgICB2YXIgZmllbGQgPSBmaWVsZDEuY29uY2F0KGZpZWxkMik7XHJcblxyXG4gICAgICBmaWVsZC5mb3JFYWNoKGZ1bmN0aW9uKF9jYXJkKSB7XHJcbiAgICAgICAgaWYoX2NhcmQuZ2V0UmF3QWJpbGl0eSgpID09IFwiaGVyb1wiKSByZXR1cm47XHJcbiAgICAgICAgX2NhcmQuc2V0Rm9yY2VkUG93ZXIoZm9yY2VkUG93ZXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImNsZWFyX3dlYXRoZXJcIjoge1xyXG4gICAgb25BZnRlclBsYWNlOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgIHZhciB0YXJnZXRSb3cgPSBjYXJkLmNvbnN0cnVjdG9yLlRZUEUuV0VBVEhFUjtcclxuICAgICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZFt0YXJnZXRSb3ddLmdldCgpO1xyXG5cclxuICAgICAgLy90b2RvOiByZW1vdmUgd2VhdGhlciBjYXJkc1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJkZWNveVwiOiB7XHJcbiAgICByZXBsYWNlV2l0aDogdHJ1ZVxyXG4gIH0sXHJcbiAgXCJmb2x0ZXN0X2xlYWRlcjFcIjoge1xyXG4gICAgb25BY3RpdmF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBjYXJkcyA9IHRoaXMuZGVjay5maW5kKFwia2V5XCIsIFwiaW1wZW5ldHJhYmxlX2ZvZ1wiKVxyXG4gICAgICBpZighY2FyZHMubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgIHZhciBjYXJkID0gdGhpcy5kZWNrLnJlbW92ZUZyb21EZWNrKGNhcmRzWzBdKTtcclxuICAgICAgdGhpcy5wbGFjZUNhcmQoY2FyZCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBcImZyYW5jZXNjYV9sZWFkZXIxXCI6IHtcclxuXHJcbiAgfSxcclxuICBcImZyYW5jZXNjYV9sZWFkZXIyXCI6IHtcclxuXHJcbiAgfSxcclxuICBcImZyYW5jZXNjYV9sZWFkZXIzXCI6IHtcclxuXHJcbiAgfSxcclxuICBcImZyYW5jZXNjYV9sZWFkZXI0XCI6IHtcclxuXHJcbiAgfSxcclxuICBcImVyZWRpbl9sZWFkZXIxXCI6IHtcclxuXHJcbiAgfSxcclxuICBcImVyZWRpbl9sZWFkZXIyXCI6IHtcclxuXHJcbiAgfSxcclxuICBcImVyZWRpbl9sZWFkZXIzXCI6IHtcclxuXHJcbiAgfSxcclxuICBcImVyZWRpbl9sZWFkZXI0XCI6IHtcclxuXHJcbiAgfSxcclxuICBcImhlcm9cIjoge1xyXG5cclxuICB9XHJcbn0iLCIvKipcclxuICogdHlwZXNcclxuICogMCBjbG9zZSBjb21iYXRcclxuICogMSByYW5nZWRcclxuICogMiBzaWVnZVxyXG4gKiAzIGxlYWRlclxyXG4gKiA0IHNwZWNpYWwgKGRlY295KVxyXG4gKiA1IHdlYXRoZXJcclxuICovXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgXCJyZWRhbmlhbl9mb290X3NvbGRpZXJcIjoge1xyXG4gICAgbmFtZTogXCJSZWRhbmlhbiBGb290IFNvbGRpZXJcIixcclxuICAgIHBvd2VyOiAxLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJmb290X3NvbGRpZXIxXCIsXHJcbiAgICBmYWN0aW9uOiBcIk5vcnRoZXJuIFJlYWxtXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcInBvb3JfZnVja2luZ19pbmZhbnRyeVwiOiB7XHJcbiAgICBuYW1lOiBcIlBvb3IgRnVja2luZyBJbmZhbnRyeVwiLFxyXG4gICAgcG93ZXI6IDEsXHJcbiAgICBhYmlsaXR5OiBcInRpZ2h0X2JvbmRcIixcclxuICAgIGltZzogXCJpbmZhbnRyeVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ5YXJwZW5femlncmluXCI6IHtcclxuICAgIG5hbWU6IFwiWWFycGVuIFppZ3JpblwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInlhcnBlblwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJibHVlX3N0cmlwZXNfY29tbWFuZG9cIjoge1xyXG4gICAgbmFtZTogXCJCbHVlIFN0cmlwZXMgQ29tbWFuZG9cIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogXCJ0aWdodF9ib25kXCIsXHJcbiAgICBpbWc6IFwiY29tbWFuZG9cIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwic2lnaXNtdW50X2RpamtzdHJhXCI6IHtcclxuICAgIG5hbWU6IFwiU2lnaXNtdW50IERpamtzdHJhXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IFwic3B5XCIsXHJcbiAgICBpbWc6IFwiZGlqa3N0cmFcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwicHJpbmNlX3N0ZW5uaXNcIjoge1xyXG4gICAgbmFtZTogXCJQcmluY2UgU3Rlbm5pc1wiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBcInNweVwiLFxyXG4gICAgaW1nOiBcInN0ZW5uaXNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwic2llZ2ZyaWVkX29mX2RlbmVzbGVcIjoge1xyXG4gICAgbmFtZTogXCJTaWVnZnJpZWQgb2YgRGVuZXNsZVwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNpZWdmcmllZFwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ2ZXNcIjoge1xyXG4gICAgbmFtZTogXCJWZXNcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJ2ZXNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwidmVybm9uX3JvY2hlXCI6IHtcclxuICAgIG5hbWU6IFwiVmVybm9uIFJvY2hlXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJyb2NoZVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJqb2huX25hdGFsaXNcIjoge1xyXG4gICAgbmFtZTogXCJKb2huIE5hdGFsaXNcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcIm5hdGFsaXNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwic2hlbGRvbl9za2FnZ3NcIjoge1xyXG4gICAgbmFtZTogXCJTaGVsZG9uIFNrYWdnc1wiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNrYWdnc1wiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJzYWJyaW5hX2dsZXZpc3NpZ1wiOiB7XHJcbiAgICBuYW1lOiBcIlNhYnJpbmEgR2xldmlzc2lnXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwic2FicmluYVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJjcmluZnJpZF9yZWF2ZXJzX2RyYWdvbl9odW50ZXJcIjoge1xyXG4gICAgbmFtZTogXCJDcmluZnJpZCBSZWF2ZXIncyBEcmFnb24gSHVudGVyXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IFwidGlnaHRfYm9uZFwiLFxyXG4gICAgaW1nOiBcImNyaW5mcmlkXCIsXHJcbiAgICBmYWN0aW9uOiBcIk5vcnRoZXJuIFJlYWxtXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcInNpbGVfZGVfdGFuc2FydmlsbGVcIjoge1xyXG4gICAgbmFtZTogXCJTw61sZSBkZSBUYW5zYXJ2aWxsZVwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInNpbGVcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwia2VpcmFfbWV0elwiOiB7XHJcbiAgICBuYW1lOiBcIktlaXJhIE1ldHpcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJrZWlyYVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJkZXRobW9sZFwiOiB7XHJcbiAgICBuYW1lOiBcIkRldGhtb2xkXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZGV0aG1vbGRcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwia2FlZHdlbmlfc2llZ2VfZXhwZXJ0XCI6IHtcclxuICAgIG5hbWU6IFwiS2FlZHdlbmkgU2llZ2UgRXhwZXJ0XCIsXHJcbiAgICBwb3dlcjogMSxcclxuICAgIGFiaWxpdHk6IFwibW9yYWxlX2Jvb3N0XCIsXHJcbiAgICBpbWc6IFwic2llZ2VfZXhwZXJ0MVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJkdW5fYmFubmVyX21lZGljXCI6IHtcclxuICAgIG5hbWU6IFwiRHVuIEJhbm5lciBNZWRpY1wiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBcIm1lZGljXCIsXHJcbiAgICBpbWc6IFwibWVkaWNcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDJcclxuICB9LFxyXG4gIFwiYmFsbGlzdGFcIjoge1xyXG4gICAgbmFtZTogXCJCYWxsaXN0YVwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImJhbGxpc3RhMVwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJ0cmVidWNoZXRcIjoge1xyXG4gICAgbmFtZTogXCJUcmVidWNoZXRcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJ0cmVidWNoZXQxXCIsXHJcbiAgICBmYWN0aW9uOiBcIk5vcnRoZXJuIFJlYWxtXCIsXHJcbiAgICB0eXBlOiAyXHJcbiAgfSxcclxuICBcInRoYWxlclwiOiB7XHJcbiAgICBuYW1lOiBcIlRoYWxlclwiLFxyXG4gICAgcG93ZXI6IDEsXHJcbiAgICBhYmlsaXR5OiBcInNweVwiLFxyXG4gICAgaW1nOiBcInRoYWxlclwiLFxyXG4gICAgZmFjdGlvbjogXCJOb3J0aGVybiBSZWFsbVwiLFxyXG4gICAgdHlwZTogMlxyXG4gIH0sXHJcbiAgXCJmb2x0ZXN0X2tpbmdfb2ZfdGVtZXJpYVwiOiB7XHJcbiAgICBuYW1lOiBcIkZvbHRlc3Q6IEtpbmcgb2YgVGVtZXJpYVwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJmb2x0ZXN0X2xlYWRlcjFcIixcclxuICAgIGltZzogXCJmb2x0ZXN0X2tpbmdcIixcclxuICAgIGZhY3Rpb246IFwiTm9ydGhlcm4gUmVhbG1cIixcclxuICAgIHR5cGU6IDNcclxuICB9LFxyXG4gIFwiZGVjb3lcIjoge1xyXG4gICAgbmFtZTogXCJEZWNveVwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJkZWNveVwiLFxyXG4gICAgaW1nOiBcImRlY295XCIsXHJcbiAgICBmYWN0aW9uOiBudWxsLFxyXG4gICAgdHlwZTogNFxyXG4gIH0sXHJcbiAgXCJpbXBlbmV0cmFibGVfZm9nXCI6IHtcclxuICAgIG5hbWU6IFwiSW1wZW5ldHJhYmxlIEZvZ1wiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJ3ZWF0aGVyX2ZvZ1wiLFxyXG4gICAgaW1nOiBcImZvZ1wiLFxyXG4gICAgZmFjdGlvbjogbnVsbCxcclxuICAgIHR5cGU6IDVcclxuICB9LFxyXG5cclxuXHJcbiAgXCJmcmFuY2VzY2FfcHVyZWJsb29kX2VsZlwiOiB7XHJcbiAgICBuYW1lOiBcIkZyYW5jZXNjYSwgUHVyZWJsb29kIEVsZlwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJmcmFuY2VzY2FfbGVhZGVyMVwiLFxyXG4gICAgaW1nOiBcImZyYW5jZXNjYV9wdXJlYmxvb2RcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogM1xyXG4gIH0sXHJcbiAgXCJmcmFuY2VzY2FfdGhlX2JlYXV0aWZ1bFwiOiB7XHJcbiAgICBuYW1lOiBcIkZyYW5jZXNjYSBUaGUgQmVhdXRpZnVsXCIsXHJcbiAgICBwb3dlcjogLTEsXHJcbiAgICBhYmlsaXR5OiBcImZyYW5jZXNjYV9sZWFkZXIyXCIsXHJcbiAgICBpbWc6IFwiZnJhbmNlc2NhX2JlYXRpZnVsXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDNcclxuICB9LFxyXG4gIFwiZnJhbmNlc2NhX2RhaXN5X29mX3RoZV92YWxsZXlcIjoge1xyXG4gICAgbmFtZTogXCJGcmFuY2VzY2EsIERhaXN5IG9mIFRoZSBWYWxsZXlcIixcclxuICAgIHBvd2VyOiAtMSxcclxuICAgIGFiaWxpdHk6IFwiZnJhbmNlc2NhX2xlYWRlcjNcIixcclxuICAgIGltZzogXCJmcmFuY2VzY2FfZGFpc3lcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogM1xyXG4gIH0sXHJcbiAgXCJmcmFuY2VzY2FfcXVlZW5fb2ZfZG9sX2JsYXRoYW5uYVwiOiB7XHJcbiAgICBuYW1lOiBcIkZyYW5jZXNjYSwgUXVlZW4gb2YgRG9sIEJsYXRoYW5uYVwiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJmcmFuY2VzY2FfbGVhZGVyNFwiLFxyXG4gICAgaW1nOiBcImZyYW5jZXNjYV9xdWVlblwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAzXHJcbiAgfSxcclxuICBcInNhZXNlbnRoZXNzaXNcIjoge1xyXG4gICAgbmFtZTogXCJTYWVzZW50aGVzc2lzXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJzYWVzZW50aGVzc2lzXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiaW9ydmV0aFwiOiB7XHJcbiAgICBuYW1lOiBcIklvcnZldGhcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcImlvcnZldGhcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJpc2VuZ3JpbV9mYW9pbHRpYXJuYWhcIjoge1xyXG4gICAgbmFtZTogXCJJc2VuZ3JpbSBGYW9pbHRpYXJuYWhcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFtcImhlcm9cIiwgXCJtb3JhbGVfYm9vc3RcIl0sXHJcbiAgICBpbWc6IFwiaXNlbmdyaW1cIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJlaXRobmVcIjoge1xyXG4gICAgbmFtZTogXCJFaXRobmVcIixcclxuICAgIHBvd2VyOiAxMCxcclxuICAgIGFiaWxpdHk6IFwiaGVyb1wiLFxyXG4gICAgaW1nOiBcImVpdGhuZVwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImhhdmVrYXJfaGVhbGVyXCI6IHtcclxuICAgIG5hbWU6IFwiSGF2ZWthciBIZWFsZXJcIixcclxuICAgIHBvd2VyOiAwLFxyXG4gICAgYWJpbGl0eTogXCJtb3JhbGVfYm9vc3RcIixcclxuICAgIGltZzogXCJoZWFsZXJcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJyaW9yZGFpblwiOiB7XHJcbiAgICBuYW1lOiBcIlJpb3JkYWluXCIsXHJcbiAgICBwb3dlcjogMSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwicmlvcmRhaW5cIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJ0b3J1dmllbFwiOiB7XHJcbiAgICBuYW1lOiBcIlRvcnV2aWVsXCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwidG9ydXZpZWxcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJlbHZlbl9za2lybWlzaGVyXCI6IHtcclxuICAgIG5hbWU6IFwiRWx2ZW4gU2tpcm1pc2hlclwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJza2lybWlzaGVyXCIsXHJcbiAgICBpbWc6IFwiZWx2ZW5fc2tpcm1pc2hlcjJcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJkd2FydmVuX3NraXJtaXNoZXJcIjoge1xyXG4gICAgbmFtZTogXCJEd2FydmVuIFNraXJtaXNoZXJcIixcclxuICAgIHBvd2VyOiAzLFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwic2tpcm1pc2hlclwiLFxyXG4gICAgaW1nOiBcInNraXJtaXNoZXIyXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiY2lhcmFuX2FlcF9lYXNuaWxsaWVuXCI6IHtcclxuICAgIG5hbWU6IFwiQ2lhcmFuIGFlcCBFYXNuaWxsaWVuXCIsXHJcbiAgICBwb3dlcjogMyxcclxuICAgIGFiaWxpdHk6IFwiYWdpbGVcIixcclxuICAgIGltZzogXCJlYXNuaWxsaWVuXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwidnJpaGVkZF9icmlnYWRlX3JlY3J1aXRcIjoge1xyXG4gICAgbmFtZTogXCJWcmloZWRkIEJyaWdhZGUgUmVjcnVpdFwiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcInJlY3J1aXRcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJkb2xfYmxhdGhhbm5hX2FyY2hlclwiOiB7XHJcbiAgICBuYW1lOiBcIkRvbCBCbGF0aGFubmEgQXJjaGVyXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiYXJjaGVyXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDFcclxuICB9LCAvKlxyXG4gIFwiaGF2X2NhYXJlbl9tZWRpY1wiOiB7XHJcbiAgICBuYW1lOiBcIkhhduKAmWNhYXJlbiBNZWRpY1wiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcIlwiLCAvL21pc3NpbmcgaW1hZ2VcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sKi9cclxuICBcImhhdmVrYXJfc211Z2dsZXJcIjoge1xyXG4gICAgbmFtZTogXCJIYXZla2FyIFNtdWdnbGVyXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IFwic3B5XCIsXHJcbiAgICBpbWc6IFwic211Z2dsZXIxXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwibWFoYWthbWFuX2RlZmVuZGVyXCI6IHtcclxuICAgIG5hbWU6IFwiTWFoYWthbWFuIERlZmVuZGVyXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcImRlZmVuZGVyXCIsXHJcbiAgICBpbWc6IFwiZGVmZW5kZXIyXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwidnJpaGVkZF9icmlnYWRlX3ZldGVyYW5cIjoge1xyXG4gICAgbmFtZTogXCJWcmloZWRkIEJyaWdhZGUgVmV0ZXJhblwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBcImFnaWxlXCIsXHJcbiAgICBpbWc6IFwidmV0ZXJhbjFcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJkZW5uaXNfY3Jhbm1lclwiOiB7XHJcbiAgICBuYW1lOiBcIkRlbm5pcyBDcmFubWVyXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiY3Jhbm1lclwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImZpbGF2YW5kcmVsX2Flbl9maWRoYWlsXCI6IHtcclxuICAgIG5hbWU6IFwiRmlsYXZhbmRyZWwgYcOpbiBGaWRow6FpbFwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBcImFnaWxlXCIsXHJcbiAgICBpbWc6IFwiZmlkaGFpbFwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImlkYV9lbWVhbl9hZXBfc2l2bmV5XCI6IHtcclxuICAgIG5hbWU6IFwiSWRhIEVtZWFuIGFlcCBTaXZuZXlcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJzaXZuZXlcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJ5YWV2aW5uXCI6IHtcclxuICAgIG5hbWU6IFwiWWFldmlublwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBcImFnaWxlXCIsXHJcbiAgICBpbWc6IFwieWFldmlublwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImJhcmNsYXlfZWxzXCI6IHtcclxuICAgIG5hbWU6IFwiQmFyY2xheSBFbHNcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogXCJhZ2lsZVwiLFxyXG4gICAgaW1nOiBcImJhcmNsYXlcIixcclxuICAgIGZhY3Rpb246IFwiU2NvaWEndGFlbFwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJkb2xfYmxhdGhhbm5hX3Njb3V0XCI6IHtcclxuICAgIG5hbWU6IFwiRG9sIEJsYXRoYW5uYSBTY291dFwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBcImFnaWxlXCIsXHJcbiAgICBpbWc6IFwic2NvdXQyXCIsXHJcbiAgICBmYWN0aW9uOiBcIlNjb2lhJ3RhZWxcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwibWlsdmFcIjoge1xyXG4gICAgbmFtZTogXCJNaWx2YVwiLFxyXG4gICAgcG93ZXI6IDEwLFxyXG4gICAgYWJpbGl0eTogXCJtb3JhbGVfYm9vc3RcIixcclxuICAgIGltZzogXCJtaWx2YVwiLFxyXG4gICAgZmFjdGlvbjogXCJTY29pYSd0YWVsXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuXHJcblxyXG4gIFwiZXJlZGluX2NvbW1hbmRlcl9vZl90aGVfcmVkX3JpZGVyc1wiOiB7XHJcbiAgICBuYW1lOiBcIkVyZWRpbiwgQ29tbWFuZGVyIG9mIHRoZSBSZWQgUmlkZXJzXCIsXHJcbiAgICBwb3dlcjogLTEsXHJcbiAgICBhYmlsaXR5OiBcImVyZWRpbl9sZWFkZXIxXCIsXHJcbiAgICBpbWc6IFwiZXJlZGluX2NvbW1hbmRlclwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAzXHJcbiAgfSxcclxuICBcImVyZWRpbl9icmluZ2VyX29mX2RlYXRoXCI6IHtcclxuICAgIG5hbWU6IFwiRXJlZGluLCBCcmluZ2VyIG9mIERlYXRoXCIsXHJcbiAgICBwb3dlcjogLTEsXHJcbiAgICBhYmlsaXR5OiBcImVyZWRpbl9sZWFkZXIyXCIsXHJcbiAgICBpbWc6IFwiZXJlZGluX2JyaW5nZXJcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogM1xyXG4gIH0sXHJcbiAgXCJlcmVkaW5fZGVzdHJveWVyX29mX3dvcmxkc1wiOiB7XHJcbiAgICBuYW1lOiBcIkVyZWRpbiwgRGVzdHJveWVyIG9mIFdvcmxkc1wiLFxyXG4gICAgcG93ZXI6IC0xLFxyXG4gICAgYWJpbGl0eTogXCJlcmVkaW5fbGVhZGVyM1wiLFxyXG4gICAgaW1nOiBcImVyZWRpbl9kZXN0cm95ZXJcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogM1xyXG4gIH0sXHJcbiAgXCJlcmVkaW5fa2luZ19vZl90aGVfd2lsZF9odW50XCI6IHtcclxuICAgIG5hbWU6IFwiRXJlZGluLCBLaW5nIG9mIFRoZSBXaWxkIEh1bnRcIixcclxuICAgIHBvd2VyOiAtMSxcclxuICAgIGFiaWxpdHk6IFwiZXJlZGluX2xlYWRlcjRcIixcclxuICAgIGltZzogXCJlcmVkaW5fa2luZ1wiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAzXHJcbiAgfSxcclxuICBcImtheXJhblwiOiB7XHJcbiAgICBuYW1lOiBcIktheXJhblwiLFxyXG4gICAgcG93ZXI6IDgsXHJcbiAgICBhYmlsaXR5OiBbXCJoZXJvXCIsIFwibW9yYWxlX2Jvb3N0XCJdLFxyXG4gICAgaW1nOiBcImtheXJhblwiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAxXHJcbiAgfSxcclxuICBcImxlc2hlblwiOiB7XHJcbiAgICBuYW1lOiBcIkxlc2hlblwiLFxyXG4gICAgcG93ZXI6IDEwLFxyXG4gICAgYWJpbGl0eTogXCJoZXJvXCIsXHJcbiAgICBpbWc6IFwibGVzaGVuXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiaW1sZXJpdGhcIjoge1xyXG4gICAgbmFtZTogXCJJbWxlcml0aFwiLFxyXG4gICAgcG93ZXI6IDEwLFxyXG4gICAgYWJpbGl0eTogXCJoZXJvXCIsXHJcbiAgICBpbWc6IFwiaW1sZXJpdGhcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJkcmF1Z1wiOiB7XHJcbiAgICBuYW1lOiBcIkRyYXVnXCIsXHJcbiAgICBwb3dlcjogMTAsXHJcbiAgICBhYmlsaXR5OiBcImhlcm9cIixcclxuICAgIGltZzogXCJkcmF1Z1wiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImdob3VsXCI6IHtcclxuICAgIG5hbWU6IFwiR2hvdWxcIixcclxuICAgIHBvd2VyOiAxLFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwiZ2hvdWxcIixcclxuICAgIGltZzogXCJnaG91bDFcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJuZWtrZXJcIjoge1xyXG4gICAgbmFtZTogXCJOZWtrZXJcIixcclxuICAgIHBvd2VyOiAyLFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwibmVra2VyXCIsXHJcbiAgICBpbWc6IFwibmVra2VyXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwid3l2ZXJuXCI6IHtcclxuICAgIG5hbWU6IFwiV3l2ZXJuXCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwid3l2ZXJuXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiZm9nbGV0XCI6IHtcclxuICAgIG5hbWU6IFwiRm9nbGV0XCIsXHJcbiAgICBwb3dlcjogMixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZm9nbGV0XCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiY2VsYWVub19oYXJweVwiOiB7XHJcbiAgICBuYW1lOiBcIkNlbGFlbm8gSGFycHlcIixcclxuICAgIHBvd2VyOiAyLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJjZWxhZW5vX2hhcnB5XCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiZ2FyZ295bGVcIjoge1xyXG4gICAgbmFtZTogXCJHYXJnb3lsZVwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImdhcmdveWxlXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiY29ja2F0cmljZVwiOiB7XHJcbiAgICBuYW1lOiBcIkNvY2thdHJpY2VcIixcclxuICAgIHBvd2VyOiAyLFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJjb2NrYXRyaWNlXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIFwiaGFycHlcIjoge1xyXG4gICAgbmFtZTogXCJIYXJweVwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBcImFnaWxlXCIsXHJcbiAgICBpbWc6IFwiaGFycHlcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJlbmRyZWdhXCI6IHtcclxuICAgIG5hbWU6IFwiRW5kcmVnYVwiLFxyXG4gICAgcG93ZXI6IDIsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImVuZHJlZ2FcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMVxyXG4gIH0sXHJcbiAgXCJ2YW1waXJlX2JydXhhXCI6IHtcclxuICAgIG5hbWU6IFwiVmFtcGlyZTogQnJ1eGFcIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwidmFtcGlyZVwiLFxyXG4gICAgaW1nOiBcInZhbXBpcmVfYnJ1eGFcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ2YW1waXJlX2ZsZWRlclwiOiB7XHJcbiAgICBuYW1lOiBcIlZhbXBpcmU6IEZsZWRlclwiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJ2YW1waXJlXCIsXHJcbiAgICBpbWc6IFwidmFtcGlyZV9mbGVkZXJcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ2YW1waXJlX2dhcmthaW5cIjoge1xyXG4gICAgbmFtZTogXCJWYW1waXJlOiBHYXJrYWluXCIsXHJcbiAgICBwb3dlcjogNCxcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcInZhbXBpcmVcIixcclxuICAgIGltZzogXCJ2YW1waXJlX2dhcmthaW5cIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJ2YW1waXJlX2VraW1tYXJhXCI6IHtcclxuICAgIG5hbWU6IFwiVmFtcGlyZTogRWtpbW1hcmFcIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwidmFtcGlyZVwiLFxyXG4gICAgaW1nOiBcInZhbXBpcmVfZWtpbW1hcmFcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJhcmFjaGFzXCI6IHtcclxuICAgIG5hbWU6IFwiQXJhY2hhc1wiLFxyXG4gICAgcG93ZXI6IDQsXHJcbiAgICBhYmlsaXR5OiBcIm11c3RlclwiLFxyXG4gICAgbXVzdGVyVHlwZTogXCJhcmFjaGFzXCIsXHJcbiAgICBpbWc6IFwiYXJhY2hhczFcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJib3RjaGxpbmdcIjoge1xyXG4gICAgbmFtZTogXCJCb3RjaGxpbmdcIixcclxuICAgIHBvd2VyOiA0LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJib3RjaGxpbmdcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJmb3JrdGFpbFwiOiB7XHJcbiAgICBuYW1lOiBcIkZvcmt0YWlsXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZm9ya3RhaWxcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJwbGFndWVfbWFpZGVuXCI6IHtcclxuICAgIG5hbWU6IFwiUGxhZ3VlIE1haWRlblwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImZvcmt0YWlsXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiZ3JpZmZpblwiOiB7XHJcbiAgICBuYW1lOiBcIkdyaWZmaW5cIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJncmlmZmluXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwid2VyZXdvbGZcIjoge1xyXG4gICAgbmFtZTogXCJXZXJld29sZlwiLFxyXG4gICAgcG93ZXI6IDUsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcIndlcmV3b2xmXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiZnJpZ2h0ZW5lclwiOiB7XHJcbiAgICBuYW1lOiBcIkZyaWdodGVuZXJcIixcclxuICAgIHBvd2VyOiA1LFxyXG4gICAgYWJpbGl0eTogbnVsbCxcclxuICAgIGltZzogXCJmcmlnaHRlbmVyXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiaWNlX2dpYW50XCI6IHtcclxuICAgIG5hbWU6IFwiSWNlIEdpYW50XCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiaWNlX2dpYW50XCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDJcclxuICB9LFxyXG4gIFwiZ3JhdmVfaGFnXCI6IHtcclxuICAgIG5hbWU6IFwiR3JhdmUgSGFnXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZ3JhdmVfaGFnXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDFcclxuICB9LFxyXG4gIC8qXCJ2YW1waXJlX2thdGFrYW5cIjoge1xyXG4gICAgbmFtZTogXCJWYW1waXJlOiBLYXRha2FuXCIsXHJcbiAgICBwb3dlcjogNSxcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiBtdXN0ZXJUeXBlOiBcInZhbXBpcmVcIixcclxuICAgIGltZzogXCJ2YW1waXJlX2thdGFrYW5cIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sKi9cclxuICBcImNyb25lX3doaXNwZXNzXCI6IHtcclxuICAgIG5hbWU6IFwiQ3JvbmU6IFdoaXNwZXNzXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcImNyb25lXCIsXHJcbiAgICBpbWc6IFwiY3JvbmVfd2hpc3Blc3NcIixcclxuICAgIGZhY3Rpb246IFwibW9uc3RlclwiLFxyXG4gICAgdHlwZTogMFxyXG4gIH0sXHJcbiAgXCJjcm9uZV9icmV3ZXNzXCI6IHtcclxuICAgIG5hbWU6IFwiQ3JvbmU6IEJyZXdlc3NcIixcclxuICAgIHBvd2VyOiA2LFxyXG4gICAgYWJpbGl0eTogXCJtdXN0ZXJcIixcclxuICAgIG11c3RlclR5cGU6IFwiY3JvbmVcIixcclxuICAgIGltZzogXCJjcm9uZV9icmV3ZXNzXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiY3JvbmVfd2VhdmVzc1wiOiB7XHJcbiAgICBuYW1lOiBcIkNyb25lOiBXZWF2ZXNzXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcImNyb25lXCIsXHJcbiAgICBpbWc6IFwiY3JvbmVfd2VhdmVzc1wiLFxyXG4gICAgZmFjdGlvbjogXCJtb25zdGVyXCIsXHJcbiAgICB0eXBlOiAwXHJcbiAgfSxcclxuICBcImFyYWNoYXNfYmVoZW1vdGhcIjoge1xyXG4gICAgbmFtZTogXCJBcmFjaGFzIEJlaGVtb3RoXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IFwibXVzdGVyXCIsXHJcbiAgICBtdXN0ZXJUeXBlOiBcImFyYWNoYXNcIixcclxuICAgIGltZzogXCJhcmFjaGFzX2JlaGVtb3RoXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDJcclxuICB9LFxyXG4gIFwiZmlyZV9lbGVtZW50YWxcIjoge1xyXG4gICAgbmFtZTogXCJGaXJlIEVsZW1lbnRhbFwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImZpcmVfZWxlbWVudGFsXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDJcclxuICB9LFxyXG4gIFwiZmllbmRcIjoge1xyXG4gICAgbmFtZTogXCJGaWVuZFwiLFxyXG4gICAgcG93ZXI6IDYsXHJcbiAgICBhYmlsaXR5OiBudWxsLFxyXG4gICAgaW1nOiBcImZpZW5kXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDBcclxuICB9LFxyXG4gIFwiZWFydGhfZWxlbWVudGFsXCI6IHtcclxuICAgIG5hbWU6IFwiRWFydGggRWxlbWVudGFsXCIsXHJcbiAgICBwb3dlcjogNixcclxuICAgIGFiaWxpdHk6IG51bGwsXHJcbiAgICBpbWc6IFwiZWFydGhfZWxlbWVudGFsXCIsXHJcbiAgICBmYWN0aW9uOiBcIm1vbnN0ZXJcIixcclxuICAgIHR5cGU6IDJcclxuICB9XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIFwibm9ydGhlcm5fcmVhbG1cIjogW1xyXG4gICAgXCJyZWRhbmlhbl9mb290X3NvbGRpZXJcIixcclxuICAgIFwicG9vcl9mdWNraW5nX2luZmFudHJ5XCIsXHJcbiAgICBcInJlZGFuaWFuX2Zvb3Rfc29sZGllclwiLFxyXG4gICAgXCJwb29yX2Z1Y2tpbmdfaW5mYW50cnlcIixcclxuICAgIFwieWFycGVuX3ppZ3JpblwiLFxyXG4gICAgXCJibHVlX3N0cmlwZXNfY29tbWFuZG9cIixcclxuICAgIFwic2lnaXNtdW50X2RpamtzdHJhXCIsXHJcbiAgICBcInByaW5jZV9zdGVubmlzXCIsXHJcbiAgICBcInNpZWdmcmllZF9vZl9kZW5lc2xlXCIsXHJcbiAgICBcInZlc1wiLFxyXG4gICAgXCJ2ZXJub25fcm9jaGVcIixcclxuICAgIFwiam9obl9uYXRhbGlzXCIsXHJcbiAgICBcInNoZWxkb25fc2thZ2dzXCIsXHJcbiAgICBcInNhYnJpbmFfZ2xldmlzc2lnXCIsXHJcbiAgICBcImNyaW5mcmlkX3JlYXZlcnNfZHJhZ29uX2h1bnRlclwiLFxyXG4gICAgXCJzaWxlX2RlX3RhbnNhcnZpbGxlXCIsXHJcbiAgICBcImtlaXJhX21ldHpcIixcclxuICAgIFwiZGV0aG1vbGRcIixcclxuICAgIFwia2FlZHdlbmlfc2llZ2VfZXhwZXJ0XCIsXHJcbiAgICBcImR1bl9iYW5uZXJfbWVkaWNcIixcclxuICAgIFwiYmFsbGlzdGFcIixcclxuICAgIFwidHJlYnVjaGV0XCIsXHJcbiAgICBcInRoYWxlclwiLFxyXG4gICAgXCJmb2x0ZXN0X2tpbmdfb2ZfdGVtZXJpYVwiLFxyXG4gICAgXCJkZWNveVwiLFxyXG4gICAgXCJpbXBlbmV0cmFibGVfZm9nXCJcclxuICBdLFxyXG5cclxuICBcInNjb2lhdGFlbFwiOiBbXHJcbiAgICBcImZyYW5jZXNjYV9kYWlzeV9vZl90aGVfdmFsbGV5XCIsXHJcbiAgICBcInNhZXNlbnRoZXNzaXNcIixcclxuICAgIFwiaW9ydmV0aFwiLFxyXG4gICAgXCJpc2VuZ3JpbV9mYW9pbHRpYXJuYWhcIixcclxuICAgIFwiZWl0aG5lXCIsXHJcbiAgICBcImhhdmVrYXJfaGVhbGVyXCIsXHJcbiAgICBcInJpb3JkYWluXCIsXHJcbiAgICBcInRvcnV2aWVsXCIsXHJcbiAgICBcImRlY295XCIsXHJcbiAgICBcImRlY295XCIsXHJcbiAgICBcImltcGVuZXRyYWJsZV9mb2dcIixcclxuICAgIFwiZWx2ZW5fc2tpcm1pc2hlclwiLFxyXG4gICAgXCJlbHZlbl9za2lybWlzaGVyXCIsXHJcbiAgICBcImR3YXJ2ZW5fc2tpcm1pc2hlclwiLFxyXG4gICAgXCJkd2FydmVuX3NraXJtaXNoZXJcIixcclxuICAgIFwiY2lhcmFuX2FlcF9lYXNuaWxsaWVuXCIsXHJcbiAgICBcInZyaWhlZGRfYnJpZ2FkZV9yZWNydWl0XCIsXHJcbiAgICBcImRvbF9ibGF0aGFubmFfYXJjaGVyXCIsXHJcbiAgICBcImhhdmVrYXJfc211Z2dsZXJcIixcclxuICAgIFwibWFoYWthbWFuX2RlZmVuZGVyXCIsXHJcbiAgICBcInZyaWhlZGRfYnJpZ2FkZV92ZXRlcmFuXCIsXHJcbiAgICBcImRlbm5pc19jcmFubWVyXCIsXHJcbiAgICBcImZpbGF2YW5kcmVsX2Flbl9maWRoYWlsXCIsXHJcbiAgICBcImZpbGF2YW5kcmVsX2Flbl9maWRoYWlsXCIsXHJcbiAgICBcImlkYV9lbWVhbl9hZXBfc2l2bmV5XCIsXHJcbiAgICBcInlhZXZpbm5cIixcclxuICAgIFwiYmFyY2xheV9lbHNcIixcclxuICAgIFwiZG9sX2JsYXRoYW5uYV9zY291dFwiLFxyXG4gICAgXCJtaWx2YVwiXHJcbiAgXSxcclxuXHJcbiAgXCJtb25zdGVyXCI6IFtcclxuICAgIFwiZXJlZGluX2tpbmdfb2ZfdGhlX3dpbGRfaHVudFwiLFxyXG4gICAgXCJrYXlyYW5cIixcclxuICAgIFwibGVzaGVuXCIsXHJcbiAgICBcImltbGVyaXRoXCIsXHJcbiAgICBcImRyYXVnXCIsXHJcbiAgICBcImdob3VsXCIsXHJcbiAgICBcImRlY295XCIsXHJcbiAgICBcImRlY295XCIsXHJcbiAgICBcIm5la2tlclwiLFxyXG4gICAgXCJuZWtrZXJcIixcclxuICAgIFwid3l2ZXJuXCIsXHJcbiAgICBcImZvZ2xldFwiLFxyXG4gICAgXCJjZWxhZW5vX2hhcnB5XCIsXHJcbiAgICBcImdhcmdveWxlXCIsXHJcbiAgICBcImNvY2thdHJpY2VcIixcclxuICAgIFwiaGFycHlcIixcclxuICAgIFwiaW1wZW5ldHJhYmxlX2ZvZ1wiLFxyXG4gICAgXCJlbmRyZWdhXCIsXHJcbiAgICBcInZhbXBpcmVfYnJ1eGFcIixcclxuICAgIFwidmFtcGlyZV9icnV4YVwiLFxyXG4gICAgXCJ2YW1waXJlX2ZsZWRlclwiLFxyXG4gICAgXCJ2YW1waXJlX2ZsZWRlclwiLFxyXG4gICAgXCJ2YW1waXJlX2dhcmthaW5cIixcclxuICAgIFwidmFtcGlyZV9nYXJrYWluXCIsXHJcbiAgICBcInZhbXBpcmVfZWtpbW1hcmFcIixcclxuICAgIFwidmFtcGlyZV9la2ltbWFyYVwiLFxyXG4gICAgXCJhcmFjaGFzXCIsXHJcbiAgICBcImJvdGNobGluZ1wiLFxyXG4gICAgXCJmb3JrdGFpbFwiLFxyXG4gICAgXCJwbGFndWVfbWFpZGVuXCIsXHJcbiAgICBcImdyaWZmaW5cIixcclxuICAgIFwid2VyZXdvbGZcIixcclxuICAgIFwiZnJpZ2h0ZW5lclwiLFxyXG4gICAgXCJpY2VfZ2lhbnRcIixcclxuICAgIFwiZ3JhdmVfaGFnXCIsXHJcbiAgICAvL1widmFtcGlyZV9rYXRha2FuXCIsXHJcbiAgICBcImNyb25lX3doaXNwZXNzXCIsXHJcbiAgICBcImNyb25lX3doaXNwZXNzXCIsXHJcbiAgICBcImNyb25lX2JyZXdlc3NcIixcclxuICAgIFwiY3JvbmVfYnJld2Vzc1wiLFxyXG4gICAgXCJjcm9uZV93ZWF2ZXNzXCIsXHJcbiAgICBcImNyb25lX3dlYXZlc3NcIixcclxuICAgIFwiYXJhY2hhc19iZWhlbW90aFwiLFxyXG4gICAgXCJmaXJlX2VsZW1lbnRhbFwiLFxyXG4gICAgXCJmaWVuZFwiLFxyXG4gICAgXCJlYXJ0aF9lbGVtZW50YWxcIlxyXG4gIF1cclxufSIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjMnO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIHByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIGNvbGxlY3Rpb24gbWV0aG9kcyB0byBkZXRlcm1pbmUgd2hldGhlciBhIGNvbGxlY3Rpb25cbiAgLy8gc2hvdWxkIGJlIGl0ZXJhdGVkIGFzIGFuIGFycmF5IG9yIGFzIGFuIG9iamVjdFxuICAvLyBSZWxhdGVkOiBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIGdldExlbmd0aCA9IHByb3BlcnR5KCdsZW5ndGgnKTtcbiAgdmFyIGlzQXJyYXlMaWtlID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBPcHRpbWl6ZWQgaXRlcmF0b3IgZnVuY3Rpb24gYXMgdXNpbmcgYXJndW1lbnRzLmxlbmd0aFxuICAgIC8vIGluIHRoZSBtYWluIGZ1bmN0aW9uIHdpbGwgZGVvcHRpbWl6ZSB0aGUsIHNlZSAjMTk5MS5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGluaXRpYWwgdmFsdWUgaWYgbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpO1xuICAgIH07XG4gIH1cblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGNyZWF0ZVJlZHVjZSgtMSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAga2V5ID0gXy5maW5kSW5kZXgob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfLmZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIGl0ZW0sIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggIT0gJ251bWJlcicgfHwgZ3VhcmQpIGZyb21JbmRleCA9IDA7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdO1xuICAgICAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IGZ1bmMgOiBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gXy5pbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sIGlkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggfHwgMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vZmxhdHRlbiBjdXJyZW50IGxldmVsIG9mIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3RcbiAgICAgICAgaWYgKCFzaGFsbG93KSB2YWx1ZSA9IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIHN0cmljdCk7XG4gICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICBvdXRwdXQubGVuZ3RoICs9IGxlbjtcbiAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghc3RyaWN0KSB7XG4gICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpLCBhcnJheSkgOiB2YWx1ZTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gXy5wbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgZmluZEluZGV4IGFuZCBmaW5kTGFzdEluZGV4IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcbiAgXy5maW5kTGFzdEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGluZGV4T2YgYW5kIGxhc3RJbmRleE9mIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzb3J0ZWRJbmRleCAmJiBpZHggJiYgbGVuZ3RoKSB7XG4gICAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2lkeF0gPT09IGl0ZW0gPyBpZHggOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgXy5pc05hTik7XG4gICAgICAgIHJldHVybiBpZHggPj0gMCA/IGlkeCArIGkgOiAtMTtcbiAgICAgIH1cbiAgICAgIGZvciAoaWR4ID0gZGlyID4gMCA/IGkgOiBsZW5ndGggLSAxOyBpZHggPj0gMCAmJiBpZHggPCBsZW5ndGg7IGlkeCArPSBkaXIpIHtcbiAgICAgICAgaWYgKGFycmF5W2lkeF0gPT09IGl0ZW0pIHJldHVybiBpZHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIF8uZmluZEluZGV4LCBfLnNvcnRlZEluZGV4KTtcbiAgXy5sYXN0SW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKC0xLCBfLmZpbmRMYXN0SW5kZXgpO1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKHN0b3AgPT0gbnVsbCkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW5ndGg7IGlkeCsrLCBzdGFydCArPSBzdGVwKSB7XG4gICAgICByYW5nZVtpZHhdID0gc3RhcnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yXG4gIC8vIG9yIGEgbm9ybWFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50c1xuICB2YXIgZXhlY3V0ZUJvdW5kID0gZnVuY3Rpb24oc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQmluZCBtdXN0IGJlIGNhbGxlZCBvbiBhIGZ1bmN0aW9uJyk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IF8gPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIHRoaXMsIHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwga2V5O1xuICAgIGlmIChsZW5ndGggPD0gMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBhcmd1bWVudHNbaV07XG4gICAgICBvYmpba2V5XSA9IF8uYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgICAgaWYgKCFfLmhhcyhjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IF8ucGFydGlhbChfLmRlbGF5LCBfLCAxKTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBfLm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxhc3QgPSBfLm5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgXy5uZWdhdGUgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCB1cCB0byAoYnV0IG5vdCBpbmNsdWRpbmcpIHRoZSBOdGggY2FsbC5cbiAgXy5iZWZvcmUgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gXy5wYXJ0aWFsKF8uYmVmb3JlLCAyKTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSAoXy5pc0Z1bmN0aW9uKGNvbnN0cnVjdG9yKSAmJiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpIHx8IE9ialByb3RvO1xuXG4gICAgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG4gICAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICAgIGlmIChfLmhhcyhvYmosIHByb3ApICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSBrZXlzLnB1c2gocHJvcCk7XG5cbiAgICB3aGlsZSAobm9uRW51bUlkeC0tKSB7XG4gICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25vbkVudW1JZHhdO1xuICAgICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSAhPT0gcHJvdG9bcHJvcF0gJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIHtcbiAgICAgICAga2V5cy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgYWxsIHRoZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG4gIF8uYWxsS2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgb2JqZWN0XG4gIC8vIEluIGNvbnRyYXN0IHRvIF8ubWFwIGl0IHJldHVybnMgYW4gb2JqZWN0XG4gIF8ubWFwT2JqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdHMgPSB7fSxcbiAgICAgICAgICBjdXJyZW50S2V5O1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIHJlc3VsdHNbY3VycmVudEtleV0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocylcbiAgLy8gKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24pXG4gIF8uZXh0ZW5kT3duID0gXy5hc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihfLmtleXMpO1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGtleSBvbiBhbiBvYmplY3QgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRLZXkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKSwga2V5O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmplY3QsIG9pdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fSwgb2JqID0gb2JqZWN0LCBpdGVyYXRlZSwga2V5cztcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvaXRlcmF0ZWUpKSB7XG4gICAgICBrZXlzID0gXy5hbGxLZXlzKG9iaik7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2Iob2l0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHsgcmV0dXJuIGtleSBpbiBvYmo7IH07XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5tYXAoZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gXy5waWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIF8uY3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBfLmV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5pc01hdGNoID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKGF0dHJzKSwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG5cbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoXy5rZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IGtleXNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopICYmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikgfHwgXy5pc0FyZ3VtZW50cyhvYmopKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIF8ua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvci5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnLCAnRXJyb3InXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaGFzKG9iaiwgJ2NhbGxlZScpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLm5vb3AgPSBmdW5jdGlvbigpe307XG5cbiAgXy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgXy5wcm9wZXJ0eU9mID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gZnVuY3Rpb24oKXt9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2ZcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlciA9IF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgYXR0cnMgPSBfLmV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0ZWUoaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG4gIHZhciB1bmVzY2FwZU1hcCA9IF8uaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgXy5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xuICAgIHZhciB0ZXN0UmVnZXhwID0gUmVnRXhwKHNvdXJjZSk7XG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICAgIHJldHVybiB0ZXN0UmVnZXhwLnRlc3Qoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleHAsIGVzY2FwZXIpIDogc3RyaW5nO1xuICAgIH07XG4gIH07XG4gIF8uZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICBfLnVuZXNjYXBlID0gY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgZmFsbGJhY2spIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHZvaWQgMCA6IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHZhbHVlID0gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuICB2YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdO1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIHNldHRpbmdzLCBvbGRTZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZXIsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB2YXIgYXJndW1lbnQgPSBzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJztcbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24uIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PT0gJ3NoaWZ0JyB8fCBuYW1lID09PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuICBfLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59LmNhbGwodGhpcykpO1xuIiwidmFyIERlY2tEYXRhID0gcmVxdWlyZShcIi4uL2Fzc2V0cy9kYXRhL2RlY2tcIik7XHJcbnZhciBEZWNrID0gcmVxdWlyZShcIi4vRGVja1wiKTtcclxudmFyIEhhbmQgPSByZXF1aXJlKFwiLi9IYW5kXCIpO1xyXG52YXIgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmRcIik7XHJcbnZhciBGaWVsZCA9IHJlcXVpcmUoXCIuL0ZpZWxkXCIpO1xyXG52YXIgXyA9IHJlcXVpcmUoXCJ1bmRlcnNjb3JlXCIpO1xyXG5cclxuXHJcbnZhciBCYXR0bGVzaWRlO1xyXG5CYXR0bGVzaWRlID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIEJhdHRsZXNpZGUgPSBmdW5jdGlvbihuYW1lLCBuLCBiYXR0bGUsIHVzZXIpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgQmF0dGxlc2lkZSkpe1xyXG4gICAgICByZXR1cm4gKG5ldyBCYXR0bGVzaWRlKG5hbWUsIG4sIGJhdHRsZSwgdXNlcikpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuXHJcbiAgICB2YXIgZGVjayA9IHVzZXIuZ2V0RGVjaygpO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5faXNXYWl0aW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuc29ja2V0ID0gdXNlci5zb2NrZXQ7XHJcbiAgICB0aGlzLmZpZWxkID0ge307XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5MRUFERVJdID0gRmllbGQoQ2FyZC5UWVBFLkxFQURFUik7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5DTE9TRV9DT01CQVRdID0gRmllbGQoQ2FyZC5UWVBFLkNMT1NFX0NPTUJBVCk7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5SQU5HRURdID0gRmllbGQoQ2FyZC5UWVBFLlJBTkdFRCk7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5TSUVHRV0gPSBGaWVsZChDYXJkLlRZUEUuU0lFR0UpO1xyXG4gICAgdGhpcy5uID0gbiA/IFwicDJcIiA6IFwicDFcIjtcclxuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5iYXR0bGUgPSBiYXR0bGU7XHJcbiAgICB0aGlzLmhhbmQgPSBIYW5kKCk7XHJcbiAgICB0aGlzLmRlY2sgPSBEZWNrKERlY2tEYXRhW2RlY2tdKTtcclxuICAgIHRoaXMuX2Rpc2NhcmQgPSBbXTtcclxuXHJcbiAgICB0aGlzLnJ1bkV2ZW50ID0gdGhpcy5iYXR0bGUucnVuRXZlbnQuYmluZCh0aGlzLmJhdHRsZSk7XHJcbiAgICB0aGlzLm9uID0gdGhpcy5iYXR0bGUub24uYmluZCh0aGlzLmJhdHRsZSk7XHJcbiAgICB0aGlzLm9mZiA9IHRoaXMuYmF0dGxlLm9mZi5iaW5kKHRoaXMuYmF0dGxlKTtcclxuXHJcblxyXG4gICAgdGhpcy5yZWNlaXZlKFwiYWN0aXZhdGU6bGVhZGVyXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlmKHNlbGYuX2lzV2FpdGluZykgcmV0dXJuO1xyXG4gICAgICBpZihzZWxmLmlzUGFzc2luZygpKSByZXR1cm47XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcImxlYWRlciBhY3RpdmF0ZWRcIik7XHJcblxyXG4gICAgICB2YXIgbGVhZGVyQ2FyZCA9IHNlbGYuZ2V0TGVhZGVyKCk7XHJcbiAgICAgIGlmKGxlYWRlckNhcmQuaXNEaXNhYmxlZCgpKSByZXR1cm47XHJcblxyXG5cclxuICAgICAgdmFyIGFiaWxpdHkgPSBsZWFkZXJDYXJkLmdldEFiaWxpdHkoKTtcclxuXHJcbiAgICAgIGFiaWxpdHkub25BY3RpdmF0ZS5hcHBseShzZWxmKTtcclxuICAgICAgbGVhZGVyQ2FyZC5zZXREaXNhYmxlZCh0cnVlKTtcclxuICAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJwbGF5OmNhcmRGcm9tSGFuZFwiLCBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgaWYoc2VsZi5faXNXYWl0aW5nKSByZXR1cm47XHJcbiAgICAgIGlmKHNlbGYuaXNQYXNzaW5nKCkpIHJldHVybjtcclxuICAgICAgdmFyIGNhcmRJRCA9IGRhdGEuaWQ7XHJcbiAgICAgIHZhciBjYXJkID0gc2VsZi5oYW5kLmdldENhcmQoY2FyZElEKTtcclxuXHJcbiAgICAgIHNlbGYucGxheUNhcmQoY2FyZCk7XHJcbiAgICB9KVxyXG4gICAgdGhpcy5yZWNlaXZlKFwiZGVjb3k6cmVwbGFjZVdpdGhcIiwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIGlmKHNlbGYuX2lzV2FpdGluZykgcmV0dXJuO1xyXG4gICAgICB2YXIgY2FyZCA9IHNlbGYuZmluZENhcmRPbkZpZWxkQnlJRChkYXRhLmNhcmRJRCk7XHJcbiAgICAgIGlmKGNhcmQgPT09IC0xKSB0aHJvdyBuZXcgRXJyb3IoXCJkZWNveTpyZXBsYWNlIHwgdW5rbm93biBjYXJkXCIpO1xyXG4gICAgICBzZWxmLnJ1bkV2ZW50KFwiRGVjb3k6cmVwbGFjZVdpdGhcIiwgc2VsZiwgW2NhcmRdKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJjYW5jZWw6ZGVjb3lcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgc2VsZi5vZmYoXCJEZWNveTpyZXBsYWNlV2l0aFwiKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJzZXQ6cGFzc2luZ1wiLCBmdW5jdGlvbigpe1xyXG4gICAgICBzZWxmLnNldFBhc3NpbmcodHJ1ZSk7XHJcbiAgICAgIHNlbGYudXBkYXRlKCk7XHJcbiAgICAgIHNlbGYucnVuRXZlbnQoXCJOZXh0VHVyblwiLCBudWxsLCBbc2VsZi5mb2VdKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLnJlY2VpdmUoXCJtZWRpYzpjaG9vc2VDYXJkRnJvbURpc2NhcmRcIiwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgIGlmKCFkYXRhKXtcclxuICAgICAgICBzZWxmLnJ1bkV2ZW50KFwiTmV4dFR1cm5cIiwgbnVsbCwgW3NlbGYuZm9lXSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBjYXJkSUQgPSBkYXRhLmNhcmRJRDtcclxuICAgICAgdmFyIGNhcmQgPSBzZWxmLmdldENhcmRGcm9tRGlzY2FyZChjYXJkSUQpO1xyXG4gICAgICBpZihjYXJkID09PSAtMSkgdGhyb3cgbmV3IEVycm9yKFwibWVkaWM6Y2hvb3NlQ2FyZEZyb21EaXNjYXJkIHwgdW5rbm93biBjYXJkOiBcIiwgY2FyZCk7XHJcblxyXG4gICAgICBzZWxmLnJlbW92ZUZyb21EaXNjYXJkKGNhcmQpO1xyXG5cclxuICAgICAgc2VsZi5wbGF5Q2FyZChjYXJkKTtcclxuICAgIH0pXHJcblxyXG5cclxuICAgIHRoaXMub24oXCJUdXJuXCIgKyB0aGlzLmdldElEKCksIHRoaXMub25UdXJuU3RhcnQsIHRoaXMpO1xyXG4gIH07XHJcbiAgdmFyIHIgPSBCYXR0bGVzaWRlLnByb3RvdHlwZTtcclxuICAvKipcclxuICAgKiBtZXRob2RzICYmIHByb3BlcnRpZXMgaGVyZVxyXG4gICAqIHIucHJvcGVydHkgPSBudWxsO1xyXG4gICAqIHIuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbigpIHsuLi59XHJcbiAgICovXHJcbiAgci5fbmFtZSA9IG51bGw7XHJcbiAgci5fZGlzY2FyZCA9IG51bGw7XHJcblxyXG4gIHIuX3J1YmllcyA9IDI7XHJcbiAgci5fc2NvcmUgPSAwO1xyXG4gIHIuX2lzV2FpdGluZyA9IG51bGw7XHJcbiAgci5fcGFzc2luZyA9IG51bGw7XHJcblxyXG4gIHIuZmllbGQgPSBudWxsO1xyXG5cclxuICByLnNvY2tldCA9IG51bGw7XHJcbiAgci5uID0gbnVsbDtcclxuXHJcbiAgci5mb2UgPSBudWxsO1xyXG4gIHIuaGFuZCA9IG51bGw7XHJcbiAgci5iYXR0bGUgPSBudWxsO1xyXG4gIHIuZGVjayA9IG51bGw7XHJcblxyXG4gIHIuaXNQYXNzaW5nID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9wYXNzaW5nO1xyXG4gIH1cclxuXHJcbiAgci5zZXRVcFdlYXRoZXJGaWVsZFdpdGggPSBmdW5jdGlvbihwMil7XHJcbiAgICB0aGlzLmZpZWxkW0NhcmQuVFlQRS5XRUFUSEVSXSA9IHAyLmZpZWxkW0NhcmQuVFlQRS5XRUFUSEVSXSA9IEZpZWxkKENhcmQuVFlQRS5XRUFUSEVSKTtcclxuICB9XHJcblxyXG4gIHIuZmluZENhcmRPbkZpZWxkQnlJRCA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIGZvcih2YXIga2V5IGluIHRoaXMuZmllbGQpIHtcclxuICAgICAgdmFyIGZpZWxkID0gdGhpcy5maWVsZFtrZXldO1xyXG4gICAgICB2YXIgY2FyZCA9IGZpZWxkLmdldENhcmQoaWQpO1xyXG4gICAgICBpZihjYXJkICE9PSAtMSkgcmV0dXJuIGNhcmQ7XHJcbiAgICB9XHJcbiAgICAvKlxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9kaXNjYXJkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgYyA9IHRoaXMuX2Rpc2NhcmRbaV07XHJcbiAgICAgICAgICBpZihjLmdldElEKCkgPT09IGlkKSByZXR1cm4gYztcclxuICAgICAgICB9Ki9cclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIHIuZ2V0Q2FyZEZyb21EaXNjYXJkID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuX2Rpc2NhcmQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSB0aGlzLl9kaXNjYXJkW2ldO1xyXG4gICAgICBpZihjLmdldElEKCkgPT09IGlkKSByZXR1cm4gYztcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIHIuc2V0UGFzc2luZyA9IGZ1bmN0aW9uKGIpe1xyXG4gICAgdGhpcy5fcGFzc2luZyA9IGI7XHJcbiAgICB0aGlzLnNlbmQoXCJzZXQ6cGFzc2luZ1wiLCB7cGFzc2luZzogdGhpcy5fcGFzc2luZ30sIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgci53YWl0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuX2lzV2FpdGluZyA9IHRydWU7XHJcbiAgICB0aGlzLnNlbmQoXCJzZXQ6d2FpdGluZ1wiLCB7d2FpdGluZzogdGhpcy5faXNXYWl0aW5nfSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICByLnR1cm4gPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5faXNXYWl0aW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLnNlbmQoXCJzZXQ6d2FpdGluZ1wiLCB7d2FpdGluZzogdGhpcy5faXNXYWl0aW5nfSwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICByLnNldExlYWRlcmNhcmQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGxlYWRlckNhcmQgPSB0aGlzLmRlY2suZmluZChcInR5cGVcIiwgQ2FyZC5UWVBFLkxFQURFUik7XHJcbiAgICB0aGlzLmRlY2sucmVtb3ZlRnJvbURlY2sobGVhZGVyQ2FyZFswXSk7XHJcbiAgICAvKlxyXG4gICAgICAgIHRoaXMuZ2V0WW91cnNpZGUoKS5zZXRGaWVsZChcImxlYWRlclwiLCBsZWFkZXJDYXJkWzBdKTsqL1xyXG4gICAgdGhpcy5maWVsZFtDYXJkLlRZUEUuTEVBREVSXS5hZGQobGVhZGVyQ2FyZFswXSk7XHJcbiAgfVxyXG5cclxuICByLmdldExlYWRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5maWVsZFtDYXJkLlRZUEUuTEVBREVSXS5nZXQoKVswXTtcclxuICB9XHJcblxyXG4gIHIuZ2V0SUQgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMubjtcclxuICB9XHJcblxyXG4gIHIuZHJhdyA9IGZ1bmN0aW9uKHRpbWVzKXtcclxuICAgIHdoaWxlKHRpbWVzLS0pIHtcclxuICAgICAgdmFyIGNhcmQgPSB0aGlzLmRlY2suZHJhdygpO1xyXG4gICAgICB0aGlzLmhhbmQuYWRkKGNhcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwidXBkYXRlOmhhbmQgZmlyZWRcIik7XHJcblxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIHIuY2FsY1Njb3JlID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBzY29yZSA9IDA7XHJcbiAgICBmb3IodmFyIGtleSBpbiB0aGlzLmZpZWxkKSB7XHJcbiAgICAgIHNjb3JlICs9ICt0aGlzLmZpZWxkW2tleV0uZ2V0U2NvcmUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9zY29yZSA9IHNjb3JlO1xyXG4gIH1cclxuXHJcbiAgci5nZXRJbmZvID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6IHRoaXMuZ2V0TmFtZSgpLFxyXG4gICAgICBsaXZlczogdGhpcy5fcnViaWVzLFxyXG4gICAgICBzY29yZTogdGhpcy5jYWxjU2NvcmUoKSxcclxuICAgICAgaGFuZDogdGhpcy5oYW5kLmxlbmd0aCgpLFxyXG4gICAgICBkaXNjYXJkOiB0aGlzLmdldERpc2NhcmQodHJ1ZSksXHJcbiAgICAgIHBhc3Npbmc6IHRoaXMuX3Bhc3NpbmdcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIuZ2V0UnViaWVzID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9ydWJpZXM7XHJcbiAgfVxyXG5cclxuICByLmdldFNjb3JlID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiArdGhpcy5jYWxjU2NvcmUoKTtcclxuICB9XHJcblxyXG4gIHIucmVtb3ZlUnVieSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLl9ydWJpZXMtLTtcclxuICB9XHJcblxyXG4gIHIuZ2V0TmFtZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICB9XHJcblxyXG4gIHIuc2VuZCA9IGZ1bmN0aW9uKGV2ZW50LCBtc2csIGlzUHJpdmF0ZSl7XHJcbiAgICBtc2cgPSBtc2cgfHwge307XHJcbiAgICBpc1ByaXZhdGUgPSB0eXBlb2YgaXNQcml2YXRlID09PSBcInVuZGVmaW5lZFwiID8gZmFsc2UgOiBpc1ByaXZhdGU7XHJcbiAgICBtc2cuX3Jvb21TaWRlID0gdGhpcy5uO1xyXG5cclxuICAgIGlmKGlzUHJpdmF0ZSl7XHJcbiAgICAgIHJldHVybiB0aGlzLnNvY2tldC5lbWl0KGV2ZW50LCBtc2cpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5iYXR0bGUuc2VuZChldmVudCwgbXNnKTtcclxuICB9XHJcblxyXG4gIHIucmVjZWl2ZSA9IGZ1bmN0aW9uKGV2ZW50LCBjYil7XHJcbiAgICB0aGlzLnNvY2tldC5vbihldmVudCwgY2IpO1xyXG4gIH1cclxuXHJcbiAgci51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgLy9QdWJTdWIucHVibGlzaChcInVwZGF0ZVwiKTtcclxuICAgIHRoaXMucnVuRXZlbnQoXCJVcGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICByLm9uVHVyblN0YXJ0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZm9lLndhaXQoKTtcclxuICAgIHRoaXMudHVybigpO1xyXG5cclxuICAgIC8vd2FpdCBmb3IgY2FyZHBsYXkgZXZlbnRcclxuXHJcblxyXG4gIH07XHJcblxyXG4gIHIucGxheUNhcmQgPSBmdW5jdGlvbihjYXJkKXtcclxuICAgIGlmKGNhcmQgPT09IG51bGwgfHwgY2FyZCA9PT0gLTEpIHJldHVybjtcclxuXHJcbiAgICBpZighdGhpcy5wbGFjZUNhcmQoY2FyZCkpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmhhbmQucmVtb3ZlKGNhcmQpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG5cclxuICAgIHRoaXMucnVuRXZlbnQoXCJOZXh0VHVyblwiLCBudWxsLCBbdGhpcy5mb2VdKTtcclxuICB9XHJcblxyXG4gIHIucGxhY2VDYXJkID0gZnVuY3Rpb24oY2FyZCwgb2JqKXtcclxuICAgIG9iaiA9IF8uZXh0ZW5kKHt9LCBvYmopO1xyXG5cclxuICAgIHRoaXMuY2hlY2tBYmlsaXRpZXMoY2FyZCwgb2JqKTtcclxuICAgIGlmKG9iai5fY2FuY2xlUGxhY2VtZW50KSByZXR1cm4gMDtcclxuXHJcbiAgICB2YXIgZmllbGQgPSBvYmoudGFyZ2V0U2lkZS5maWVsZFtjYXJkLmdldFR5cGUoKV07XHJcbiAgICBmaWVsZC5hZGQoY2FyZCk7XHJcblxyXG5cclxuICAgIHRoaXMucnVuRXZlbnQoXCJFYWNoQ2FyZFBsYWNlXCIpO1xyXG5cclxuICAgIHRoaXMuY2hlY2tBYmlsaXR5T25BZnRlclBsYWNlKGNhcmQsIG9iaik7XHJcbiAgICAvKlxyXG4gICAgICAgIHRoaXMucnVuRXZlbnQoXCJBZnRlclBsYWNlXCIsIHRoaXMsIFtjYXJkLCBvYmpdKTsqL1xyXG5cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgaWYob2JqLl93YWl0UmVzcG9uc2Upe1xyXG4gICAgICB0aGlzLmhhbmQucmVtb3ZlKGNhcmQpO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gMTtcclxuICB9XHJcblxyXG4gIHIuY2hlY2tBYmlsaXRpZXMgPSBmdW5jdGlvbihjYXJkLCBvYmosIF9fZmxhZyl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBvYmoudGFyZ2V0U2lkZSA9IHRoaXM7XHJcbiAgICB2YXIgYWJpbGl0eSA9IEFycmF5LmlzQXJyYXkoX19mbGFnKSB8fCBjYXJkLmdldEFiaWxpdHkoKTtcclxuXHJcbiAgICBpZihBcnJheS5pc0FycmF5KGFiaWxpdHkpICYmIGFiaWxpdHkubGVuZ3RoKXtcclxuICAgICAgdmFyIHJldCA9IGFiaWxpdHkuc2xpY2UoKTtcclxuICAgICAgcmV0ID0gcmV0LnNwbGljZSgwLCAxKTtcclxuICAgICAgdGhpcy5jaGVja0FiaWxpdGllcyhjYXJkLCBvYmosIHJldCk7XHJcbiAgICAgIGFiaWxpdHkgPSBhYmlsaXR5WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGFiaWxpdHkgJiYgYWJpbGl0eS5uYW1lID09PSBvYmouc3VwcHJlc3Mpe1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGFiaWxpdHkgJiYgIUFycmF5LmlzQXJyYXkoYWJpbGl0eSkpe1xyXG4gICAgICBpZihhYmlsaXR5LndhaXRSZXNwb25zZSl7XHJcbiAgICAgICAgb2JqLl93YWl0UmVzcG9uc2UgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGFiaWxpdHkuY2hhbmdlU2lkZSl7XHJcbiAgICAgICAgb2JqLnRhcmdldFNpZGUgPSB0aGlzLmZvZTtcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5LnJlcGxhY2VXaXRoKXtcclxuICAgICAgICBvYmouX2NhbmNsZVBsYWNlbWVudCA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMub24oXCJEZWNveTpyZXBsYWNlV2l0aFwiLCBmdW5jdGlvbihyZXBsYWNlQ2FyZCl7XHJcbiAgICAgICAgICBpZihyZXBsYWNlQ2FyZC5nZXRUeXBlKCkgPT0gQ2FyZC5UWVBFLkxFQURFUiB8fFxyXG4gICAgICAgICAgcmVwbGFjZUNhcmQuZ2V0VHlwZSgpID09IENhcmQuVFlQRS5XRUFUSEVSIHx8XHJcbiAgICAgICAgICByZXBsYWNlQ2FyZC5nZXRUeXBlKCkgPT0gQ2FyZC5UWVBFLlNQRUNJQUwpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihyZXBsYWNlQ2FyZC5nZXROYW1lKCkgPT09IGNhcmQuZ2V0TmFtZSgpKSByZXR1cm47XHJcbiAgICAgICAgICBzZWxmLm9mZihcIkRlY295OnJlcGxhY2VXaXRoXCIpO1xyXG4gICAgICAgICAgdmFyIGZpZWxkID0gc2VsZi5maWVsZFtyZXBsYWNlQ2FyZC5nZXRUeXBlKCldO1xyXG5cclxuXHJcbiAgICAgICAgICBmaWVsZC5yZXBsYWNlV2l0aChyZXBsYWNlQ2FyZCwgY2FyZCk7XHJcblxyXG4gICAgICAgICAgc2VsZi5oYW5kLmFkZChyZXBsYWNlQ2FyZCk7XHJcbiAgICAgICAgICBzZWxmLmhhbmQucmVtb3ZlKGNhcmQpO1xyXG4gICAgICAgICAgc2VsZi51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLnJ1bkV2ZW50KFwiTmV4dFR1cm5cIiwgbnVsbCwgW3NlbGYuZm9lXSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5Lm9uRWFjaFR1cm4pe1xyXG4gICAgICAgIHRoaXMub24oXCJFYWNoVHVyblwiLCBhYmlsaXR5Lm9uRWFjaFR1cm4sIHRoaXMsIFtjYXJkXSlcclxuICAgICAgfVxyXG4gICAgICBpZihhYmlsaXR5Lm9uRWFjaENhcmRQbGFjZSl7XHJcbiAgICAgICAgLy9QdWJTdWIuc3Vic2NyaWJlKFwib25FYWNoQ2FyZFBsYWNlXCIsIGFiaWxpdHkub25FYWNoQ2FyZFBsYWNlLmJpbmQodGhpcywgY2FyZCkpO1xyXG4gICAgICAgIHRoaXMub24oXCJFYWNoQ2FyZFBsYWNlXCIsIGFiaWxpdHkub25FYWNoQ2FyZFBsYWNlLCB0aGlzLCBbY2FyZF0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgci5jaGVja0FiaWxpdHlPbkFmdGVyUGxhY2UgPSBmdW5jdGlvbihjYXJkLCBvYmope1xyXG4gICAgdmFyIGFiaWxpdHkgPSBjYXJkLmdldEFiaWxpdHkoKTtcclxuICAgIGlmKGFiaWxpdHkpe1xyXG4gICAgICBpZihhYmlsaXR5Lm5hbWUgJiYgYWJpbGl0eS5uYW1lID09PSBvYmouc3VwcHJlc3Mpe1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGFiaWxpdHkub25BZnRlclBsYWNlKXtcclxuICAgICAgICBhYmlsaXR5Lm9uQWZ0ZXJQbGFjZS5jYWxsKHRoaXMsIGNhcmQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIuY2xlYXJNYWluRmllbGRzID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBjYXJkczEgPSB0aGlzLmZpZWxkW0NhcmQuVFlQRS5DTE9TRV9DT01CQVRdLnJlbW92ZUFsbCgpO1xyXG4gICAgdmFyIGNhcmRzMiA9IHRoaXMuZmllbGRbQ2FyZC5UWVBFLlJBTkdFRF0ucmVtb3ZlQWxsKCk7XHJcbiAgICB2YXIgY2FyZHMzID0gdGhpcy5maWVsZFtDYXJkLlRZUEUuU0lFR0VdLnJlbW92ZUFsbCgpO1xyXG5cclxuICAgIHZhciBjYXJkcyA9IGNhcmRzMS5jb25jYXQoY2FyZHMyLmNvbmNhdChjYXJkczMpKTtcclxuICAgIHRoaXMuYWRkVG9EaXNjYXJkKGNhcmRzKTtcclxuICB9XHJcblxyXG4gIHIuYWRkVG9EaXNjYXJkID0gZnVuY3Rpb24oY2FyZHMpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgY2FyZHMuZm9yRWFjaChmdW5jdGlvbihjYXJkKXtcclxuICAgICAgc2VsZi5fZGlzY2FyZC5wdXNoKGNhcmQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByLnJlbW92ZUZyb21EaXNjYXJkID0gZnVuY3Rpb24oY2FyZCl7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fZGlzY2FyZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYyA9IHRoaXMuX2Rpc2NhcmRbaV07XHJcbiAgICAgIGlmKGMuZ2V0SUQoKSA9PT0gY2FyZC5nZXRJRCgpKXtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzY2FyZC5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHIuZ2V0RGlzY2FyZCA9IGZ1bmN0aW9uKGpzb24pe1xyXG4gICAgaWYoanNvbil7XHJcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLl9kaXNjYXJkKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9kaXNjYXJkO1xyXG4gIH1cclxuXHJcbiAgci5yZXNldE5ld1JvdW5kID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2xlYXJNYWluRmllbGRzKCk7XHJcbiAgICB0aGlzLnNldFBhc3NpbmcoZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgci5maWx0ZXIgPSBmdW5jdGlvbihhcnJDYXJkcywgb3B0KXtcclxuICAgIHZhciBhcnIgPSBhcnJDYXJkcy5zbGljZSgpO1xyXG5cclxuICAgIGZvcih2YXIga2V5IGluIG9wdCkge1xyXG4gICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgIHZhciBwcm9wID0ga2V5LCB2YWwgPSBvcHRba2V5XTtcclxuXHJcblxyXG4gICAgICBhcnJDYXJkcy5mb3JFYWNoKGZ1bmN0aW9uKGNhcmQpe1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IGNhcmQuZ2V0UHJvcGVydHkocHJvcCk7XHJcbiAgICAgICAgaWYoXy5pc0FycmF5KHByb3BlcnR5KSl7XHJcbiAgICAgICAgICB2YXIgX2YgPSBmYWxzZTtcclxuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0eS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZihwcm9wZXJ0eVtpXSA9PT0gdmFsKSB7XHJcbiAgICAgICAgICAgICAgX2YgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZighX2Ype1xyXG4gICAgICAgICAgICByZXMucHVzaChjYXJkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihjYXJkLmdldFByb3BlcnR5KHByb3ApICE9PSB2YWwpe1xyXG4gICAgICAgICAgcmVzLnB1c2goY2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBhcnIgPSBfLmludGVyc2VjdGlvbihhcnIsIHJlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFycjtcclxuICB9XHJcblxyXG4gIHJldHVybiBCYXR0bGVzaWRlO1xyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXR0bGVzaWRlOyIsInZhciBDYXJkRGF0YSA9IHJlcXVpcmUoXCIuLi9hc3NldHMvZGF0YS9jYXJkc1wiKTtcclxudmFyIEFiaWxpdHlEYXRhID0gcmVxdWlyZShcIi4uL2Fzc2V0cy9kYXRhL2FiaWxpdGllc1wiKTtcclxuXHJcbnZhciBDYXJkID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIENhcmQgPSBmdW5jdGlvbihrZXkpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgQ2FyZCkpe1xyXG4gICAgICByZXR1cm4gKG5ldyBDYXJkKGtleSkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2V0RGlzYWJsZWQoZmFsc2UpO1xyXG4gICAgdGhpcy5jaGFubmVsID0ge307XHJcbiAgICB0aGlzLl9rZXkgPSBrZXk7XHJcbiAgICB0aGlzLl9kYXRhID0gQ2FyZERhdGFba2V5XTtcclxuICAgIHRoaXMuX2RhdGEua2V5ID0ga2V5O1xyXG4gICAgdGhpcy5fYm9vc3QgPSAwO1xyXG4gICAgdGhpcy5fZm9yY2VkUG93ZXIgPSAtMTtcclxuICAgIHRoaXMuX2luaXQoKTtcclxuXHJcbiAgfTtcclxuICB2YXIgciA9IENhcmQucHJvdG90eXBlO1xyXG4gIC8qKlxyXG4gICAqIG1ldGhvZHMgJiYgcHJvcGVydGllcyBoZXJlXHJcbiAgICogci5wcm9wZXJ0eSA9IG51bGw7XHJcbiAgICogci5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKCkgey4uLn1cclxuICAgKi9cclxuICByLl9rZXkgPSBudWxsO1xyXG4gIHIuX2RhdGEgPSBudWxsO1xyXG4gIHIuX2lkID0gbnVsbDtcclxuICByLl9vd25lciA9IG51bGw7XHJcbiAgci5fYm9vc3QgPSBudWxsO1xyXG4gIHIuX2ZvcmNlZFBvd2VyID0gbnVsbDtcclxuICByLl9kaXNhYmxlZCA9IG51bGw7XHJcbiAgQ2FyZC5fX2lkID0gMDtcclxuICBDYXJkLlRZUEUgPSB7XHJcbiAgICBDTE9TRV9DT01CQVQ6IDAsXHJcbiAgICBSQU5HRUQ6IDEsXHJcbiAgICBTSUVHRTogMixcclxuICAgIExFQURFUjogMyxcclxuICAgIFNQRUNJQUw6IDQsXHJcbiAgICBXRUFUSEVSOiA1XHJcbiAgfTtcclxuXHJcbiAgci5jaGFubmVsID0gbnVsbFxyXG5cclxuXHJcbiAgci5faW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLl9pZCA9ICsrQ2FyZC5fX2lkO1xyXG4gIH1cclxuXHJcbiAgci5nZXROYW1lID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhLm5hbWU7XHJcbiAgfVxyXG4gIHIuZ2V0UG93ZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYodGhpcy5fZGF0YS5wb3dlciA9PT0gLTEpIHJldHVybiAwO1xyXG4gICAgaWYodGhpcy5fZm9yY2VkUG93ZXIgPiAtMSl7XHJcbiAgICAgIHJldHVybiB0aGlzLl9mb3JjZWRQb3dlciArIHRoaXMuX2Jvb3N0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEucG93ZXIgKyB0aGlzLl9ib29zdDtcclxuICB9XHJcbiAgci5nZXRSYXdQb3dlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEucG93ZXI7XHJcbiAgfVxyXG4gIHIuY2FsY3VsYXRlQm9vc3QgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX2Jvb3N0ID0gMDtcclxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLl9ib29zdHMpIHtcclxuICAgICAgdmFyIGJvb3N0ID0gdGhpcy5fYm9vc3RzW2tleV07XHJcbiAgICAgIHRoaXMuYm9vc3QoYm9vc3QuZ2V0UG93ZXIoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHIuc2V0Rm9yY2VkUG93ZXIgPSBmdW5jdGlvbihucil7XHJcbiAgICB0aGlzLl9mb3JjZWRQb3dlciA9IG5yO1xyXG4gIH1cclxuICByLmdldFJhd0FiaWxpdHkgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuYWJpbGl0eTtcclxuICB9XHJcbiAgci5nZXRBYmlsaXR5ID0gZnVuY3Rpb24oKXtcclxuICAgIGlmKEFycmF5LmlzQXJyYXkodGhpcy5fZGF0YS5hYmlsaXR5KSkge1xyXG4gICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgIHRoaXMuX2RhdGEuYWJpbGl0eS5mb3JFYWNoKGZ1bmN0aW9uKGFiaWxpdHkpIHtcclxuICAgICAgICByZXMucHVzaChBYmlsaXR5RGF0YVthYmlsaXR5XSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQWJpbGl0eURhdGFbdGhpcy5fZGF0YS5hYmlsaXR5XTtcclxuICB9XHJcbiAgci5nZXRJbWFnZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gXCIuLi9hc3NldHMvY2FyZHMvXCIgKyB0aGlzLl9kYXRhLmltZyArIFwiLnBuZ1wiO1xyXG4gIH1cclxuICByLmdldEZhY3Rpb24gPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuZmFjdGlvbjtcclxuICB9XHJcbiAgci5nZXRNdXN0ZXJUeXBlID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5tdXN0ZXJUeXBlIHx8IG51bGw7XHJcbiAgfVxyXG4gIHIuZ2V0VHlwZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YS50eXBlO1xyXG4gIH1cclxuICByLmdldEtleSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fa2V5O1xyXG4gIH1cclxuXHJcbiAgci5nZXRJRCA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgfVxyXG5cclxuICByLmJvb3N0ID0gZnVuY3Rpb24obnIpe1xyXG4gICAgLyp0aGlzLmdldFBvd2VyKCk7IC8vdG8gcmVjYWxjdWxhdGUgdGhpcy5fcG93ZXI7Ki9cclxuICAgIHRoaXMuX2Jvb3N0ICs9IG5yO1xyXG4gIH1cclxuXHJcbiAgci5pc0Rpc2FibGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XHJcbiAgfVxyXG5cclxuICByLnNldERpc2FibGVkID0gZnVuY3Rpb24oYikge1xyXG4gICAgdGhpcy5fZGlzYWJsZWQgPSBiO1xyXG4gIH1cclxuXHJcbiAgci5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKHByb3Ape1xyXG4gICAgaWYoIXRoaXMuX2RhdGFbcHJvcF0pIHJldHVybiB7fTtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhW3Byb3BdO1xyXG4gIH1cclxuXHJcbiAgci5yZXNldEJvb3N0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9ib29zdCA9IDA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gQ2FyZDtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZDsiLCJ2YXIgQ2FyZCA9IHJlcXVpcmUoXCIuL0NhcmRcIik7XHJcbi8qdmFyIENhcmRNYW5hZ2VyID0gcmVxdWlyZShcIi4vQ2FyZE1hbmFnZXJcIik7Ki9cclxuXHJcbnZhciBEZWNrID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIERlY2sgPSBmdW5jdGlvbihkZWNrKXtcclxuICAgIGlmKCEodGhpcyBpbnN0YW5jZW9mIERlY2spKXtcclxuICAgICAgcmV0dXJuIChuZXcgRGVjayhkZWNrKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yIGhlcmVcclxuICAgICAqL1xyXG4gICAgdGhpcy5fZGVjayA9IFtdO1xyXG5cclxuICAgIHRoaXMuX29yaWdpbmFsRGVjayA9IFtdO1xyXG4gICAgdGhpcy5zZXREZWNrKGRlY2spO1xyXG4gIH07XHJcbiAgdmFyIHIgPSBEZWNrLnByb3RvdHlwZTtcclxuICAvKipcclxuICAgKiBtZXRob2RzICYmIHByb3BlcnRpZXMgaGVyZVxyXG4gICAqIHIucHJvcGVydHkgPSBudWxsO1xyXG4gICAqIHIuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbigpIHsuLi59XHJcbiAgICovXHJcbiAgci5fZGVjayA9IG51bGw7XHJcbiAgci5fb3duZXIgPSBudWxsO1xyXG4gIHIuX29yaWdpbmFsRGVjayA9IG51bGw7XHJcblxyXG4gIHIuc2V0RGVjayA9IGZ1bmN0aW9uKGRlY2tEYXRhKXtcclxuICAgIHRoaXMuX29yaWdpbmFsRGVjayA9IGRlY2tEYXRhLnNsaWNlKCk7XHJcbiAgICB0aGlzLl9kZWNrID0gZGVja0RhdGEuc2xpY2UoKTtcclxuXHJcbiAgICB0aGlzLl9sb2FkQ2FyZHMoKTtcclxuICAgIHRoaXMuc2h1ZmZsZSgpO1xyXG4gIH1cclxuXHJcbiAgci5nZXRMZW5ndGggPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RlY2subGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgci5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0TGVuZ3RoKCk7XHJcbiAgfVxyXG5cclxuICByLmdldERlY2sgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2RlY2s7XHJcbiAgfVxyXG5cclxuICByLmRyYXcgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYoIXRoaXMuX2RlY2subGVuZ3RoKSByZXR1cm4gMDtcclxuICAgIHZhciBjYXJkID0gdGhpcy5wb3AoKTtcclxuICAgIHJldHVybiBjYXJkO1xyXG4gIH1cclxuXHJcblxyXG4gIHIuX2xvYWRDYXJkcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLl9kZWNrID0gdGhpcy5nZXREZWNrKCkubWFwKGZ1bmN0aW9uKGNhcmRrZXkpe1xyXG4gICAgICByZXR1cm4gQ2FyZChjYXJka2V5KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgci5wb3AgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGlkID0gdGhpcy5fZGVjay5wb3AoKTtcclxuICAgIC8qXHJcbiAgICAgICAgdmFyIGNhcmQgPSBDYXJkTWFuYWdlcigpLmdldENhcmRCeUlkKGlkKTsqL1xyXG4gICAgcmV0dXJuIGlkO1xyXG4gIH1cclxuXHJcbiAgci5maW5kID0gZnVuY3Rpb24oa2V5LCB2YWwpe1xyXG4gICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgdGhpcy5nZXREZWNrKCkuZm9yRWFjaChmdW5jdGlvbihjYXJkKXtcclxuICAgICAgaWYoY2FyZC5nZXRQcm9wZXJ0eShrZXkpID09IHZhbCl7XHJcbiAgICAgICAgcmVzLnB1c2goY2FyZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcblxyXG4gIHIucmVtb3ZlRnJvbURlY2sgPSBmdW5jdGlvbihjYXJkKXtcclxuICAgIHZhciBuID0gdGhpcy5sZW5ndGgoKTtcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gdGhpcy5nZXREZWNrKClbaV07XHJcbiAgICAgIGlmKGMuZ2V0SUQoKSA9PT0gY2FyZC5nZXRJRCgpKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXREZWNrKCkuc3BsaWNlKGksIDEpWzBdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICByLnNodWZmbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGRlY2sgPSB0aGlzLmdldERlY2soKTtcclxuXHJcbiAgICB2YXIgbiA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICBmb3IodmFyIGkgPSBuIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICB2YXIgaiA9IChNYXRoLnJhbmRvbSgpICogaSkgfCAwO1xyXG4gICAgICB2YXIgdG1wO1xyXG5cclxuICAgICAgdG1wID0gZGVja1tqXTtcclxuICAgICAgZGVja1tqXSA9IGRlY2tbaV07XHJcbiAgICAgIGRlY2tbaV0gPSB0bXA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gRGVjaztcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGVjazsiLCJ2YXIgRmllbGQgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgRmllbGQgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgRmllbGQpKXtcclxuICAgICAgcmV0dXJuIChuZXcgRmllbGQoKSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yIGhlcmVcclxuICAgICAqL1xyXG5cclxuICAgIHRoaXMuX2NhcmRzID0gW107XHJcbiAgfTtcclxuICB2YXIgciA9IEZpZWxkLnByb3RvdHlwZTtcclxuICAvKipcclxuICAgKiBtZXRob2RzICYmIHByb3BlcnRpZXMgaGVyZVxyXG4gICAqIHIucHJvcGVydHkgPSBudWxsO1xyXG4gICAqIHIuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbigpIHsuLi59XHJcbiAgICovXHJcblxyXG4gIHIuX2NhcmRzID0gbnVsbDtcclxuICByLl9zY29yZSA9IDA7XHJcblxyXG4gIHIuYWRkID0gZnVuY3Rpb24oY2FyZCl7XHJcbiAgICB0aGlzLl9jYXJkcy5wdXNoKGNhcmQpO1xyXG4gICAgdGhpcy51cGRhdGVTY29yZSgpO1xyXG4gIH1cclxuXHJcbiAgci5nZXQgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2NhcmRzO1xyXG4gIH1cclxuXHJcbiAgci5nZXRTY29yZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NvcmU7XHJcbiAgfVxyXG5cclxuICByLnVwZGF0ZVNjb3JlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuX3Njb3JlID0gMDtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IHRoaXMuX2NhcmRzW2ldO1xyXG4gICAgICB0aGlzLl9zY29yZSArPSBjYXJkLmdldFBvd2VyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oY2FyZCl7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5fY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5fY2FyZHNbaV0uZ2V0SUQoKSA9PT0gY2FyZC5nZXRJRCgpKSByZXR1cm4gaTtcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIHIucmVwbGFjZVdpdGggPSBmdW5jdGlvbihvbGRDYXJkLCBuZXdDYXJkKXtcclxuICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UG9zaXRpb24ob2xkQ2FyZCk7XHJcbiAgICB0aGlzLl9jYXJkc1tpbmRleF0gPSBuZXdDYXJkO1xyXG4gICAgb2xkQ2FyZC5yZXNldEJvb3N0KCk7XHJcbiAgICByZXR1cm4gb2xkQ2FyZDtcclxuICB9XHJcblxyXG4gIHIuZ2V0Q2FyZCA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLl9jYXJkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IHRoaXMuX2NhcmRzW2ldO1xyXG4gICAgICBpZihjYXJkLmdldElEKCkgPT0gaWQpIHJldHVybiBjYXJkO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxuXHJcbiAgci5yZW1vdmVBbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0bXAgPSB0aGlzLl9jYXJkcy5zbGljZSgpO1xyXG4gICAgdG1wLmZvckVhY2goZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICBjYXJkLnJlc2V0Qm9vc3QoKTtcclxuICAgIH0pXHJcbiAgICB0aGlzLl9jYXJkcyA9IFtdO1xyXG4gICAgcmV0dXJuIHRtcDtcclxuICB9XHJcblxyXG4gIHJldHVybiBGaWVsZDtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmllbGQ7IiwiLyp2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7Ki8vKlxyXG52YXIgQ2FyZE1hbmFnZXIgPSByZXF1aXJlKFwiLi9DYXJkTWFuYWdlclwiKTsqLy8qXHJcbnZhciBQdWJTdWIgPSByZXF1aXJlKFwiLi9wdWJzdWJcIik7Ki9cclxudmFyIENhcmQgPSByZXF1aXJlKFwiLi9DYXJkXCIpO1xyXG5cclxuXHJcbnZhciBIYW5kID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIEhhbmQgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYoISh0aGlzIGluc3RhbmNlb2YgSGFuZCkpe1xyXG4gICAgICByZXR1cm4gKG5ldyBIYW5kKCkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvciBoZXJlXHJcbiAgICAgKi9cclxuXHJcbiAgICB0aGlzLl9oYW5kID0gW107XHJcbiAgfTtcclxuICB2YXIgciA9IEhhbmQucHJvdG90eXBlO1xyXG4gIC8qKlxyXG4gICAqIG1ldGhvZHMgJiYgcHJvcGVydGllcyBoZXJlXHJcbiAgICogci5wcm9wZXJ0eSA9IG51bGw7XHJcbiAgICogci5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKCkgey4uLn1cclxuICAgKi9cclxuICByLl9oYW5kID0gbnVsbDtcclxuXHJcbiAgci5hZGQgPSBmdW5jdGlvbihjYXJkKXtcclxuICAgIHRoaXMuX2hhbmQucHVzaChjYXJkKTtcclxuICB9XHJcblxyXG4gIHIuZ2V0Q2FyZHMgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhbmQ7XHJcbiAgfVxyXG5cclxuICByLmdldENhcmQgPSBmdW5jdGlvbihpZCkge1xyXG4gICAgZm9yKHZhciBpPTA7IGk8IHRoaXMubGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICB2YXIgY2FyZCA9IHRoaXMuZ2V0Q2FyZHMoKVtpXTtcclxuICAgICAgaWYoY2FyZC5nZXRJRCgpID09PSBpZCkgcmV0dXJuIGNhcmQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICByLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKXtcclxuICAgIHZhciBuID0gdGhpcy5sZW5ndGgoKTtcclxuXHJcbiAgICAvL2NvbnNvbGUudHJhY2UoaWQpO1xyXG4gICAgaWQgPSBpZCBpbnN0YW5jZW9mIENhcmQgPyBpZC5nZXRJRCgpIDogaWQ7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICBpZih0aGlzLl9oYW5kW2ldLmdldElEKCkgIT0gaWQpIGNvbnRpbnVlO1xyXG4gICAgICByZXR1cm4gdGhpcy5faGFuZC5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIC0xO1xyXG4gIH1cclxuXHJcbiAgci5nZXRSYW5kb21DYXJkID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBybmQgPSAoTWF0aC5yYW5kb20oKSAqIHRoaXMuX2hhbmQubGVuZ3RoKSB8IDA7XHJcbiAgICByZXR1cm4gdGhpcy5faGFuZFtybmRdO1xyXG4gIH1cclxuXHJcbiAgci5nZXRMZW5ndGggPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhbmQubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgci5sZW5ndGggPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuX2hhbmQubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgci5maW5kID0gZnVuY3Rpb24oa2V5LCB2YWwpIHtcclxuICAgIHZhciByZXMgPSBbXTtcclxuICAgIHRoaXMuX2hhbmQuZm9yRWFjaChmdW5jdGlvbihjYXJkKXtcclxuICAgICAgaWYoY2FyZC5nZXRQcm9wZXJ0eShrZXkpID09IHZhbCl7XHJcbiAgICAgICAgcmVzLnB1c2goY2FyZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcblxyXG5cclxuICByZXR1cm4gSGFuZDtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFuZDsiLCJ2YXIgQ2FyZCA9IHJlcXVpcmUoXCIuLi8uLi9zZXJ2ZXIvQ2FyZFwiKTtcclxudmFyIEJhdHRsZXNpZGUgPSByZXF1aXJlKFwiLi4vLi4vc2VydmVyL0JhdHRsZXNpZGVcIik7XHJcbnZhciBkYXRhID0gcmVxdWlyZShcIi4uLy4uL2Fzc2V0cy9kYXRhL2FiaWxpdGllc1wiKTtcclxuXHJcblxyXG5kZXNjcmliZShcImZpbHRlclwiLCBmdW5jdGlvbigpe1xyXG4gIHZhciBjYXJkLCBzaWRlLCBmaWx0ZXIsIGNhcmRzO1xyXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKXtcclxuICAgIGZpbHRlciA9IEJhdHRsZXNpZGUucHJvdG90eXBlLmZpbHRlcjtcclxuICAgIGNhcmRzID0gW107XHJcbiAgICBjYXJkcy5wdXNoKENhcmQoXCJpb3J2ZXRoXCIpKTtcclxuICAgIGNhcmRzLnB1c2goQ2FyZChcInRvcnV2aWVsXCIpKTtcclxuICAgIGNhcmRzLnB1c2goQ2FyZChcImlzZW5ncmltX2Zhb2lsdGlhcm5haFwiKSk7XHJcbiAgICBjYXJkcy5wdXNoKENhcmQoXCJkZWNveVwiKSk7XHJcbiAgfSlcclxuXHJcbiAgaXQoXCJpdCBzaG91bGQgZmlsdGVyIGhlcm9lcyBvdXRcIiwgZnVuY3Rpb24oKXtcclxuICAgIHZhciByZXMgPSBmaWx0ZXIoY2FyZHMsIHtcclxuICAgICAgXCJhYmlsaXR5XCI6IFwiaGVyb1wiXHJcbiAgICB9KVxyXG4gICAgZXhwZWN0KHJlcy5sZW5ndGgpLnRvQmUoMik7XHJcbiAgfSlcclxuXHJcbiAgaXQoXCJpdCBzaG91bGQgZmlsdGVyIGhlcm8gYW5kIHNwZWNpYWwgY2FyZHMgb3V0XCIsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgcmVzID0gZmlsdGVyKGNhcmRzLCB7XHJcbiAgICAgIFwiYWJpbGl0eVwiOiBcImhlcm9cIixcclxuICAgICAgXCJ0eXBlXCI6IENhcmQuVFlQRS5TUEVDSUFMXHJcbiAgICB9KVxyXG4gICAgZXhwZWN0KHJlcy5sZW5ndGgpLnRvQmUoMSk7XHJcbiAgfSlcclxuXHJcblxyXG59KSIsInJlcXVpcmUoXCIuL2ZpbHRlclNwZWNcIik7XHJcblxyXG4oZnVuY3Rpb24gbWFpbigpe1xyXG5cclxufSkoKTtcclxuIl19
