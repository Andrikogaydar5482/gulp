let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let concat = require('gulp-concat');
let cssnano = require('gulp-cssnano');
let image = require('gulp-image');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let del = require('del');
let browsersync = require('browser-sync').create();

let paths = {
    styles: {
        src: 'app/style/**/*.scss',
        dest: 'build/css'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scripts'
    },
    html:{
        src: 'app/**/*.html',
        dest: 'build/' 
    },
    images:{
        src: 'app/**/*.png',
        dest: 'build/' 
    },
    fonts:{
        src: 'app/fonts/**/*.ttf',
        dest: 'build/fonts' 
    }
};


function browserSync(done){
    browsersync.init({
        server:{
            baseDir: './build'
        },
        port: 3000
    });
    done();
};

function browserSyncReload(done){
    browsersync.reload();
    done();
}

function clear(){
    return del(['build']);
}

function styles(){
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(autoprefixer({browsers:['last 3 versions','> 1%', 'ie 8', 'ie 7']}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

function scripts(){
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browsersync.stream())
}

function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browsersync.stream())
}

function images(){
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browsersync.stream())
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browsersync.stream())
}

function watch(){
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch('./app/*.html', gulp.series(browserSyncReload));
}

let build = gulp.series(clear,gulp.parallel(styles, scripts, html, images,fonts));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, browserSync, build));

