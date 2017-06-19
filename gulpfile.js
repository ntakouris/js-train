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
gulp.task('babuild-lib', function(){
    return gulp.src(['js/train.js', 'js/resources.js', 'js/ui.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('babuild-app', function(){
    return gulp.src(['app.js'])
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest('dist'))
});

gulp.task('babuild', ['babuild-lib', 'babuild-app']);

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