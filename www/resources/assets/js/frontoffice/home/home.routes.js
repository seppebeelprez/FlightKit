/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.home')
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

            .state('/landing', {
                url: '/home',
                views: {
                    main: {
                        controller: 'HomeController as vm',
                        templateUrl: getView('home/home')
                    }
                }
            })
            .state('/', {
                url: '/',
                views: {
                    main: {
                        controller: 'HomeController as vm',
                        templateUrl: getView('home/home')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();