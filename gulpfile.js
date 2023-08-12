const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const path = require('path');
const foreach = require('gulp-foreach');
const mode = require('gulp-mode')();

gulp.task('sass', function() {
  return gulp.src('./components/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename({ suffix: '.min', dirname: '' }))
    .pipe(gulp.dest('assets'));
});

gulp.task('js', function() {
  return gulp.src('./components/**/*.js')
    .pipe(foreach(function(stream, file){
      const filename = path.basename(file.path, '.js');
      return stream
        .pipe(
          webpack({
            mode: mode.development() ? 'development' : 'production',
            watch: mode.development(),
          })
        )
        .pipe(rename({ suffix: '.min', dirname: '', basename: filename }))
    }))
    .pipe(gulp.dest('assets'))
});

gulp.task('watch', function() {
  gulp.watch('./components/**/*.scss', gulp.series('sass'));
  gulp.watch('./components/**/*.js', gulp.series('js'));
});

gulp.task('build', gulp.parallel('sass', 'js'));