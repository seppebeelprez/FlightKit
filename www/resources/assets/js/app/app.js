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
            'app.factories',

            'app.adminflights',
            'app.admintrips',
            'app.adminusers'
            //'app.style-guide'
        ]);

    angular.module('app.home', ['ui.router', 'ngRoute']);
    angular.module('app.flights', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy']);
    angular.module('app.trips', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy']);
    angular.module('app.account', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'validation.match']);

    angular.module('app.adminflights', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'angularUtils.directives.dirPagination']);
    angular.module('app.admintrips', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'angularUtils.directives.dirPagination']);
    angular.module('app.adminusers', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'angularUtils.directives.dirPagination']);

    angular.module('app.factories', ['ui.router']);
})();



