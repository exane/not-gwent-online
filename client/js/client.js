/*("http://localhost:16918")*/
var socketCluster = require("socketcluster-client");
var Backbone = require("backbone");
require("./backbone.modal-min");
var Handlebars = require("handlebars");
var $ = require("jquery");

window.$ = $;

var App = Backbone.Router.extend({
  routes: {
    "lobby": "lobbyRoute",
    "battle": "battleRoute",
    "*path": "defaultRoute"
  },
  initialize: function(){
    var self = this;
    this.connect();
    this.user = new User({app: this});

    Backbone.history.start();
  },
  connect: function(){
    this.socket = socketCluster.connect(Config.Server);
  },
  receive: function(event, cb){
    this.socket.on(event, cb);
  }, /*
  receiveOnce: function(event, cb){
    this.socket.once(event, cb);
  },*/
  send: function(event, data){
    data = data || null;
    var socket = this.socket;

    if(!data){
      socket.emit(event);
    }
    if(data){
      socket.emit(event, data);
    }
  },

  lobbyRoute: function(){
    if(this.currentView){
      this.currentView.remove();
    }
    this.currentView = new Lobby({
      app: this,
      user: this.user
    });
  },
  battleRoute: function(){
    if(this.currentView){
      this.currentView.remove();
    }
    this.currentView = new BattleView({
      app: this,
      user: this.user
    });
  },
  defaultRoute: function(path){
    this.navigate("lobby", {trigger: true});
  },
  parseEvent: function(event){
    var regex = /(\w+):?(\w*)\|?/g;
    var res = {};
    var r;
    while(r = regex.exec(event)) {
      res[r[1]] = r[2];
    }

    return res;
  }
});

var SideView = Backbone.View.extend({
  el: ".container",
  template: require("../templates/cards.handlebars"),
  templateCards: require("../templates/fieldCards.handlebars"),
  initialize: function(options){
    var self = this;
    this.side = options.side;
    this.app = options.app;
    this.battleView = options.battleView;
    this.infoData = this.infoData || {};
    this.leader = this.leader || {};
    this.field = this.field || {};


  },
  render: function(){
    this.renderInfo();
    this.renderCloseField();
    this.renderRangeField();
    this.renderSiegeField();
    this.renderWeatherField();

    return this;
  },
  renderInfo: function(){
    var d = this.infoData;
    var l = this.leader;
    this.$info = this.$el.find(".game-info" + this.side);
    this.$info.find(".info-name").html(d.name);
    this.$info.find(".score").html(d.score);
    this.$info.find(".hand-card").html(d.hand);
    this.$info.find(".gwent-lives").html(this.lives(d.lives));
    if(l._key){
      this.$info.find(".field-leader").html(this.template(l))
    }

    if(this.app.user.get("waiting") && this.side === ".player"){
      this.$info.addClass("removeBackground");
    }
    if(!this.app.user.get("waiting") && this.side === ".foe"){
      this.$info.addClass("removeBackground");
    }

    this.$info.find(".passing").html(d.passing ? "Passed" : "");

  },
  renderCloseField: function(){
    if(!this.field.close) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    var $field = this.$fields.find(".field-close").parent();
    var cards = this.field.close.cards;
    var score = this.field.close.score;
    var horn = this.field.close.horn;


    var html = this.templateCards(cards);

    $field.find(".field-close").html(html)
    $field.find(".large-field-counter").html(score)
    if(horn){
      this.$fields.find(".field-horn-close").html(this.template(horn));
    }

    calculateCardMargin($field.find(".card"), 351, 70, cards.length);
  },
  renderRangeField: function(){
    if(!this.field.ranged) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    var $field = this.$fields.find(".field-range").parent();
    var cards = this.field.ranged.cards;
    var score = this.field.ranged.score;
    var horn = this.field.ranged.horn;

    var html = this.templateCards(cards);

    $field.find(".field-range").html(html)
    $field.find(".large-field-counter").html(score)
    if(horn){
      this.$fields.find(".field-horn-range").html(this.template(horn));
    }

    calculateCardMargin($field.find(".card"), 351, 70, cards.length);
  },
  renderSiegeField: function(){
    if(!this.field.siege) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    var $field = this.$fields.find(".field-siege").parent();
    var cards = this.field.siege.cards;
    var score = this.field.siege.score;
    var horn = this.field.siege.horn;

    var html = this.templateCards(cards);

    $field.find(".field-siege").html(html)
    $field.find(".large-field-counter").html(score)
    if(horn){
      this.$fields.find(".field-horn-siege").html(this.template(horn));
    }

    calculateCardMargin($field.find(".card"), 351, 70, cards.length);
  },
  renderWeatherField: function(){
    if(!this.field.weather) return;
    var $weatherField = this.$el.find(".field-weather");
    var cards = this.field.weather.cards;
    $weatherField.html(this.templateCards(cards));

    return this;
  },
  lives: function(lives){
    var out = "";
    for(var i = 0; i < 2; i++) {
      out += "<i";
      if(i < lives){
        out += " class='ruby'";
      }
      out += "></i>";
    }
    return out;
  }
});

var calculateCardMargin = function($selector, totalWidth, cardWidth, n){
  var w = totalWidth, c = cardWidth;
  var res;
  if(n < 6)
    res = 0;
  else {
    res = -((w - c) / (n - 1) - c) + 1
  }

  $selector.css("margin-left", -res);
}

var BattleView = Backbone.View.extend({
  className: "container",
  template: require("../templates/battle.handlebars"),
  templatePreview: require("../templates/preview.handlebars"),
  initialize: function(options){
    var self = this;
    var user = this.user = options.user;
    var app = this.app = options.app;
    var yourSide, otherSide;

    $(this.el).prependTo('body');

    this.listenTo(user, "change:showPreview", this.renderPreview);
    this.listenTo(user, "change:waiting", this.render);
    this.listenTo(user, "change:passing", this.render);
    this.listenTo(user, "change:openDiscard", this.render);
    this.listenTo(user, "change:setAgile", this.render);
    this.listenTo(user, "change:setHorn", this.render);

    this.$hand = this.$el.find(".field-hand");
    this.$preview = this.$el.find(".card-preview");


    var interval = setInterval(function(){
      if(!user.get("room")) return;
      this.setUpBattleEvents(user.get("room"));
      this.app.send("request:gameLoaded", {_roomID: user.get("room")});
      clearInterval(interval);
    }.bind(this), 10);

    this.render();

    yourSide = this.yourSide = new SideView({side: ".player", app: this.app, battleView: this});
    otherSide = this.otherSide = new SideView({side: ".foe", app: this.app, battleView: this});

  },
  events: {
    "mouseover .card": "onMouseover",
    "mouseleave .card": "onMouseleave",
    "click .field-hand": "onClick",
    "click .battleside.player": "onClickFieldCard",
    "click .button-pass": "onPassing",
    "click .field-discard": "openDiscard",
    "click .field-leader": "clickLeader"
  },
  onPassing: function(){
    if(this.user.get("passing")) return;
    if(this.user.get("waiting")) return;
    this.user.set("passing", true);
    this.user.get("app").send("set:passing");
  },
  onClick: function(e){
    if(!!this.user.get("waiting")) return;
    if(!!this.user.get("passing")) return;

    var self = this;
    var $card = $(e.target).closest(".card");
    var id = $card.data("id");
    var key = $card.data("key");

    if(!!this.user.get("setAgile")){
      if(id === this.user.get("setAgile")){
        this.user.set("setAgile", false);
        this.app.send("cancel:agile");
        this.render();
      }
      return;
    }
    if(!!this.user.get("setHorn")){
      if(id === this.user.get("setHorn")){
        this.user.set("setHorn", false);
        this.app.send("cancel:horn");
        this.render();
      }
      return;
    }
    if(!!this.user.get("waitForDecoy")){
      if(id === this.user.get("waitForDecoy")){
        this.user.set("waitForDecoy", false);
        this.app.send("cancel:decoy");
        this.render();
      }
      return;
    }

    this.app.send("play:cardFromHand", {
      id: id
    });

    if(key === "decoy"){
      console.log("its decoy!!!");
      this.user.set("waitForDecoy", id);
      this.render();
    }
  },
  onClickFieldCard: function(e){
    if(this.user.get("waitForDecoy")){
      var $card = $(e.target).closest(".card");
      if(!$card.length) return;
      var _id = $card.data("id");

      if($card.parent().hasClass("field-horn")) return;

      this.app.send("decoy:replaceWith", {
        cardID: _id
      })
      this.user.set("waitForDecoy", false);
    }
    if(this.user.get("setAgile")){
      var $field = $(e.target).closest(".field.active").find(".field-close, .field-range");

      console.log($field);
      var target = $field.hasClass("field-close") ? 0 : 1;
      this.app.send("agile:field", {
        field: target
      });
      this.user.set("setAgile", false);
    }
    if(this.user.get("setHorn")){
      var $field = $(e.target).closest(".field.active").find(".field-close, .field-range, .field-siege");

      console.log($field);
      var target = $field.hasClass("field-close") ? 0 : ($field.hasClass("field-range") ? 1 : 2);
      this.app.send("horn:field", {
        field: target
      });
      this.user.set("setHorn", false);
    }
  },
  onMouseover: function(e){
    var target = $(e.target).closest(".card");
    this.user.set("showPreview", target.find("img").attr("src"));
  },
  onMouseleave: function(e){
    this.user.set("showPreview", null);
  },
  openDiscard: function(e){
    var $discard = $(e.target).closest(".field-discard");
    console.log("opened discard");
    var side;
    if($discard.parent().hasClass("player")){
      side = this.yourSide;
    }
    else {
      side = this.otherSide;
    }
    this.user.set("openDiscard", {
      discard: side.infoData.discard,
      name: side.infoData.name
    });
  },
  render: function(){
    var self = this;
    this.$el.html(this.template({
      cards: self.handCards,
      active: {
        close: self.user.get("setAgile") || self.user.get("setHorn"),
        range: self.user.get("setAgile") || self.user.get("setHorn"),
        siege: self.user.get("setHorn")
      }
    }));
    if(!(this.otherSide && this.yourSide)) return;
    this.otherSide.render();
    this.yourSide.render();


    if(this.handCards){
      calculateCardMargin(this.$el.find(".field-hand .card"), 538, 70, this.handCards.length);
    }

    if(this.user.get("openDiscard")){
      var modal = new Modal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("medicDiscard")){
      var modal = new MedicModal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("setAgile")){
      var id = this.user.get("setAgile");
      this.$el.find("[data-id='" + id + "']").addClass("activeCard");
    }
    if(this.user.get("setHorn")){
      var id = this.user.get("setHorn");
      this.$el.find("[data-id='" + id + "']").addClass("activeCard");
    }
    if(this.user.get("waitForDecoy")){
      var id = this.user.get("waitForDecoy");
      this.$el.find("[data-id='" + id + "']").addClass("activeCard");
    }
    return this;
  },
  renderPreview: function(){
    this.$el.find(".card-preview").html(this.templatePreview({src: this.user.get("showPreview")}))
  },
  clickLeader: function(e){
    var $card = $(e.target).closest(".field-leader");
    if(!$card.parent().hasClass("player")) return;
    if($card.find(".card").hasClass("disabled")) return;

    console.log("click leader");


    this.app.send("activate:leader")
  },
  setUpBattleEvents: function(channelName){
    this.battleChannel = this.app.socket.subscribe(channelName);
    var self = this;
    var user = this.user;

    this.battleChannel.watch(function(d){
      var event = d.event, data = d.data;

      if(event === "update:hand"){
        if(user.get("roomSide") == data._roomSide){
          self.handCards = JSON.parse(data.cards);
          self.user.set("handCards", self.handCards);
          self.render();
        }
      }
      else if(event === "update:info"){
        var _side = data._roomSide;
        var infoData = data.info;
        var leader = data.leader;

        var side = self.yourSide;
        if(user.get("roomSide") != _side){
          side = self.otherSide;
        }
        side.infoData = infoData;
        side.leader = leader;

        side.infoData.discard = JSON.parse(side.infoData.discard);

        side.render();
      }
      else if(event === "update:fields"){
        var _side = data._roomSide;

        var side = self.yourSide;
        if(user.get("roomSide") != _side){
          side = self.otherSide;
        }
        side.field.close = data.close;
        side.field.ranged = data.ranged;
        side.field.siege = data.siege;
        side.field.weather = data.weather;
        side.render();
      }
    })
  }
});

var Modal = Backbone.Modal.extend({
  template: require("../templates/modal.handlebars"),
  cancelEl: ".bbm-close",
  cancel: function(){
    this.model.set("openDiscard", false);
  }
});

var MedicModal = Modal.extend({
  template: require("../templates/modal.medic.handlebars"),
  events: {
    "click .card": "onCardClick"
  },
  onCardClick: function(e){
    console.log($(e.target).closest(".card"));
    var id = $(e.target).closest(".card").data().id;
    this.model.get("app").send("medic:chooseCardFromDiscard", {
      cardID: id
    })
    this.model.set("medicDiscard", false);
  },
  cancel: function(){
    this.model.get("app").send("medic:chooseCardFromDiscard")
    this.model.set("medicDiscard", false);
  }
});

var User = Backbone.Model.extend({
  defaults: {
    name: "",
    deckKey: "northern_realm"
  },
  initialize: function(){
    var self = this;
    var app = this.get("app");

    this.listenTo(this.attributes, "change:room", this.subscribeRoom);

    app.receive("response:name", function(data){
      self.set("name", data.name);
    });

    app.receive("init:battle", function(data){
      console.log("opponent found!");
      self.set("roomSide", data.side);
      /*
            self.set("channel:battle", app.socket.subscribe(self.get("room")));*/
      app.navigate("battle", {trigger: true});
    })

    app.receive("response:createRoom", function(roomID){
      self.set("room", roomID);
      console.log("room created", roomID);
    });

    app.receive("response:joinRoom", function(roomID){
      self.set("room", roomID);
      console.log("room id", self.get("room"));
    })

    app.receive("set:waiting", function(data){
      var waiting = data.waiting;
      self.set("waiting", waiting);
    })

    app.receive("set:passing", function(data){
      var passing = data.passing;
      self.set("passing", passing);
    })

    app.receive("foe:left", function(){
      console.log("your foe left the room");
      $(".container").prepend('<div class="alert alert-danger">Your foe left the battle!</div>')
    })

    app.receive("played:medic", function(data){
      var cards = JSON.parse(data.cards);
      console.log("played medic");
      self.set("medicDiscard", {
        cards: cards
      });
    })

    app.receive("played:agile", function(data){
      console.log("played agile");
      self.set("setAgile", data.cardID);
    })

    app.receive("played:horn", function(data){
      console.log("played horn");
      self.set("setHorn", data.cardID);
    })

    app.on("createRoom", this.createRoom, this);
    app.on("joinRoom", this.joinRoom, this);
    app.on("setName", this.setName, this);
    app.on("setDeck", this.setDeck, this);


    app.send("request:name", this.get("name") == "unnamed" ? null : {name: this.get("name")});
  },
  createRoom: function(){
    this.get("app").send("request:createRoom");
  },
  joinRoom: function(){
    this.get("app").send("request:joinRoom");
  },
  subscribeRoom: function(){
    var room = this.get("room");
    var app = this.get("app");
    app.socket.subscribe(room);
  },
  setName: function(name){
    this.get("app").send("request:name", {name: name});
  },
  setDeck: function(deckKey){
    console.log("deck: ", deckKey);
    this.set("deckKey", deckKey);
    this.get("app").send("set:deck", {deck: deckKey});
  }
});

var Lobby = Backbone.View.extend({
  defaults: {
    id: ""
  },
  className: "container",

  template: require("../templates/lobby.handlebars"),
  initialize: function(options){
    this.user = options.user;
    this.app = options.app;
    this.listenTo(this.app.user, "change", this.render);
    $(this.el).prependTo('body');
    this.render();
  },
  events: {
    "click .create-room": "createRoom",
    "click .join-room": "joinRoom",
    "blur .name-input": "changeName",
    "change #deckChoice": "setDeck"
  },
  render: function(){
    this.$el.html(this.template(this.user.attributes));
    /*this.$el.find("#deckChoice option[value='" + this.app.user.get("setDeck") + "']").attr("selected", "selected")*/
    return this;
  },
  createRoom: function(){
    this.app.trigger("createRoom");
  },
  joinRoom: function(){
    this.app.trigger("joinRoom");
  },
  setDeck: function(e){
    var val = $(e.target).val();
    this.app.trigger("setDeck", val);
    this.$el.find("#deckChoice option[value='" + val + "']").attr("selected", "selected")
  },
  changeName: function(e){
    var name = $(e.target).val();
    this.app.trigger("setName", name);
  }
});

module.exports = App;
