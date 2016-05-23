/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminusers')
        .controller('AdminUsersOverviewController', AdminUsersOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminUsersOverviewController.$inject = [
        // Angular
        '$log',

        //Custom
        'getAdminUsersFactory',
        'config'
    ];

    function AdminUsersOverviewController(
        // Angular
        $log,

        //Custom
        getAdminUsersFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getUsers();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Users Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
        };

        function getUsers() {
            var params = {};
            return vm.getData =  getAdminUsersFactory
                    .query(
                        params,
                        getUsersSuccess,
                        getUsersError);
        }

        function getUsersError(reason) {
            $log.error('getUsersError:', reason);
        }

        function getUsersSuccess(response, responseHeader) {
            console.log(response);
            vm.users = response.users;
        }
    }

})();
