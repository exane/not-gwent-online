var Backbone = require("backbone");
var Handlebars = require("handlebars");
var $ = require("jquery");

var Lobby = Backbone.View.extend({
  defaults: {
    id: ""
  },
  className: "container",

  template: Handlebars.compile($("#matchmaker-template").html()),
  initialize: function(){
    this.app = app;
    this.listenTo(app.user, "change", this.render);
    $(this.el).prependTo('body');
    this.render();
  },
  events: {
    "click .create-room": "createRoom",
    "click .join-room": "joinRoom",
    "blur .name-input": "changeName"
  },
  render: function(){
    this.$el.html(this.template(this.app.user.attributes));
    return this;
  },
  createRoom: function(){
    this.app.send("request:createRoom");
  },
  joinRoom: function(){
    this.app.send("request:joinRoom");
  },
  changeName: function(e){
    var name = $(e.target).val();
    this.app.user.setName(name);
  }
});


module.exports = Lobby;