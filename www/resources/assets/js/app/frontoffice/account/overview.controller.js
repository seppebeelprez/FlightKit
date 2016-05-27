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
        '$q',
        '$uibModal',
        '$window',

        // Custom
        'GetAccountFactory',
        'accountFactory'
    ];

    function AccountOverviewController(
        // Angular
        $log,
        $scope,
        config,
        $q,
        $uibModal,
        $window,

        // Custom
        GetAccountFactory,
        accountFactory
    ) {
        // ViewModel
        // =========
        var vm = this;
        
        getAccount();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Account Details',
            subtitle: 'Overview of records!'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            confirm     : changePassword
        };

        vm.animationsEnabled = true;

        vm.data = {};
        
        function getAccount() {
            var params = {};

            return vm.user = accountFactory.query(params, getAccountSuccess, getAccountError);
            // var account = GetAccountFactory.getAccount();
            //
            // $q.all(account).then(function success(data){
            //     console.log('q', data);
            // });
        }

        function getAccountError(reason) {

        }

        function getAccountSuccess(response, responseHeader) {
            vm.user = response.user;
        }

        function changePassword() {
            if(vm.form.$valid){
                console.log(vm.data);

                var updateAccount = GetAccountFactory.changePass(vm.data);

                $q.all(updateAccount).then(function success(data){
                    console.log('check');
                    confirmModal();
                });
            }
        }

        // Show delete modal popup
        // -----
        function confirmModal() {
            var confirmModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'confirmModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                confirmModal.dismiss('cancel');
                $window.location.href = '/account';
            };
        }
    }

})();
