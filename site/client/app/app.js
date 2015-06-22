var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter)
Vue.use(require('vue-resource'));
Vue.http.headers.common['X-CSRF-TOKEN'] = $('.token').attr('content');

var app = Vue.extend({
  components: {
    inner: require('./components/inner'),
    landing: require('./components/landing')
  }
});

var routes = require('./routes');
var router = new VueRouter(routes.options);

router.map(routes.maps);
router.start(app, 'body');

new Vue({
  el: 'body'
});