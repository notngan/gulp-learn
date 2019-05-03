const gulp = require('gulp')
const sass = require('gulp-sass')
const nunjucks = require('gulp-nunjucks')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')

function browserSyncInit(done) {
  browserSync.init({
    server: {
      baseDir: './public',
    }
  })
  done()
}

function browserSyncReload(done) {
  browserSync.reload()
  done()
}

function clean() {
  return del('./public')
}

function html() {
  return gulp.src('./src/html/*.html')
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('./public'))
}

function scss() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
}

function js() {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
}

function watchFiles() {
  gulp.watch('./src/scss/**/*.scss', scss)
  gulp.watch('./src/html/**/*.html', gulp.series(html, browserSyncReload))
  gulp.watch('./src/js/**/*.js', gulp.series(js, browserSyncReload)) 
}

const build = gulp.series(clean, gulp.parallel(scss, js, html))
const watch = gulp.parallel(watchFiles, browserSyncInit)

exports.html = html
exports.scss = scss
exports.js = js

exports.clean = clean
exports.build = build
exports.default = watch