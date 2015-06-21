var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var fs = require("fs");
var babelify = require("babelify");
var livereload = require("gulp-livereload");
var sass = require("gulp-sass");
livereload({start: true});

//fast install
//npm i --save-dev browserify vinyl-source-stream babelify gulp-livereload gulp gulp-sass


gulp.task('browserify', function(){
  browserify('./client/js/main.js', {standalone: "app", debug: true})
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
  gulp.watch("./client/scss/*", ["sass"]);
  gulp.watch("./client/*.html", ["index"]);
  gulp.watch("./test/src/*", ["unit tests"]);
})

gulp.task("index", function() {
  gulp.src("./client/index.html")
  .pipe(gulp.dest("./public/"));

  gulp.src("./client/css/bootstrap.css")
  .pipe(gulp.dest("./public/build"));
})

gulp.task("default", ["watch", "browserify", "sass", "unit tests", "index"]);
