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
    return gulp.src('js/**')
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('resources', function(){
  return gulp.src('resources/**')
    .pipe(gulp.dest('dist/resources'))
});

gulp.task('build', [ 'html', 'babuild', 'resources' ]);
gulp.task('default', ['build']);

gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('index.html', ['html']);
});

gulp.task('server', function() {
  var server = child.spawn('node', ['dist/app.js']);
  var log = fs.createWriteStream('server.log', {flags: 'a'});
  server.stdout.pipe(log);
  server.stderr.pipe(log);
});

gulp.task('start', ['server', 'watch']);