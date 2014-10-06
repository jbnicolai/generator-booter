var gulp        = require('gulp'),
    less        = require('gulp-less'),
    path        = require('path'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    watchify    = require('watchify')


var appDir = './assets/'
var builtDir = appDir

gulp.task('less', function() {
    gulp.src(appDir + 'less/app.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ],
            relativeUrls: true
        }).on('error', console.log))
        .pipe(gulp.dest(builtDir + 'css'));
});

var config = {
    isWatching: false
}

gulp.task('browserify', function() {
    var bundleMethod = config.isWatching ? watchify : browserify;
    var bundler = bundleMethod({
        entries: [appDir + 'js/main.js']
    });

    var bundle = function() {
        return bundler
            .bundle()
            .pipe(source('main.min.js'))
            .pipe(gulp.dest(builtDir + 'js/'))
    };

    if(config.isWatching) {
        bundler.on('update', bundle);
    }

    return bundle();
});


gulp.task('default', function() {
    gulp.start('less', 'browserify');
});

gulp.task('watch', function() {
    gulp.watch(appDir + 'less/**/*.less', ['less']);
    gulp.watch(appDir + 'js/**/*.js', ['browserify']);
});