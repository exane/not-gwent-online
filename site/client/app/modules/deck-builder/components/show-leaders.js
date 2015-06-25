module.exports = {

  template: require('./../views/show-leaders.html'),

  inherit: true,

  methods: {
    closeLeaders(e) {
      if(e == 'close' || e.target.className == 'modal active' ) {
        this.modalLeader = false;
      }
    },

    chooseLeader(card) {
      // todo: make own leader variable
      for(var item in this.deck) {
        if(this.deck[item].type == 3) {
          this.deck.$set(item, card);
        }
      }

      this.closeLeaders('close');
    }
  }
};