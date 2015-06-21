var elixir = require('laravel-elixir');

elixir.config.sourcemaps = false;

elixir.config.cssOutput = './../public/assets/css';
elixir.config.jsOutput = './../public/assets/js';
elixir.config.assetsDir = 'assets/';
elixir.config.publicDir = '../public/';

elixir(function(mix) {
  mix.sass('app.scss');
  mix.browserify('../../app/app.js');
});
