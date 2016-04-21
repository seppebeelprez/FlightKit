/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/trips', {
                url: '/trips',
                views: {
                    main: {
                        controller: 'TripsOverviewController as vm',
                        templateUrl: getView('trips/trips')
                    }
                }
            })
            .state('/trips/create', {
                url: '/trips/create',
                views: {
                    main: {
                        controller: 'TripsCreateController as vm',
                        templateUrl: getView('trips/create')
                    }
                }
            })
            .state('/trips/', {
                url: '/trips/:trip_id',
                views: {
                    main: {
                        controller: 'TripsDetailController as vm',
                        templateUrl: getView('trips/detail')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();