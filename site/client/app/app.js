var Vue = require('vue');
var router = require('./routes');

Vue.use(require('vue-resource'));
Vue.http.headers.common['X-CSRF-TOKEN'] = $('.token').attr('content');

var app = new Vue({

  el: 'body',

  data: {
    name: '',
    view: '',
    section: ''
  },

  components: {
    landing: require('./components/landing'),
    lobby: require('./components/lobby')
  }

});

router.init(app);