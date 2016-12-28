const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('default', () => {});

gulp.task('test', cb =>
  gulp.src('./tests/**/*.test.js')
    .pipe(mocha({
      reporter: 'nyan'
    }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      cb();
      process.exit();
    })
);
