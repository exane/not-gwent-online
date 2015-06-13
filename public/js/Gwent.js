var io = require("socket.io-client")("http://localhost:16918");
var Backbone = require("backbone");
var Handlebars = require("handlebars");
var $ = require("jquery");

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

var App = Backbone.Router.extend({
  routes: {
    "*other": "defaultRoute"
  },
  initialize: function(){

  },
  defaultRoute: function(){

  },
  search: function(){

  }

});

var Player = Backbone.Model.extend({
  defaults: {
    name: "",
    lives: 2,
    MAX_LIVES: 2,
    hand: 0,
    score: 0
  },
  initialize: function(){
    var self = this;
    window.self = self;
    this.send("request:name", this.get("name") == "unnamed" ? null : {name: this.get("name")});

    this.receive("response:name", function(data){
      self.set("name", data.name);
    });

    this.receive("init:battle", function(){
      console.log("opponent found!");

    })


    this.receive("response:createRoom", function(roomID){
      self.get("room").set("id", roomID);
      console.log("room created", roomID);
    });
    this.receive("response:joinRoom", function(roomID){
      var room = new Room();
      room.set("id", roomID);
      self.set("room", room);
    })

  },
  receive: function(event, cb){
    this.get("socket").on(event, cb);
  },
  send: function(event, data, room){
    data = data || null;
    room = room || null;
    var socket = this.get("socket");

    if(!data && !room){
      socket.emit(event);
    }
    else if(data && !room){
      socket.emit(event, data);
    }
    else if(!data && room){
      socket.to(room).emit(event);
    }
    else {
      socket.to(room).emit(event, data);
    }
  },
  setName: function(name){
    this.send("request:name", {name: name});
  }
});

var Battleside = Backbone.Model.extend({

});

var Room = Backbone.Model.extend({
  defaults: {
    id: ""
  },
  initialize: function(){

  }
});

var RoomView = Backbone.View.extend({
  el: ".container",
  template: Handlebars.compile($("#matchmaker-template").html()),
  initialize: function(){
    this.listenTo(this.model, "change", this.render);
    this.render();
  },
  events: {
    "click .create-room": "createRoom",
    "click .join-room": "joinRoom",
    "blur .name-input": "changeName"
  },
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  createRoom: function(){
    var room = new Room();
    this.model.set("room", room);
    this.model.send("request:createRoom");
  },
  joinRoom: function(){
    this.model.send("request:joinRoom");
  },
  changeName: function(e){
    var name = $(e.target).val();
    this.model.setName(name);
  }
})
;

var InfoView = Backbone.View.extend({
  template: Handlebars.compile($("#game-info-template").html()),
  initialize: function(){
    this.listenTo(this.model, "change", this.render);
    this.render();
  },
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});


var Gwent = (function(){
  var Gwent = function(){
    if(!(this instanceof Gwent)){
      return (new Gwent());
    }
    /**
     * constructor here
     */


  };
  var r = Gwent.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */
  r.view = null;
  r.foe = null;
  r.player = null;
  r.playerView = null;
  r.foeView = null;


  r.init = function(){
    var app = new App();
    Backbone.history.start();

    window.player = this.player = new Player({
      battleside: new Battleside(),
      socket: io
    });

    /* this.playerView = new InfoView({
       el: ".game-info-player",
       model: this.player
     });*/

    this.roomView = new RoomView({
      model: this.player
    });

  }


  return Gwent;
})();

module.exports = Gwent;