module.exports = {

  template: require('./../views/search-match.html'),

  inherit: true,

  methods: {
    cancelMatch: function() {
      this.modal = false;
      // trigger match functions
    }
  }

};