const gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),

    saas = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),

    path = require('path'),
    browserSync = require('browser-sync').create()
;


const config = {
    // --
    // -- Path
    // --
    path: {
        dest: './dist/',
        html: './index.html',
        css: {
            src: './src/scss/package-all.scss',
            srcWatch: [
                './src/scss/*.scss',
                './src/scss/*/*.scss',
                './src/scss/**.scss',
            ],
            filename: 'yamf.css',
        },
        js: {
            src: './src/js/package.js',
            srcWatch: [
                './src/js/*.js',
                './src/js/*/*.js',
                './src/js/**.js',
            ],
            filename: 'yamf.js',
        },
    },

    // --
    // -- AutoPrefixer
    // --
    autoprefixer: {
        flexbox: true,
        browsers: [
            'IE >= 11',
            'Edge >= 12',
            'Firefox >= 28',
            'Chrome >= 21',
            'Safari >= 6.1',
            'Opera >= 12.1',
            'iOS >= 7',
        ]
    },
    // --
    // -- Webpack
    // --
    webpack: {
        output: {
            filename: 'yamf.js',
        },
        context: path.resolve(__dirname),
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        },
    }
};

const tasks = {
    // --
    // -- CSS
    // --
    css() {
        return gulp.src(config.path.css.src)
            .pipe(saas()).on('error', saas.logError)
            .pipe(autoprefixer(config.autoprefixer))
            .pipe(rename(config.path.css.filename))
            .pipe(gulp.dest(config.path.dest))
            .pipe(rename({suffix: '.min'}))
            .pipe(cleanCSS())
            .pipe(gulp.dest(config.path.dest));
    },
    // --
    // -- JS
    // --
    js() {
        return gulp.src(config.path.js.src)
            .pipe(webpackStream(config.webpack))
            .pipe(gulp.dest(config.path.dest))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(config.path.dest));
    },
};

gulp.task('css', tasks.css);
gulp.task('js', tasks.js);
gulp.task('watch', ['css', 'js'], function () {
    browserSync.init({
        watch: true,
        server: true
    });

    gulp.watch(config.path.css.srcWatch, tasks.css)
        .on('change', browserSync.reload({stream: true}));
    gulp.watch(config.path.js.srcWatch, tasks.js)
        .on('change', browserSync.reload({stream: true}));
    gulp.watch(config.path.html)
        .on('change', browserSync.reload({stream: true}));
});


gulp.task('default', ['css', 'js']);