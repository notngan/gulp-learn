const gulp = require('gulp')

const nunjucks = require('gulp-nunjucks')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const scssLint = require('gulp-scss-lint')

const browserSync = require('browser-sync').create()
const browserify = require('browserify')
const babelify = require('babelify')
const sourceStream = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const del = require('del')

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

function scss(done) {
  gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())

  done()
}

function js(done) {
  browserify({ entries: `./src/js/main.js` })
  .transform(babelify, { 'presets': ['@babel/preset-env'] })
  .bundle().on('error', err => { console.log(err) })
  .pipe(sourceStream('main.js'))
  .pipe(buffer())
  .pipe(gulp.dest(`./public`))

  done()
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
