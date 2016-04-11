'use strict';

var gulp = require ("gulp");
var browserSync = require('browser-sync').create();


gulp.task('watch', function(){
    browserSync.init({
        proxy: "http://www.flightkit.local"
    });

    gulp.watch('resources/assets/**/*.**', ['styles', 'scripts', 'extra'])
        .on('change', browserSync.reload);
});

//gulp.task('browser-sync', function() {
//    browserSync.init({
//        proxy: "http://www.flightkit.local"
//    });
//});