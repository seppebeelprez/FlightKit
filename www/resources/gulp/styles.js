'use strict';

var gulp = require ("gulp");
var concat = require("gulp-concat");
var sass = require("gulp-ruby-sass");
var autoprefixer = require("gulp-autoprefixer");
var notify = require("gulp-notify");


gulp.task('styles', function() {
    return sass('resources/assets/stylesheets/main.scss', { style : 'expanded' })
           .pipe(autoprefixer('last 5 version'))
           .pipe(gulp.dest('public/css'))
           .pipe(notify({ message: "Sass compiled"}));
});

gulp.task('extra', function() {
    gulp.src(['node_modules/materialize-css/dist/css/materialize.css'])
        .pipe(concat('materialize.css'))
        .pipe(gulp.dest('css'));
        
    gulp.src(['node_modules/material-design-lite/dist/material.css'])
        .pipe(concat('material.css'))
        .pipe(gulp.dest('css'));
});

