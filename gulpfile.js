const autoprefixer = require('gulp-autoprefixer')
const eslint = require('gulp-eslint')
const gulp = require('gulp')
const sass = require('gulp-sass')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

const config = {
    example: {
        scss: './demo/scss/app.scss',
        css: './demo/css',
        es6: './demo/es6/app.js',
        js: './demo/js',
    },
}

gulp.task('default', () => {
    gulp.start('demo')
})

gulp.task('watch', () => {
    gulp.watch([config.example.scss], ['demo:scss'])
    gulp.watch(['**/*.js'], ['demo:es6'])
})

gulp.task('test', () => {
    gulp.start('lint')
})

gulp.task('demo', () => {
    gulp.start('demo:scss')
        .start('demo:es6')
})

gulp.task('demo:scss', () => {
    return gulp.src(config.example.scss)
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(config.example.css))
})

gulp.task('demo:es6', () => {
    return browserify(config.example.es6)
        .transform('babelify' , {presets: ['es2015']})
        .bundle()
        .pipe(source('app.js')) // Desired filename
        .pipe(gulp.dest(config.example.js))
})

gulp.task('lint', () => {
    return gulp.src('**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
})
