'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    through2 = require('through2'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    platforms = ['vanilla', 'angular', 'backbone', 'ember', 'react'];

function buildTask(platform) {
    gulp.task(platform, function () {
        return gulp.src(['./src/index.' + platform + '.js'])
            .pipe(through2.obj(function (file, enc, next){
                browserify(file.path)
                    .bundle(function(err, res){
                        file.contents = res;
                        next(null, file);
                    });
            }))
            .pipe(uglify())
            .pipe(rename('snoopy.min.js'))
            .pipe(gulp.dest('./dist/' + platform + '/'));
    });
}

platforms.forEach(function (platform) {
    buildTask(platform);
});

gulp.task('default', platforms);