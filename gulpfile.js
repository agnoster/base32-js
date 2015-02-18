'use strict';

var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();


// Add a task to render the output 

gulp.task('help', plugins.taskListing);
 

// Clean

gulp.task('clean', function (cb) {
  del('dist', cb);
});


// Build

gulp.task('build', ['clean'], function (cb) {
  return gulp.src('lib/base32.js')
  // copy original to dist
  .pipe(gulp.dest('dist'))
  // uglify and copy to dist
  .pipe(plugins.uglify())
  .pipe(plugins.rename('base32.min.js'))
  .pipe(gulp.dest('dist'));
});


// Default is to build

gulp.task('default', ['build']);
