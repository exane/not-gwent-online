module.exports = {

  template: require('../../views/modals/searchMatch.html'),

  inherit: true,

  methods: {
    cancelMatch: function() {
      this.modal = false;
      // trigger match functions
    }
  }

};