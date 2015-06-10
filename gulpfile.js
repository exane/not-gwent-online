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
  browserify('./public/js/main.js', {standalone: "app", debug: true})
  .transform(babelify)
  .bundle().on("error", function(err){
    console.log(err);
  })
  .pipe(source('app.js').on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./build/').on("error", function(err){
    console.log(err);
  }));
});

gulp.task('sass', function(){
  gulp.src('./public/scss/*.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }).on("error", function(err){
    console.log(err);
  }))
  .pipe(gulp.dest('./build/').on("error", function(err){
    console.log(err);
  }))
  .pipe(livereload().on("error", function(err){
    console.log(err);
  }));
});

gulp.task("watch", function(){
  gulp.watch("./public/js/*", ["browserify"]);
  gulp.watch("./public/scss/*", ["sass"]);
})

gulp.task("default", ["watch", "browserify", "sass"]);
