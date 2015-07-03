let socket = require("socket.io-client");
let Backbone = require("backbone");
require("./backbone.modal-min");
let Handlebars = require('handlebars/runtime').default;
let $ = require("jquery");

let cardData = require("../../assets/data/cards");
let abilityData = require("../../assets/data/abilities");

window.$ = $;

Handlebars.registerPartial("card", require("../templates/cards.handlebars"));
Handlebars.registerHelper("health", function(lives){
  let out = "";

  for(let i = 0; i < 2; i++) {
    out += "<i";
    if(i < lives){
      out += " class='ruby'";
    }
    out += "></i>";
  }
  return out;
});
Handlebars.registerHelper("formatMessage", function(msg){
  let out = "";
  var lines = msg.split(/\n/g);

  lines.forEach(function(line){
    out += line + "<br>";
  })

  return out;
});

let App = Backbone.Router.extend({
  routes: {
    /*"lobby": "lobbyRoute",
    "battle": "battleRoute",
    "*path": "defaultRoute"*/
  },
  initialize: function(){
    let self = this;
    this.connect();
    this.user = new User({app: this});

    /*Backbone.history.start();*/
    this.lobbyRoute();
  },
  connect: function(){
    this.socket = socket(Config.Server.hostname + ":" + Config.Server.port);
    var self = this;
    console.log(this.socket.connected);
    this.socket.on("connect", function(socket){
      self.user.set("serverOffline", false);
    })
    this.socket.on("disconnect", function(socket){
      self.user.set("serverOffline", true);
    })
  },
  receive: function(event, cb){
    this.socket.on(event, cb);
  }, /*
  receiveOnce: function(event, cb){
    this.socket.once(event, cb);
  },*/
  send: function(event, data){
    data = data || null;
    let socket = this.socket;

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
    let regex = /(\w+):?(\w*)\|?/g;
    let res = {};
    let r;
    while(r = regex.exec(event)) {
      res[r[1]] = r[2];
    }

    return res;
  }
});

let SideView = Backbone.View.extend({
  el: ".container",
  template: require("../templates/cards.handlebars"),
  templateCards: require("../templates/fieldCards.handlebars"),
  templateInfo: require("../templates/info.handlebars"),
  initialize: function(options){
    let self = this;
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
    let d = this.infoData;
    let l = this.leader;
    let html = this.templateInfo({
      data: d,
      leader: l,
      passBtn: this.side === ".player"
    })

    this.$info = this.$el.find(".game-info" + this.side).html(html);


    if(this.app.user.get("waiting") && this.side === ".player"){
      this.$info.addClass("removeBackground");
    }
    if(!this.app.user.get("waiting") && this.side === ".foe"){
      this.$info.addClass("removeBackground");
    }
  },
  renderCloseField: function(){
    if(!this.field.close) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    let $field = this.$fields.find(".field-close").parent();
    let cards = this.field.close.cards;
    let score = this.field.close.score;
    let horn = this.field.close.horn;


    let html = this.templateCards(cards);

    $field.find(".field-close").html(html)
    $field.find(".large-field-counter").html(score)
    if(horn){
      this.$fields.find(".field-horn-close").html(this.template(horn));
    }

    let isInfluencedByWeather;
    this.field.weather.cards.forEach((card) =>{
      let key = card._key;
      if(key === "biting_frost") isInfluencedByWeather = true;
    })

    if(isInfluencedByWeather){
      $field.addClass("field-frost");
    }

    //calculateCardMargin($field.find(".card"), 351, 70, cards.length);
    this.battleView.calculateMargin($field.find(".field-close"));
  },
  renderRangeField: function(){
    if(!this.field.ranged) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    let $field = this.$fields.find(".field-range").parent();
    let cards = this.field.ranged.cards;
    let score = this.field.ranged.score;
    let horn = this.field.ranged.horn;

    let html = this.templateCards(cards);

    $field.find(".field-range").html(html)
    $field.find(".large-field-counter").html(score)
    if(horn){
      this.$fields.find(".field-horn-range").html(this.template(horn));
    }

    let isInfluencedByWeather;
    this.field.weather.cards.forEach((card) =>{
      let key = card._key;
      if(key === "impenetrable_fog") isInfluencedByWeather = true;
    })

    if(isInfluencedByWeather){
      $field.addClass("field-fog");
    }

    //calculateCardMargin($field.find(".card"), 351, 70, cards.length);
    this.battleView.calculateMargin($field.find(".field-range"));
  },
  renderSiegeField: function(){
    if(!this.field.siege) return;
    this.$fields = this.$el.find(".battleside" + this.side);
    let $field = this.$fields.find(".field-siege").parent();
    let cards = this.field.siege.cards;
    let score = this.field.siege.score;
    let horn = this.field.siege.horn;

    let html = this.templateCards(cards);

    $field.find(".field-siege").html(html)
    $field.find(".large-field-counter").html(score)
    if(horn){
      this.$fields.find(".field-horn-siege").html(this.template(horn));
    }

    let isInfluencedByWeather;
    this.field.weather.cards.forEach((card) =>{
      let key = card._key;
      if(key === "torrential_rain") isInfluencedByWeather = true;
    })

    if(isInfluencedByWeather){
      $field.addClass("field-rain");
    }

    //calculateCardMargin($field.find(".card"), 351, 70, cards.length);
    this.battleView.calculateMargin($field.find(".field-siege"));
  },
  renderWeatherField: function(){
    if(!this.field.weather) return;
    let $weatherField = this.$el.find(".field-weather");
    let cards = this.field.weather.cards;
    $weatherField.html(this.templateCards(cards));

    this.battleView.calculateMargin($weatherField, 0);
    return this;
  }
  /*,
  lives: function(lives){
    let out = "";
    for(let i = 0; i < 2; i++) {
      out += "<i";
      if(i < lives){
        out += " class='ruby'";
      }
      out += "></i>";
    }
    return out;
  }*/
});

let BattleView = Backbone.View.extend({
  el: ".gwent-battle",
  template: require("../templates/battle.handlebars"),
  initialize: function(options){
    let self = this;
    let user = this.user = options.user;
    let app = this.app = options.app;
    let yourSide, otherSide;

    $(this.el).prependTo('gwent-battle');

    this.listenTo(user, "change:showPreview", this.renderPreview);
    this.listenTo(user, "change:waiting", this.render);
    this.listenTo(user, "change:passing", this.render);
    this.listenTo(user, "change:openDiscard", this.render);
    this.listenTo(user, "change:setAgile", this.render);
    this.listenTo(user, "change:setHorn", this.render);
    this.listenTo(user, "change:isReDrawing", this.render);
    this.listenTo(user, "change:chooseSide", this.render);

    this.$hand = this.$el.find(".field-hand");
    this.$preview = this.$el.find(".card-preview");

    //$(window).on("resize", this.calculateMargin.bind(this, this.$hand));

    let interval = setInterval(function(){
      if(!user.get("room")) return;
      this.setUpBattleEvents();
      this.app.send("request:gameLoaded", {_roomID: user.get("room")});
      clearInterval(interval);
    }.bind(this), 10);

    this.render();


    this.yourSide = new SideView({side: ".player", app: this.app, battleView: this});
    this.otherSide = new SideView({side: ".foe", app: this.app, battleView: this});

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

    let self = this;
    let $card = $(e.target).closest(".card");
    let id = $card.data("id");
    let key = $card.data("key");

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
      //console.log("its decoy!!!");
      this.user.set("waitForDecoy", id);
      this.render();
    }
  },
  onClickFieldCard: function(e){
    if(this.user.get("waitForDecoy")){
      let $card = $(e.target).closest(".card");
      if(!$card.length) return;
      let _id = $card.data("id");

      if($card.parent().hasClass("field-horn")) return;

      this.app.send("decoy:replaceWith", {
        cardID: _id
      })
      this.user.set("waitForDecoy", false);
    }
    if(this.user.get("setAgile")){
      let $field = $(e.target).closest(".field.active").find(".field-close, .field-range");

      //console.log($field);
      let target = $field.hasClass("field-close") ? 0 : 1;
      this.app.send("agile:field", {
        field: target
      });
      this.user.set("setAgile", false);
    }
    if(this.user.get("setHorn")){
      let $field = $(e.target).closest(".field.active").find(".field-close, .field-range, .field-siege");

      //console.log($field);
      let target = $field.hasClass("field-close") ? 0 : ($field.hasClass("field-range") ? 1 : 2);
      this.app.send("horn:field", {
        field: target
      });
      this.user.set("setHorn", false);
    }
  },
  onMouseover: function(e){
    let target = $(e.target).closest(".card");
    //this.user.set("showPreview", target.find("img").attr("src"));
    //this.user.set("showPreview", target.data().key);
    this.user.set("showPreview", new Preview({key: target.data().key}));
  },
  onMouseleave: function(e){
    this.user.get("showPreview").remove();
    this.user.set("showPreview", null);
  },
  openDiscard: function(e){
    let $discard = $(e.target).closest(".field-discard");
    //console.log("opened discard");
    let side;
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
    let self = this;
    this.$el.html(this.template({
      cards: self.handCards,
      active: {
        close: self.user.get("setAgile") || self.user.get("setHorn"),
        range: self.user.get("setAgile") || self.user.get("setHorn"),
        siege: self.user.get("setHorn")
      },
      isWaiting: self.user.get("waiting")
    }));
    if(!(this.otherSide && this.yourSide)) return;
    this.otherSide.render();
    this.yourSide.render();


    if(this.handCards){
      this.calculateMargin(this.$el.find(".field-hand"));
    }

    if(this.user.get("isReDrawing")){
      this.user.set("handCards", this.handCards);
      let modal = new ReDrawModal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("openDiscard")){
      let modal = new Modal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("chooseSide")){
      let modal = new ChooseSideModal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("medicDiscard")){
      let modal = new MedicModal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("emreis_leader4")){
      let modal = new LeaderEmreis4Modal({model: this.user});
      this.$el.prepend(modal.render().el);
    }
    if(this.user.get("setAgile")){
      let id = this.user.get("setAgile");
      this.$el.find("[data-id='" + id + "']").addClass("activeCard");
    }
    if(this.user.get("setHorn")){
      let id = this.user.get("setHorn");
      this.$el.find("[data-id='" + id + "']").addClass("activeCard");
    }
    if(this.user.get("waitForDecoy")){
      let id = this.user.get("waitForDecoy");
      this.$el.find("[data-id='" + id + "']").addClass("activeCard");
    }
    return this;
  },
  renderPreview: function(){
    /*let preview = new Preview({key: this.user.get("showPreview")});*/
    let preview = this.user.get("showPreview");
    if(!preview){
      return;
    }
    this.$el.find(".card-preview").html(preview.render().el);
    /*this.$el.find(".card-preview").html(this.templatePreview({src: this.user.get("showPreview")}))
    this.$el.find(".card-preview").css("display", "none");
    if(this.user.get("showPreview")) {
      this.$el.find(".card-preview").css("display", "block");
    }*/
  },
  clickLeader: function(e){
    let $card = $(e.target).closest(".field-leader");
    if(!$card.parent().hasClass("player")) return;
    if($card.find(".card").hasClass("disabled")) return;

    //console.log("click leader");


    this.app.send("activate:leader")
  },
  setUpBattleEvents: function(){
    let self = this;
    let user = this.user;
    let app = user.get("app");

    app.on("update:hand", function(data){
      if(user.get("roomSide") == data._roomSide){
        self.handCards = JSON.parse(data.cards);
        self.user.set("handCards", app.handCards);
        self.render();
      }
    })
    app.on("update:info", function(data){
      let _side = data._roomSide;
      let infoData = data.info;
      let leader = data.leader;

      let side = self.yourSide;
      if(user.get("roomSide") != _side){
        side = self.otherSide;
      }
      side.infoData = infoData;
      side.leader = leader;

      side.infoData.discard = JSON.parse(side.infoData.discard);

      side.render();
    })

    app.on("update:fields", function(data){
      let _side = data._roomSide;

      let side = self.yourSide;
      if(user.get("roomSide") != _side){
        side = self.otherSide;
      }
      side.field.close = data.close;
      side.field.ranged = data.ranged;
      side.field.siege = data.siege;
      side.field.weather = data.weather;
      side.render();
    })

    /*this.battleChannel.watch(function(d){
      let event = d.event, data = d.data;

      if(event === "update:hand"){
        if(user.get("roomSide") == data._roomSide){
          self.handCards = JSON.parse(data.cards);
          self.user.set("handCards", self.handCards);
          self.render();
        }
      }
      else if(event === "update:info"){
        let _side = data._roomSide;
        let infoData = data.info;
        let leader = data.leader;

        let side = self.yourSide;
        if(user.get("roomSide") != _side){
          side = self.otherSide;
        }
        side.infoData = infoData;
        side.leader = leader;

        side.infoData.discard = JSON.parse(side.infoData.discard);

        side.render();
      }
      else if(event === "update:fields"){
        let _side = data._roomSide;

        let side = self.yourSide;
        if(user.get("roomSide") != _side){
          side = self.otherSide;
        }
        side.field.close = data.close;
        side.field.ranged = data.ranged;
        side.field.siege = data.siege;
        side.field.weather = data.weather;
        side.render();
      }
    })*/
  },
  calculateMargin: function($container, minSize){
    minSize = typeof minSize === "number" && minSize >= 0 ? minSize : 6;
    var n = $container.children().size();
    let w = $container.width(), c = $container.find(".card").outerWidth() + 3;
    let res;
    if(n < minSize)
      res = 0;
    else {
      res = -((w - c) / (n - 1) - c) + 1
    }

    $container.find(".card").css("margin-left", -res);
  }
});

let Modal = Backbone.Modal.extend({
  template: require("../templates/modal.handlebars"),
  cancelEl: ".bbm-close",
  cancel: function(){
    this.model.set("openDiscard", false);
  }
});

let MedicModal = Modal.extend({
  template: require("../templates/modal.medic.handlebars"),
  events: {
    "click .card": "onCardClick"
  },
  onCardClick: function(e){
    //console.log($(e.target).closest(".card"));
    let id = $(e.target).closest(".card").data().id;
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

let LeaderEmreis4Modal = Modal.extend({
  template: require("../templates/modal.emreis_leader4.handlebars"),
  events: {
    "click .card": "onCardClick"
  },
  onCardClick: function(e){
    let id = $(e.target).closest(".card").data().id;
    this.model.get("app").send("emreis_leader4:chooseCardFromDiscard", {
      cardID: id
    })
    this.model.set("emreis_leader4", false);
  },
  cancel: function(){
    this.model.get("app").send("emreis_leader4:chooseCardFromDiscard")
    this.model.set("emreis_leader4", false);
  }
});

let ReDrawModal = Modal.extend({
  template: require("../templates/modal.redraw.handlebars"),
  initialize: function(){
    this.listenTo(this.model, "change:isReDrawing", this.cancel);
  },
  events: {
    "click .card": "onCardClick"
  },
  onCardClick: function(e){
    //console.log($(e.target).closest(".card"));
    let id = $(e.target).closest(".card").data().id;
    this.model.get("app").send("redraw:reDrawCard", {
      cardID: id
    })
  },
  cancel: function(){
    if(!this.model.get("isReDrawing")) return;
    this.model.get("app").send("redraw:close_client");
    this.model.set("isReDrawing", false);
  }
});

let WinnerModal = Modal.extend({
  template: require("../templates/modal.winner.handlebars")
});

let ChooseSideModal = Modal.extend({
  template: require("../templates/modal.side.handlebars"),
  events: {
    "click .btn": "onBtnClick"
  },
  beforeCancel: function(){
    return false;
  },
  onBtnClick: function(e){
    var id = $(e.target).data().id;

    this.model.set("chooseSide", false);
    if(id === "you"){
      //this.model.set("chosenSide", this.model.get("roomSide"));
      this.model.chooseSide(this.model.get("roomSide"));
      this.remove();
      return;
    }
    //this.model.set("chosenSide", this.model.get("roomFoeSide"));
    this.model.chooseSide(this.model.get("roomFoeSide"));
    this.remove();
  }
});

let User = Backbone.Model.extend({
  defaults: {
    name: localStorage["userName"] || null,
    deck: localStorage["userDeck"] || "random",
    serverOffline: true
  },
  initialize: function(){
    let self = this;
    let user = this;
    let app = user.get("app");

    self.set("chooseSide", false);

    this.listenTo(this.attributes, "change:room", this.subscribeRoom);

    app.receive("response:name", function(data){
      self.set("name", data.name);
    });

    app.receive("init:battle", function(data){
      //console.log("opponent found!");
      self.set("roomSide", data.side);
      self.set("roomFoeSide", data.foeSide);
      /*
            self.set("channel:battle", app.socket.subscribe(self.get("room")));*/
      //app.navigate("battle", {trigger: true});
      app.battleRoute();
    })

    app.receive("response:joinRoom", function(roomID){
      self.set("room", roomID);
      //console.log("room id", self.get("room"));
    })

    app.receive("set:waiting", function(data){
      let waiting = data.waiting;
      self.set("waiting", waiting);
    })

    app.receive("set:passing", function(data){
      let passing = data.passing;
      self.set("passing", passing);
    })

    app.receive("foe:left", function(){
      //console.log("your foe left the room");
      $(".container").prepend('<div class="alert alert-danger">Your foe left the battle!</div>')
    })

    app.receive("played:medic", function(data){
      let cards = JSON.parse(data.cards);
      self.set("medicDiscard", {
        cards: cards
      });
    })

    app.receive("played:emreis_leader4", function(data){
      let cards = JSON.parse(data.cards);
      self.set("emreis_leader4", {
        cards: cards
      });
    })

    app.receive("played:agile", function(data){
      //console.log("played agile");
      self.set("setAgile", data.cardID);
    })

    app.receive("played:horn", function(data){
      //console.log("played horn");
      self.set("setHorn", data.cardID);
    })

    app.receive("redraw:cards", function(){
      self.set("isReDrawing", true);
    })

    app.receive("redraw:close", function(){
      self.set("isReDrawing", false);
    })

    app.receive("update:hand", function(data){
      app.trigger("update:hand", data);
    })
    app.receive("update:fields", function(data){
      app.trigger("update:fields", data);
    })
    app.receive("update:info", function(data){
      app.trigger("update:info", data);
    })

    app.receive("gameover", function(data){
      let winner = data.winner;

      //console.log("gameover");

      let model = Backbone.Model.extend({});
      let modal = new WinnerModal({model: new model({winner: winner})});
      $("body").prepend(modal.render().el);
    })
    app.receive("request:chooseWhichSideBegins", function(){
      self.set("chooseSide", true);
    })

    app.on("startMatchmaking", this.startMatchmaking, this);
    app.on("joinRoom", this.joinRoom, this);
    app.on("setName", this.setName, this);
    app.on("setDeck", this.setDeck, this);


    app.receive("notification", function(data){
      new Notification(data).render();
    })

    app.send("request:name", this.get("name") === null ? null : {name: this.get("name")});
    app.send("set:deck", this.get("deck") === null ? null : {deck: this.get("deck")});
  },
  startMatchmaking: function(){
    this.set("inMatchmakerQueue", true);
    this.get("app").send("request:matchmaking");
  },
  joinRoom: function(){
    this.get("app").send("request:joinRoom");
    this.set("inMatchmakerQueue", false);
  },
  subscribeRoom: function(){
    let room = this.get("room");
    let app = this.get("app");
    //app.socket.subscribe(room);
  },
  setName: function(name){
    this.get("app").send("request:name", {name: name});
    localStorage["userName"] = name;
  },
  setDeck: function(deckKey){
    //console.log("deck: ", deckKey);
    this.set("deckKey", deckKey);
    localStorage["userDeck"] = deckKey;
    this.get("app").send("set:deck", {deck: deckKey});
  },
  chooseSide: function(roomSide){
    this.get("app").send("response:chooseWhichSideBegins", {
      side: roomSide
    })
  }
});

let Lobby = Backbone.View.extend({
  defaults: {
    id: ""
  },

  template: require("../templates/lobby.handlebars"),
  initialize: function(options){
    this.user = options.user;
    this.app = options.app;

    this.app.receive("update:playerOnline", this.renderStatus.bind(this));

    this.listenTo(this.app.user, "change:serverOffline", this.render);
    this.listenTo(this.app.user, "change:name", this.setName);
    $(".gwent-battle").html(this.el);
    this.render();
  },
  events: {
    "click .startMatchmaking": "startMatchmaking",
    /*"click .join-room": "joinRoom",*/
    "blur .name-input": "changeName",
    "change #deckChoice": "setDeck",
    "click .note": "debugNote"
  },
  debugNote: function(){
    new Notification({message: "yoyo TEST\nhallo\n\ntest"}).render();
  },
  render: function(){
    this.$el.html(this.template(this.user.attributes));
    this.$el.find("#deckChoice").val(this.user.get("deck")).attr("selected", true);
    return this;
  },
  startMatchmaking: function(){
    this.$el.find(".image-gif-loader").show();
    this.app.trigger("startMatchmaking");
  },
  joinRoom: function(){
    this.app.trigger("joinRoom");
  },
  setDeck: function(e){
    let val = $(e.target).val();
    this.app.trigger("setDeck", val);
    this.$el.find("#deckChoice option[value='" + val + "']").attr("selected", "selected")
  },
  setName: function(){
    /*let val = $(e.target).val();
    this.app.trigger("setDeck", val);
    this.$el.find("#deckChoice option[value='" + val + "']").attr("selected", "selected")*/
    localStorage["userName"] = this.app.user.get("name");
    /*this.render();*/
    this.$el.find(".name-input").val(this.app.user.get("name"));
  },
  changeName: function(e){
    let name = $(e.target).val();
    this.app.trigger("setName", name);
  },
  renderStatus: function(n){
    this.$el.find(".nr-player-online").html(n);
  }
});

let Preview = Backbone.View.extend({
  template: require("../templates/preview.handlebars"),
  initialize: function(opt){
    this.card = cardData[opt.key];

    if(!this.card || !this.card.ability) return;

    if(Array.isArray(this.card.ability)){
      this.abilities = this.card.ability.slice();
    }
    else {
      this.abilities = [];
      this.abilities.push(this.card.ability);
    }

    this.abilities = this.abilities.map((ability) =>{
      return abilityData[ability].description;
    })

    "lol";
  },
  render: function(){
    let html = this.template({
      card: this.card,
      abilities: this.abilities
    })
    this.$el.html(html);
    return this;
  }
});

let Notification = Backbone.View.extend({
  className: "notification",
  template: require("../templates/notification.handlebars"),
  events: {
    "click .alert": "onClick"
  },
  initialize: function(opt){
    this.opt = opt;
    $(".notifications").append(this.el);
  },
  render: function(){
    this.$el.html(this.template(this.opt));
    this.show();
    return this;
  },
  show: function(){
    let $alert = this.$el.find(".alert");
    $alert.slideDown(600).delay(Config.Gwent.notification_duration).queue(this.hide.bind(this));

  },
  hide: function(){
    let $alert = this.$el.find(".alert");
    $alert.stop().slideUp().queue(this.remove.bind(this));
  },
  onClick: function(){
    this.hide();
  }
});

module.exports = App;
