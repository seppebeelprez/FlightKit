/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    // Module declarations
    var app = angular.module('app',
        [
            // Angular Module Dependencies
            // ---------------------------
            //'ngAnimate',
            //'ngMaterial',
            //'ngMessages',
            'ngRoute',
            'ngResource',
            //'ui.router', // Angular UI Router

            // Module Dependencies
            // -------------------
            'app.home',
            'app.flights',
            'app.trips',
            'app.account',
            'app.factories'
            //'app.style-guide'
        ]);

    angular.module('app.home', ['ui.router', 'ngRoute']);
    angular.module('app.flights', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'angularSpinners', 'cgBusy']);
    angular.module('app.trips', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial']);
    angular.module('app.account', ['ui.router']);

    angular.module('app.factories', ['ui.router']);
})();



