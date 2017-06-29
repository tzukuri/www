import * as path from 'path'
import gulp from 'gulp'
var gls = require('gulp-live-server')

// postcss
import stripInlineComments from 'postcss-strip-inline-comments'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'autoprefixer'
import utils from 'postcss-utilities'
import cssnano from 'cssnano'
import precss from 'precss'
import scss from 'postcss-scss'
import lost from 'lost'

// html
import liquid from 'gulp-liquid'
import posthtml from 'posthtml'

// images
import cache from 'gulp-cache'
import imagemin from 'gulp-imagemin'

// js
import babili from 'gulp-babili'
import rename from 'gulp-rename'
import concat from 'gulp-concat'

// helpers for gulp 4
const parallel = gulp.parallel.bind(gulp)
const series = gulp.series.bind(gulp)


// --------------------------------------------------------
// config
// --------------------------------------------------------
const sourcePath = ext => path.join('.', 'src', '**', '*.' + ext)
const sources = {
    fonts: path.join('.', 'src', 'assets', 'fonts', '**', '*'),
    images: sourcePath('{png,gif,jpeg,jpg}'),
    liquid: sourcePath('liquid'),
    css: sourcePath('css'),
    js: sourcePath('js')
}

// intermediate paths
const buildPath = name => path.join('.', 'build', name)
const build = {
    css: path.join('.', 'build'),
    js: buildPath('js')
}

// TODO: these should be declared in the template html and extracted
const builtCSS = path.join('.', 'build', 'assets', 'css')
const postcssPaths = [
    path.join(builtCSS, 'pre.css'),
    path.join(builtCSS, 'main.css')
]

const babiliPaths = [
    path.join(build.js, 'all.js')
]

// output paths
const distPath = name => path.join('.', 'dist', name)
const dist = {
    images: distPath('images'),
    fonts: distPath('fonts'),
    css: distPath('css'),
    js: distPath('js')
}

// configs
const preprocessPostCSSPlugins = [
    stripInlineComments()
]

const postprocessPostCSSPlugins = [
    utils(),
    precss(),
    lost(),
    autoprefixer(),
    cssnano({ preset: 'default' })
]



// --------------------------------------------------------
// HTML
// --------------------------------------------------------
gulp.task('html:precompile', () => {
    return  gulp.src(sources.liquid)
                .pipe(liquid())
                .pipe(gulp.dest(buildPath))
})



// --------------------------------------------------------
// CSS
// --------------------------------------------------------
gulp.task('css:preprocess', () => {
    return  gulp.src(sources.css)
                .pipe(sourcemaps.init())
                .pipe(postcss(preprocessPostCSSPlugins, { syntax: scss }))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(build.css))
})

gulp.task('postcss:compile', () => {
    return  gulp.src(postcssPaths)
                .pipe(sourcemaps.init())
                .pipe(postcss(postprocessPostCSSPlugins))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(dist.css));
})

gulp.task('css:compile', series('css:preprocess', 'postcss:compile'))



// --------------------------------------------------------
// JS
// --------------------------------------------------------
gulp.task('js:transpile', () => {
    return  gulp.src(sources.js)
                .pipe(concat('all.js'))
                .pipe(gulp.dest(build.js))
                .pipe(rename('all.min.js'))
})

gulp.task('js:minify', () => {
    return  gulp.src(babiliPaths)
                .pipe(sourcemaps.init())
                .pipe(babili())
                .pipe(sourcemaps.write())
                .pipe(rename('all.min.js'))
                .pipe(gulp.dest(dist.js));
})

gulp.task('js:compile', series('js:transpile', 'js:minify'))



// --------------------------------------------------------
// fonts
// --------------------------------------------------------
gulp.task('fonts:copy', () => {
    return  gulp.src(sources.fonts)
                .pipe(gulp.dest(dist.fonts))
})



// --------------------------------------------------------
// images
// --------------------------------------------------------
gulp.task('images:compress', () => {
    return  gulp.src(sources.images, { base: '.' })
                .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
                .pipe(gulp.dest(dist.images))
})



// --------------------------------------------------------
// commands
// --------------------------------------------------------
gulp.task('serve', () => {
    var server = gls.new('app.js')
    server.start()

    return gulp.watch(path.join('.', 'dist', '**', '*'), file => {
        server.notify.apply(server, [file])
    })
})

gulp.task('watch', () => {
    //gulp.watch(liquidPaths, {cwd: './'}, series('html:precompile'))
    gulp.watch(sources.js, {cwd: './'}, series('js:compile'))
    gulp.watch(sources.css, {cwd: './'}, series('css:compile'))
    gulp.watch(sources.images, {cwd: './'}, series('images:compress'))
    gulp.watch(sources.fonts, {cwd: './'}, series('fonts:copy'))
})

gulp.task('default', parallel('css:compile', 'images:compress', 'fonts:copy', 'js:compile', 'serve', 'watch'))

gulp.task('content:sync', () => {
    return Content.current.sync()
})

gulp.task('content:clean', () => {
    Content.current.clean()
})

gulp.task('content:all:clean', () => {
    Content.published.clean()
    Content.preview.clean()
})
