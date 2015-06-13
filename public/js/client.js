var io = require("socket.io-client")/*("http://localhost:16918")*/;
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
  "URL": "http://localhost",
  "PORT": 16918
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
    this.socket = io(Config.Server.URL + ":" + Config.Server.PORT);
  },
  receive: function(event, cb){
    this.socket.on(event, cb);
  },
  receiveOnce: function(event, cb){
    this.socket.once(event, cb);
  },
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

/*var Partial = Backbone.View.extend({
  initialize: function(options){
    this.template = Handlebars.compile($(options.templateID).html());
    this.infoData = this.infoData || {};
    this.app = options.app;
    var self = this;

this.listenTo(this.infoData, "change", this.render);
    this.app.on("update:info", function(d) {
      self.infoData = d;
      self.render();
    });
    this.render();
  },
  render: function(){
    var self = this;
    var d = this.infoData;
    this.$el.html(this.template({
      name: d.name,
      score: d.score,
      hand: d.hand,
      lives: d.lives
    }));
    return this;
  }
});*/

var SideView = Backbone.View.extend({
  el: ".container",
  initialize: function(options){
    var self = this;
    this.side = options.side;
    this.app = options.app;
    this.battleView = options.battleView;
    this.infoData = this.infoData || {};

    this.$info = this.$el.find(".game-info" + this.side);
    this.$fields = this.$el.find(".battleside" + this.side);
    /*this.$info = new Partial({
      templateID: "#info-template",
      el: ".game-info"+this.side,
      app: this.app
    });*/

    /*this.app.on("update:info", function(d){
      self.infoData = d.infoData;
      console.log(d);
      self.render();
    });*/

  },
  render: function(){
    var d = this.infoData;
    this.$info = this.$el.find(".game-info" + this.side);
    this.$info.find(".info-name").html(d.name);
    this.$info.find(".score").html(d.score);
    this.$info.find(".hand-card").html(d.hand);
    this.$info.find(".gwent-lives").html(this.lives(d.lives));
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

    this.$hand = this.$el.find(".field-hand");
    this.$preview = this.$el.find(".card-preview");

    app.receive("update:hand", function(data){
      console.log("update:hand", user.get("roomSide"), data._roomSide);
      if(user.get("roomSide") == data._roomSide){
        self.handCards = JSON.parse(data.cards);
        self.render();
      }
    });

    app.receive("update:info", function(data){
      var _side = data._roomSide;
      var infoData = data.info;


      var side = yourSide;
      if(user.get("roomSide") != _side){
        side = otherSide;
      }
      console.log(side);
      side.infoData = infoData;
      side.render();
      //app.trigger("update:info", {side: side, infoData: infoData});
    })

    var interval = setInterval(function(){
      if(!user.get("room")) return;
      this.app.send("request:gameLoaded", {_roomID: user.get("room")});
      clearInterval(interval);
    }.bind(this), 100);

    this.render();

    yourSide = this.yourSide = new SideView({side: ".player", app: this.app, battleView: this});
    otherSide = this.otherSide = new SideView({side: ".foe", app: this.app, battleView: this});

    /*yourSide = this.yourSide = new SideView({side: ".player", app: app, battleView: this});
    otherSide = this.otherSide = new SideView({side: ".foe", app: app, battleView: this});*/
  },
  events: {
    "mouseover .card": "onMouseover",
    "mouseleave .card": "onMouseleave"
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
  }
});

var User = Backbone.Model.extend({
  defaults: {
    name: ""
  },
  initialize: function(){
    var self = this;
    var app = this.get("app");


    app.receive("response:name", function(data){
      self.set("name", data.name);
    });

    app.receive("init:battle", function(data){
      console.log("opponent found!");
      self.set("roomSide", data.side);
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
