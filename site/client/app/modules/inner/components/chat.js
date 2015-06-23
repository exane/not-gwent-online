module.exports = {

  template: require('../views/chat.html'),

  data: function() {
    return {
      message: ''
    }
  },

  methods: {
    submitChat: function(e) {
      e.preventDefault();

      console.log(this.message);
    }
  }

};