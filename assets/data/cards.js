/**
 * types
 * 0 close combat
 * 1 ranged
 * 2 siege
 * 3 leader
 * 4 special (decoy)
 * 5 weather
 */


module.exports = {
  "redanian_foot_soldier": {
    name: "Redanian Foot Soldier",
    power: 1,
    ability: null,
    img: "foot_soldier1",
    faction: "northern_realm",
    type: 0
  },
  "poor_fucking_infantry": {
    name: "Poor Fucking Infantry",
    power: 1,
    ability: "tight_bond",
    img: "infantry",
    faction: "northern_realm",
    type: 0
  },
  "yarpen_zigrin": {
    name: "Yarpen Zigrin",
    power: 2,
    ability: null,
    img: "yarpen",
    faction: "northern_realm",
    type: 0
  },
  "blue_stripes_commando": {
    name: "Blue Stripes Commando",
    power: 4,
    ability: "tight_bond",
    img: "commando",
    faction: "northern_realm",
    type: 0
  },
  "sigismund_dijkstra": {
    name: "Sigismund Dijkstra",
    power: 4,
    ability: "spy",
    img: "dijkstra",
    faction: "northern_realm",
    type: 0
  },
  "prince_stennis": {
    name: "Prince Stennis",
    power: 5,
    ability: "spy",
    img: "stennis",
    faction: "northern_realm",
    type: 0
  },
  "siegfried_of_denesle": {
    name: "Siegfried of Denesle",
    power: 5,
    ability: null,
    img: "siegfried",
    faction: "northern_realm",
    type: 0
  },
  "ves": {
    name: "Ves",
    power: 5,
    ability: null,
    img: "ves",
    faction: "northern_realm",
    type: 0
  },
  "vernon_roche": {
    name: "Vernon Roche",
    power: 10,
    ability: "hero",
    img: "roche",
    faction: "northern_realm",
    type: 0
  },
  "john_natalis": {
    name: "John Natalis",
    power: 10,
    ability: "hero",
    img: "natalis",
    faction: "northern_realm",
    type: 0
  },
  "sheldon_skaggs": {
    name: "Sheldon Skaggs",
    power: 4,
    ability: null,
    img: "skaggs",
    faction: "northern_realm",
    type: 1
  },
  "sabrina_glevissig": {
    name: "Sabrina Glevissig",
    power: 4,
    ability: null,
    img: "sabrina",
    faction: "northern_realm",
    type: 1
  },
  "crinfrid_reavers_dragon_hunter": {
    name: "Crinfrid Reaver's Dragon Hunter",
    power: 5,
    ability: "tight_bond",
    img: "crinfrid",
    faction: "northern_realm",
    type: 1
  },
  "sile_de_tansarville": {
    name: "Síle de Tansarville",
    power: 5,
    ability: null,
    img: "sile",
    faction: "northern_realm",
    type: 1
  },
  "keira_metz": {
    name: "Keira Metz",
    power: 5,
    ability: null,
    img: "keira",
    faction: "northern_realm",
    type: 1
  },
  "dethmold": {
    name: "Dethmold",
    power: 6,
    ability: null,
    img: "dethmold",
    faction: "northern_realm",
    type: 1
  },
  "kaedweni_siege_expert": {
    name: "Kaedweni Siege Expert",
    power: 1,
    ability: "morale_boost",
    img: "siege_expert1",
    faction: "northern_realm",
    type: 2
  },
  "dun_banner_medic": {
    name: "Dun Banner Medic",
    power: 5,
    ability: "medic",
    img: "medic",
    faction: "northern_realm",
    type: 2
  },
  "ballista": {
    name: "Ballista",
    power: 6,
    ability: null,
    img: "ballista1",
    faction: "northern_realm",
    type: 2
  },
  "trebuchet": {
    name: "Trebuchet",
    power: 6,
    ability: null,
    img: "trebuchet1",
    faction: "northern_realm",
    type: 2
  },
  "thaler": {
    name: "Thaler",
    power: 1,
    ability: "spy",
    img: "thaler",
    faction: "northern_realm",
    type: 2
  },
  "foltest_king_of_temeria": {
    name: "Foltest: King of Temeria",
    power: -1,
    ability: "foltest_leader1",
    img: "foltest_king",
    faction: "northern_realm",
    type: 3
  },
  "foltest_lord_commander": {
    name: "Foltest: Lord Commander",
    power: -1,
    ability: "foltest_leader2",
    img: "foltest_commander",
    faction: "northern_realm",
    type: 3
  },
  "foltest_siegemaster": {
    name: "Foltest: The Siegemaster",
    power: -1,
    ability: "foltest_leader3",
    img: "foltest_siege",
    faction: "northern_realm",
    type: 3
  },
  "foltest_forged": {
    name: "Foltest: The Steel-Forged",
    power: -1,
    ability: "foltest_leader4",
    img: "foltest_forged",
    faction: "northern_realm",
    type: 3
  },
  "philippa_eilhart": {
    name: "Philippa Eilhart",
    power: 10,
    ability: "hero",
    img: "eilhart",
    faction: "northern_realm",
    type: 1
  },
  "esterad_thyssen": {
    name: "Esterad Thyssen",
    power: 10,
    ability: "hero",
    img: "thyssen",
    faction: "northern_realm",
    type: 0
  },
  "siege_tower": {
    name: "Siege Tower",
    power: 6,
    ability: null,
    img: "siege_tower",
    faction: "northern_realm",
    type: 2
  },
  "catapult": {
    name: "Catapult",
    power: 8,
    ability: "tight_bond",
    img: "catapult",
    faction: "northern_realm",
    type: 2
  },


  "decoy": {
    name: "Decoy",
    power: -1,
    ability: "decoy",
    img: "decoy",
    faction: null,
    type: 4
  },
  "commanders_horn": {
    name: "Commander's Horn",
    power: -1,
    ability: "commanders_horn_card",
    img: "horn",
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
  "biting_frost": {
    name: "Biting Frost",
    power: -1,
    ability: "weather_frost",
    img: "frost",
    faction: null,
    type: 5
  },
  "torrential_rain": {
    name: "Torrential Rain",
    power: -1,
    ability: "weather_rain",
    img: "rain",
    faction: null,
    type: 5
  },
  "clear_weather": {
    name: "Clear Weather",
    power: -1,
    ability: "weather_clear",
    img: "clear",
    faction: null,
    type: 5
  },

  "dandelion": {
    name: "Dandelion",
    power: 2,
    ability: "commanders_horn",
    img: "dandelion",
    faction: null,
    type: 0
  },
  "avallach": {
    name: "Avallac'h",
    power: 0,
    ability: ["hero", "spy"],
    img: "avallach",
    faction: null,
    type: 0
  },

  "francesca_pureblood_elf": {
    name: "Francesca, Pureblood Elf",
    power: -1,
    ability: "francesca_leader1",
    img: "francesca_pureblood",
    faction: "scoiatael",
    type: 3
  },
  "francesca_the_beautiful": {
    name: "Francesca The Beautiful",
    power: -1,
    ability: "francesca_leader2",
    img: "francesca_beautiful",
    faction: "scoiatael",
    type: 3
  },
  "francesca_daisy_of_the_valley": {
    name: "Francesca, Daisy of The Valley",
    power: -1,
    ability: "francesca_leader3",
    img: "francesca_daisy",
    faction: "scoiatael",
    type: 3
  },
  "francesca_queen_of_dol_blathanna": {
    name: "Francesca, Queen of Dol Blathanna",
    power: -1,
    ability: "francesca_leader4",
    img: "francesca_queen",
    faction: "scoiatael",
    type: 3
  },
  "saesenthessis": {
    name: "Saesenthessis",
    power: 10,
    ability: "hero",
    img: "saesenthessis",
    faction: "scoiatael",
    type: 1
  },
  "iorveth": {
    name: "Iorveth",
    power: 10,
    ability: "hero",
    img: "iorveth",
    faction: "scoiatael",
    type: 1
  },
  "isengrim_faoiltiarnah": {
    name: "Isengrim Faoiltiarnah",
    power: 10,
    ability: ["hero", "morale_boost"],
    img: "isengrim",
    faction: "scoiatael",
    type: 0
  },
  "eithne": {
    name: "Eithne",
    power: 10,
    ability: "hero",
    img: "eithne",
    faction: "scoiatael",
    type: 1
  },
  "havekar_healer": {
    name: "Havekar Healer",
    power: 0,
    ability: "medic",
    img: "healer",
    faction: "scoiatael",
    type: 1
  },
  "riordain": {
    name: "Riordain",
    power: 1,
    ability: null,
    img: "riordain",
    faction: "scoiatael",
    type: 1
  },
  "toruviel": {
    name: "Toruviel",
    power: 2,
    ability: null,
    img: "toruviel",
    faction: "scoiatael",
    type: 1
  },
  "elven_skirmisher": {
    name: "Elven Skirmisher",
    power: 2,
    ability: "muster",
    musterType: "skirmisher",
    img: "elven_skirmisher2",
    faction: "scoiatael",
    type: 1
  },
  "dwarven_skirmisher": {
    name: "Dwarven Skirmisher",
    power: 3,
    ability: "muster",
    musterType: "skirmisher",
    img: "skirmisher2",
    faction: "scoiatael",
    type: 0
  },
  "ciaran_aep_easnillien": {
    name: "Ciaran aep Easnillien",
    power: 3,
    ability: "agile",
    img: "easnillien",
    faction: "scoiatael",
    type: 1
  },
  "vrihedd_brigade_recruit": {
    name: "Vrihedd Brigade Recruit",
    power: 4,
    ability: null,
    img: "recruit",
    faction: "scoiatael",
    type: 1
  },
  "dol_blathanna_archer": {
    name: "Dol Blathanna Archer",
    power: 4,
    ability: null,
    img: "archer",
    faction: "scoiatael",
    type: 1
  }, /*
  "hav_caaren_medic": {
    name: "Hav’caaren Medic",
    power: 5,
    ability: null,
    img: "", //missing image
    faction: "scoiatael",
    type: 0
  },*/
  "havekar_smuggler": {
    name: "Havekar Smuggler",
    power: 5,
    ability: "muster",
    img: "smuggler1",
    faction: "scoiatael",
    type: 0
  },
  "mahakaman_defender": {
    name: "Mahakaman Defender",
    power: 5,
    ability: null,
    img: "defender2",
    faction: "scoiatael",
    type: 0
  },
  "vrihedd_brigade_veteran": {
    name: "Vrihedd Brigade Veteran",
    power: 5,
    ability: "agile",
    img: "veteran1",
    faction: "scoiatael",
    type: 0
  },
  "dennis_cranmer": {
    name: "Dennis Cranmer",
    power: 6,
    ability: null,
    img: "cranmer",
    faction: "scoiatael",
    type: 0
  },
  "filavandrel_aen_fidhail": {
    name: "Filavandrel aén Fidháil",
    power: 6,
    ability: "agile",
    img: "fidhail",
    faction: "scoiatael",
    type: 1
  },
  "ida_emean_aep_sivney": {
    name: "Ida Emean aep Sivney",
    power: 6,
    ability: null,
    img: "sivney",
    faction: "scoiatael",
    type: 1
  },
  "yaevinn": {
    name: "Yaevinn",
    power: 6,
    ability: "agile",
    img: "yaevinn",
    faction: "scoiatael",
    type: 0
  },
  "barclay_els": {
    name: "Barclay Els",
    power: 6,
    ability: "agile",
    img: "barclay",
    faction: "scoiatael",
    type: 0
  },
  "dol_blathanna_scout": {
    name: "Dol Blathanna Scout",
    power: 6,
    ability: "agile",
    img: "scout2",
    faction: "scoiatael",
    type: 0
  },
  "milva": {
    name: "Milva",
    power: 10,
    ability: "morale_boost",
    img: "milva",
    faction: "scoiatael",
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
    ability: ["hero", "morale_boost", "agile"],
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
    img: "nekker1",
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
    ability: "agile",
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
}
