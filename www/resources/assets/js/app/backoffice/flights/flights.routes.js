/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminflights')
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

            .state('/admin/flights', {
                url: '/admin/flights',
                views: {
                    main: {
                        controller: 'AdminFlightsOverviewController as vm',
                        templateUrl: getView('admin/flights/flights')
                    }
                }
            });
            // .state('/flights/create', {
            //     url: '/flights/create',
            //     views: {
            //         main: {
            //             controller: 'FlightsCreateController as vm',
            //             templateUrl: getView('flights/create')
            //         }
            //     }
            // })
            // .state('/flights/detail/:airline/:number', {
            //     url: '/flights/detail/:airline/:number',
            //     views: {
            //         main: {
            //             controller: 'FlightsDetailController as vm',
            //             templateUrl: getView('flights/detail')
            //         }
            //     }
            // });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();