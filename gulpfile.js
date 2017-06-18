const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');

gulp.task('html', function(){
    return gulp.src('index.html')
    .pipe(gulp.dest('dist'))
});

//babel-build
gulp.task('babuild', function(){
    return gulp.src(['train.js', 'resource.js', 'ui.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('resources', function(){
  return gulp.src('resources/**')
    .pipe(gulp.dest('dist/resources'))
});

gulp.task('build', [ 'html', 'babuild', 'resources' ]);
gulp.task('default', ['build', 'watch']);

gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['babuild']);
  gulp.watch('index.html', ['html']);
  gulp.watch('resources/**', ['resources']);
});

gulp.task('start', ['default', 'watch']);