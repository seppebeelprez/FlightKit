var elixir = require('laravel-elixir');

//require('laravel-elixir-livereload');

var browserSync = require('browser-sync').create();

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir.config.sourcemaps    = false;
elixir.config.jsBaseDir     = './';
elixir.config.publicDir     = 'public/';
elixir.config.cssOutput     = 'public/css';
elixir.config.jsOutput      = 'public/js';
elixir.config.assetsDir     = 'resources/assets';
elixir.config.bowerDir      = 'vendor/bower_components';

var vendor = {
    angular         : elixir.config.bowerDir + '/angular/angular.js',
    angularModule   : {
        animate     : elixir.config.bowerDir + '/angular-animate/angular-animate.js',
        aria        : elixir.config.bowerDir + '/angular-aria/angular-aria.js',
        cookies     : elixir.config.bowerDir + '/angular-cookies/angular-cookies.js',
        material    : elixir.config.bowerDir + '/angular-material/',
        messages    : elixir.config.bowerDir + '/angular-messages/angular-messages.js',
        resource    : elixir.config.bowerDir + '/angular-resource/angular-resource.js',
        route       : elixir.config.bowerDir + '/angular-route/angular-route.js',
        sanitize    : elixir.config.bowerDir + '/angular-sanitize/angular-sanitize.js',
        touch       : elixir.config.bowerDir + '/angular-touch/angular-touch.js',
        ui_router   : elixir.config.bowerDir + '/angular-ui-router/release/angular-ui-router.js'
    }
};

elixir(function(mix) {
    //mix.browserSync({
    //    files: ["resources/assets/sass/*.scss"]
    //})
    //mix.sass('main.scss');

    mix
        .sass (
            'main.scss',
            elixir.config.cssOutput + '/main.css'
        ).version( elixir.config.cssOutput + '/main.css')

        //CSS
        .copy(
            vendor.angularModule.material + 'angular-material.css',
            elixir.config.cssOutput + '/angular.css'
        )

        .copy(
            elixir.config.bowerDir + '/fontawesome/css/font-awesome.css',
            elixir.config.cssOutput + '/font-awesome.css'
        )

        .copy(
            elixir.config.bowerDir + '/Materialize/dist/css/materialize.min.css',
            elixir.config.cssOutput + '/materialize.min.css'
        )

        //JS
        .copy(
            elixir.config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.min.js',
            elixir.config.jsOutput + '/bootstrap.min.js'
        )

        .copy(
            elixir.config.bowerDir + '/jquery/dist/jquery.min.js',
            elixir.config.jsOutput + '/vendor.min.js'
        )

        .copy(
            elixir.config.assetsDir + '/js/custom',
            elixir.config.jsOutput + '/custom.js'
        )

        .copy(
            elixir.config.bowerDir + '/Materialize/dist/js/materialize.min.js',
            elixir.config.jsOutput + '/materialize.min.js'
        )

        //FONTS
        .copy(
            elixir.config.bowerDir + '/fontawesome/fonts',
            elixir.config.publicDir + '/fonts'
        )

        .scripts([
                vendor.angular,
                vendor.angularModule.animate,
                vendor.angularModule.aria,
                vendor.angularModule.cookies,
                vendor.angularModule.material + 'angular-material.js',
                vendor.angularModule.messages,
                vendor.angularModule.resource,
                vendor.angularModule.route,
                vendor.angularModule.sanitize,
                vendor.angularModule.touch,
                vendor.angularModule.ui_router
            ],
            elixir.config.jsOutput + '/angular.js',
            elixir.config.jsBaseDir
        )

        .scriptsIn(
            elixir.config.assetsDir + '/js/frontoffice',
            elixir.config.jsOutput + '/frontoffice.js'
        );
});