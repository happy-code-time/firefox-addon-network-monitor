var gulp = require('gulp');

var del = require('del');

var imagemin = require('gulp-imagemin');

var imageminJpegRecompress = require('imagemin-jpeg-recompress');

var runSequence = require('gulp4-run-sequence');

/**
 * Clean
 */
gulp.task('clean', function (done) {
    del.sync([
        './Distribution/**/*',
    ],
        {
            dot: true
        });
    done();
});

/**
 * Compress images
 */
gulp.task('compress:logo', function (done) {
    gulp.src(['../public/images/manager-48.png', '../public/images/manager-64.png'])
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest('logo'));
        done();
});

/**
 * Copy css files
 */
gulp.task('copy:css', function (done) {
    gulp.src([
        './Source/AppFiles/static/css/**/*'
    ])
        .pipe(gulp.dest('./Distribution/Static/css/'));
    done();
});

/**
 * Copy html files
 */
gulp.task('copy:html', function (done) {
    /**
     * Popup area
     */
    gulp.src([
        './Source/Popup/index.html'
    ])
    .pipe(gulp.dest('./Distribution/Popup/'));
    /**
     * Dashboard area
     */
    gulp.src([
        './Source/Dashboard/index.html'
    ])
    .pipe(gulp.dest('./Distribution/Dashboard/'));
    done();
});


/**
 * Copy background file
 */
gulp.task('copy:bg', function (done) {
    gulp.src([
        './Source/Background/background.js'
    ])
    .pipe(gulp.dest('./Distribution/Background/'));
    done();
});

/**
 * Copy content file
 */
gulp.task('copy:c', function (done) {
    gulp.src([
        './Source/Content/content.js'
    ])
    .pipe(gulp.dest('./Distribution/Content/'));
    done();
});

gulp.task('compile', function (callback) {
    runSequence(
        [
            'clean',
            'copy:css',
            'copy:html',
            'copy:bg',
            'copy:c'
        ],
        callback);
});