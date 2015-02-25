'use strict';

var gulp = require('gulp');
var gulp_uglify = require('gulp-uglify');
var gulp_rename = require('gulp-rename');

// Build

gulp.task('default', function (cb) {
  return gulp.src('lib/base32.js')
  // copy original to dist
  .pipe(gulp.dest('dist'))
  // uglify and copy to dist
  .pipe(gulp_uglify())
  .pipe(gulp_rename('base32.min.js'))
  .pipe(gulp.dest('dist'));
});
