var Vue = require('vue');
var router = require('./routes');

require('../../../public/Config.js');

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
    inner: require('./components/inner'),
    landing: require('./components/landing')
  }

});

//router.init(app);