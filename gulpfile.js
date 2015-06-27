var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var fs = require("fs");
var spritesmith = require("gulp.spritesmith");
var babelify = require("babelify");
var livereload = require("gulp-livereload");
var sass = require("gulp-sass");
var handlebars = require("browserify-handlebars");
var imagemin = require('gulp-imagemin');
var gm = require("gulp-gm");
var sprity = require("sprity");
var gulpif = require("gulp-if");
livereload({start: true});

//fast install
//npm i --save-dev browserify vinyl-source-stream babelify gulp-livereload gulp gulp-sass


gulp.task('browserify', function(){
  browserify('./client/js/main.js', {standalone: "app", debug: true})
  .transform(handlebars).on("error", function(err){
    console.log(err);
  })
  .transform(babelify)
  .bundle().on("error", function(err){
    console.log(err);
  })
  .pipe(source('app.js').on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./public/build/').on("error", function(err){
    console.log(err);
  }));

});

gulp.task('sass', function(){
  gulp.src('./client/scss/main.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }).on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./public/build/').on("error", function(err){
    console.log(err);
  }))
  .pipe(livereload().on("error", function(err){
    console.log(err);
  }));
});

gulp.task("unit tests", function(){
  browserify('./test/src/mainSpec.js', {standalone: "app", debug: true})
  .transform(babelify)
  .bundle().on("error", function(err){
    console.log(err);
  })
  .pipe(source('spec.js').on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./test/spec/').on("error", function(err){
    console.log(err);
  }));
})

gulp.task("watch", function(){
  gulp.watch("./client/js/*", ["browserify"]);
  gulp.watch("./client/templates/*", ["browserify"]);
  gulp.watch("./client/scss/*", ["sass"]);
  gulp.watch("./client/*.html", ["index"]);
  gulp.watch("./test/src/*", ["unit tests"]);
})



gulp.task("index", function(){
  gulp.src("./client/index.html")
  .pipe(gulp.dest("./public/"));

  gulp.src("./client/css/bootstrap.css")
  .pipe(gulp.dest("./public/build"));
})

gulp.task('resize', function(){
  if(fs.existsSync(__dirname + "/assets/cards/lg/monster/arachas1.png")) {
    console.log("skip resizing");
    return;
  }
  gulp.src('./assets/original_cards/**/*.png')
  .pipe(gm(function(gmfile){
    return gmfile.resize(null, 120);
  }))
  .pipe(gulp.dest('./assets/cards/sm/'));

  gulp.src('./assets/original_cards/**/*.png')
  .pipe(gm(function(gmfile){
    return gmfile.resize(null, 450);
  }))
  .pipe(gulp.dest('./assets/cards/lg/'));
});

gulp.task("sprite", function(){
  /*if(fs.existsSync(__dirname + "/public/build/")) {
    console.log("skip resizing");
    return;
  }*/
  sprity.src({
    src: "./assets/cards/**/*.png",
    style: "_cards.scss",
    //"style-type": "scss",
    processor: "css",
    engine: "gm",
    orientation: "binary-tree",
    split: true,
    cssPath: "../../public/build/",
    prefix: "card",
    name: "cards",
    margin: 0
    //template: "./client/scss/_cards.hbs"
  })
  .pipe(gulpif("*.png", gulp.dest("./public/build/"), gulp.dest("./client/scss/")))
})

gulp.task("default", ["watch", "browserify", "sass", "unit tests", "index", "resize", "sprite"]);
