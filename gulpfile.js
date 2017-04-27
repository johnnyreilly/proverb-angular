/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var tslint = require("gulp-tslint");

var less = require('./gulp/less');
var webpack = require('./gulp/webpack');
var staticFiles = require('./gulp/staticFiles');
var tests = require('./gulp/tests');
var clean = require('./gulp/clean');
var inject = require('./gulp/inject');

var eslintSrcs = ['./gulp/**/*.js'];
var tslintSrcs = ['./src/**/*.ts', './test/**/*.ts', '!**/*.d.ts'];

gulp.task('delete-dist-contents', function (done) {
    clean.run(done);
});

gulp.task('build-less', ['delete-dist-contents'], function(done) {
  less.build().then(function() { done(); });
});

gulp.task('build-js', ['delete-dist-contents'], function (done) {
    webpack.build().then(function () { done(); });
});

gulp.task('build-other', ['delete-dist-contents'], function () {
    staticFiles.build();
});

gulp.task('run-tests', [], function (done) {
    tests.run(done);
});

gulp.task('build', ['build-less', 'build-js', 'build-other', 'eslint', 'tslint'], function () {
    inject.build();
});

gulp.task('eslint', function () {
    return gulp.src(eslintSrcs)
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('tslint', function () {
   return gulp.src(tslintSrcs)
      .pipe(tslint({
         formatter: "verbose"
      }))
      .pipe(tslint.report({
         emitError: false
      }));
});

gulp.task('watch', ['delete-dist-contents'], function (done) {
    process.env.NODE_ENV = 'development';
    Promise.all([
      webpack.watch(),
      less.watch()
    ]).then(function () {
        gutil.log('Now that initial assets (js and css) are generated injection starts...');
        inject.watch();
        done();
    }).catch(function (error) {
        gutil.log('Problem generating initial assets (js and css)', error);
    });

    gulp.watch(eslintSrcs, ['eslint']);
    gulp.watch(tslintSrcs, ['tslint']);
    staticFiles.watch();
    tests.watch();
});

gulp.task('serve', ['watch'], function() {
  // local as not required for build
  var express = require('express')
  var app = express()

  app.use(express.static('dist', {'index': 'index.html'}))
  app.listen(7777);
});