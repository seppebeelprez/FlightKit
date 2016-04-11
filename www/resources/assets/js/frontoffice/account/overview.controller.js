/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.account')
        .controller('AccountOverviewController', AccountOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AccountOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        'config',

        // Custom
        'GetAccountFactory'
    ];

    function AccountOverviewController(
        // Angular
        $log,
        $scope,
        config,

        // Custom
        GetAccountFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Account Details',
            subtitle: 'Overview of records!'
        };

        vm.user = GetAccountFactory.getAccount($scope);
    }

})();
