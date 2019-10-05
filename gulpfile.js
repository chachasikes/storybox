'use strict';

const sass = require('gulp-sass');
const { task, watch, src, dest, series } = require('gulp');
const autoprefix = require('gulp-autoprefixer');
const t2 = require('through2'); // Get through2 as t2 @TODO what was this?
const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');

sass.compiler = require('node-sass');

function scss(cb) {
  src('./src/app/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .on('error', sass.logError)
    .pipe(autoprefix({
      browsers: ['> 2%', 'ie >= 10'],
      grid: true
    }))
    .pipe(t2.obj((chunk, enc, cb) => { // Execute through2
      let date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      cb(null, chunk);
    }))
    .pipe(dest('./public/css'))

    cb();
}

function js(cb) {
  src('./src/app/**/*.js')
    // .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(dest('./public'))
    cb();
}

function watcher(cb) {
  watch('./src/app/**/*.scss', series(scss))
  watch('./src/app/**/*.js', series(js))
  cb()
}

module.default = task('default', series([scss, js, watcher]));
