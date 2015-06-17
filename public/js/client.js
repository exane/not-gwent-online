/*("http://localhost:16918")*/
var socketCluster = require("socketcluster-client");
var Backbone = require("backbone");
var Handlebars = require("handlebars");
var $ = require("jquery");
//var Lobby = require("./client-lobby");

window.$ = $;

Handlebars.registerHelper("health", function(lives, options){
  var out = "";

  for(var i = 0; i < 2; i++) {
    out += "<i";
    if(i < lives){
      out += " class='ruby'";
    }
    out += "></i>";
  }
  return out;
});

var Config = {};

Config.Server = {
  "hostname": "localhost",
  "port": 16918,
  secure: false
}

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
  template: Handlebars.compile('<div class="card" data-key="{{_key}}" data-id="{{_id}}">' +
  '<img src="../assets/cards/{{_data.img}}.png">' +
  '</div>'),
  templateCards: Handlebars.compile('{{#each this}}' +
  '<div class="card" data-key="{{_key}}" data-id="{{_id}}">' +
  '{{#if _boost}}<span>+{{_boost}}</span>{{/if}}' +
  '<img src="../assets/cards/{{_data.img}}.png">' +
  '</div>' +
  '{{/each}}'),
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
    this.$info.find(".field-leader").html(this.template(l))

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
    var cards = this.field.close._cards;
    var score = this.field.close._score;

    var html = this.templateCards(cards);

    $field.find(".field-close").html(html)
    $field.find(".large-field-counter").html(score)
  },
  renderRangeField: function(){
    if(!this.field.ranged) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    var $field = this.$fields.find(".field-range").parent();
    var cards = this.field.ranged._cards;
    var score = this.field.ranged._score;

    var html = this.templateCards(cards);

    $field.find(".field-range").html(html)
    $field.find(".large-field-counter").html(score)
  },
  renderSiegeField: function(){
    if(!this.field.siege) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    var $field = this.$fields.find(".field-siege").parent();
    var cards = this.field.siege._cards;
    var score = this.field.siege._score;

    var html = this.templateCards(cards);

    $field.find(".field-siege").html(html)
    $field.find(".large-field-counter").html(score)
  },
  renderWeatherField: function(){
    if(!this.field.weather) return;
    var $weatherField = this.$el.find(".field-weather");
    var cards = this.field.weather._cards;
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

var BattleView = Backbone.View.extend({
  className: "container",
  template: Handlebars.compile($("#battle-template").html()),
  initialize: function(options){
    var self = this;
    var user = this.user = options.user;
    var app = this.app = options.app;
    var yourSide, otherSide;

    $(this.el).prependTo('body');

    this.listenTo(user, "change:showPreview", this.render);
    this.listenTo(user, "change:waiting", this.render);
    this.listenTo(user, "change:passing", this.render);

    this.$hand = this.$el.find(".field-hand");
    this.$preview = this.$el.find(".card-preview");

    /*//this.battleChannel = app.socket.subscribe()

    app.receive("update:hand", function(data){
      if(user.get("roomSide") == data._roomSide){
        self.handCards = JSON.parse(data.cards);
        self.render();
      }
    });

    app.receive("update:info", function(data){
      var _side = data._roomSide;
      var infoData = data.info;
      var leader = data.leader;


      var side = yourSide;
      if(user.get("roomSide") != _side){
        side = otherSide;
      }
      side.infoData = infoData;
      side.leader = leader;
      side.render();
    });

    app.receive("update:fields", function(data){
      var close, ranged, siege;
      var _side = data._roomSide;

      var side = yourSide;
      if(user.get("roomSide") != _side){
        side = otherSide;
      }


      side.field.close = data.close;
      side.field.ranged = data.ranged;
      side.field.siege = data.siege;
      side.field.weather = data.weather;

      side.render();
    })*/

    var interval = setInterval(function(){
      if(!user.get("room")) return;
      this.setUpBattleEvents(user.get("room"));
      this.app.send("request:gameLoaded", {_roomID: user.get("room")});
      clearInterval(interval);
    }.bind(this), 10);

    this.render();

    yourSide = this.yourSide = new SideView({side: ".player", app: this.app, battleView: this});
    otherSide = this.otherSide = new SideView({side: ".foe", app: this.app, battleView: this});

    /*yourSide = this.yourSide = new SideView({side: ".player", app: app, battleView: this});
    otherSide = this.otherSide = new SideView({side: ".foe", app: app, battleView: this});*/
  },
  events: {
    "mouseover .card": "onMouseover",
    "mouseleave .card": "onMouseleave",
    "click .field-hand": "onClick",
    "click .battleside.player": "onClickDecoy",
    "click .button-pass": "onPassing"
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

    this.app.send("play:cardFromHand", {
      id: id
    });

    if(key === "decoy"){
      console.log("its decoy!!!");
      this.user.set("waitForDecoy", id);
      /*
            this.$el.find(".battleside.player").on("click", ".card", function(e) {
              console.log("replacement card found: ");
              var $card = $(e.target).closest(".card");
              var _id = $card.data("id");
              self.app.send("decoy:replaceWith", {
                oldCard: id,
                newCard: _id
              })
              self.$el.find(".battleside.player").off("click");
            });*/
    }
  },
  onClickDecoy: function(e){
    if(!this.user.get("waitForDecoy")) return;
    console.log("replacement card found: ");
    var $card = $(e.target).closest(".card");
    var _id = $card.data("id");
    this.app.send("decoy:replaceWith", {
      cardID: _id
    })
    this.user.set("waitForDecoy", false);
  },
  onMouseover: function(e){
    var target = $(e.target).closest(".card");
    this.user.set("showPreview", target.find("img").attr("src"));
  },
  onMouseleave: function(e){
    this.user.set("showPreview", null);
  },
  render: function(){
    var self = this;
    this.$el.html(this.template({
      cards: self.handCards,
      preview: self.user.get("showPreview")
    }));
    if(!(this.otherSide && this.yourSide)) return;
    this.otherSide.render();
    this.yourSide.render();
    /* this.$el()
    if(!(this.yourSide && this.otherSide))
      return this;
    this.yourSide.render();
    this.otherSide.render();*/
    return this;
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

var User = Backbone.Model.extend({
  defaults: {
    name: ""
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


    app.on("createRoom", this.createRoom, this);
    app.on("joinRoom", this.joinRoom, this);
    app.on("setName", this.setName, this);


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
  }
});

var Lobby = Backbone.View.extend({
  defaults: {
    id: ""
  },
  className: "container",

  template: Handlebars.compile($("#matchmaker-template").html()),
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
    "blur .name-input": "changeName"
  },
  render: function(){
    this.$el.html(this.template(this.user.attributes));
    return this;
  },
  createRoom: function(){
    this.app.trigger("createRoom");
  },
  joinRoom: function(){
    this.app.trigger("joinRoom");
  },
  changeName: function(e){
    var name = $(e.target).val();
    this.app.trigger("setName", name);
  }
});

module.exports = App;
