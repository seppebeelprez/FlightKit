/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminusers')
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

            .state('/admin/users', {
                url: '/admin/users',
                views: {
                    main: {
                        controller: 'AdminUsersOverviewController as vm',
                        templateUrl: getView('admin/users/users')
                    }
                }
            })
            .state('/admin/users/detail/:id', {
            url: '/admin/users/detail/:id',
            views: {
                main: {
                    controller: 'AdminUsersDetailController as vm',
                    templateUrl: getView('admin/users/detail')
                }
            }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();