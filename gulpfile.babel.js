import * as path from 'path'
import posthtml from 'posthtml'
import sourcemaps from 'gulp-sourcemaps'
import liquid from 'gulp-liquid'
import sass from 'gulp-sass'
import gulp from 'gulp'

import { Content } from './lib/content'
const parallel = gulp.parallel.bind(gulp)
const series = gulp.series.bind(gulp)

// input paths
const srcPath = path.join('.', 'src')
console.log(srcPath)
const liquidPaths = path.join(srcPath, '**', '*.liquid')
const sassPaths = path.join(srcPath, '**', '*.scss')

// intermediate paths
const buildPath = path.join('.', 'build')
const htmlPath = buildPath
const cssPath = path.join(buildPath, 'css')

console.log(sassPaths)

// output paths


gulp.task('html:precompile', () => {
    return  gulp.src(liquidPaths)
                .pipe(liquid())
                .pipe(gulp.dest(htmlPath))
})

gulp.task('css:compile', () => {
    return  gulp.src(sassPaths)
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(cssPath))
})

gulp.task('watch', () => {
    gulp.watch(liquidPaths, {cwd: './'}, series('html:precompile'))
    gulp.watch(sassPaths, {cwd: './'}, series('css:compile'))
})

gulp.task('default', parallel('html:precompile', 'css:compile', 'watch'))


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
