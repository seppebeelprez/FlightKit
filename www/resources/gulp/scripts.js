'use strict';

var gulp = require("gulp");
var concat = require("gulp-concat");
var notify = require("gulp-notify");



gulp.task('scripts', function(){
    gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('js'));
        
    gulp.src('node_modules/materialize-css/dist/js/materialize.min.js')
        .pipe(concat('materialize.min.js'))
        .pipe(gulp.dest('js'));
        
    gulp.src('node_modules/material-design-lite/dist/material.min.js')
        .pipe(concat('material.min.js'))
        .pipe(gulp.dest('js'));

    gulp.src('resources/assets/scripts/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('js'))
        .pipe(notify({ message: 'JavaScript concatinated!'}));

});