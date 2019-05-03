const gulp = require('gulp')
const sass = require('gulp-sass')
const nunjucks = require('gulp-nunjucks')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const del = require('del')
const runSequence = require('run-sequence')

gulp.task('nunjucks', () => {
  return gulp.src('./src/html/*.html')
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('sass', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('js', () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  })
})

gulp.task('clean:public', () => {
  return del.sync('./public')
})

gulp.task('watch', () => {
  gulp.watch('./src/html/**/*.html', gulp.series('nunjucks'))
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/js/**/*.js', gulp.series('js'))
})

gulp.task('default', () => {
  runSequence(['nunjucks', 'js', 'sass', 'watch'])
})
