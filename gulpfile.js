const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('babel-core/register');

gulp.task('default', () => {});

gulp.task('test', cb =>
  gulp.src('./tests/**/*.test.js')
    .pipe(mocha({
      reporter: 'spec',
      compilers: {
        js: babel
      }
    }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      cb();
      process.exit();
    })
);
