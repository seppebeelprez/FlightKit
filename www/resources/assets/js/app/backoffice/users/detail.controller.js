/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminusers')
        .controller('AdminUsersDetailController', AdminUsersDetailController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminUsersDetailController.$inject = [
        // Angular
        '$log',
        '$stateParams',
        '$uibModal',
        '$scope',
        '$q',
        '$window',

        //Custom
        'detailUsersFactory',
        'deleteUserFactory'
    ];

    function AdminUsersDetailController(
        // Angular
        $log,
        $stateParams,
        $uibModal,
        $scope,
        $q,
        $window,

        //Custom
        detailUsersFactory,
        deleteUserFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        getUser();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Users Overview'
        };

        vm.animationsEnabled = true;

        // User Interaction
        // --------------
        vm.$$ix = {
            deleteUser : deleteUserModal
        };

        function getUser() {
            var params = {
                id : $stateParams.id
            };
            return vm.getData =  detailUsersFactory
                    .query(
                        params,
                        getDetailUserSuccess,
                        getDetailUserError);
        }

        function getDetailUserError(reason) {
            $log.error('getUsersError:', reason);
        }

        function getDetailUserSuccess(response, responseHeader) {
            vm.data = response;
            console.log(vm.data)
        }

        // Show delete modal popup
        // -----
        function deleteUserModal() {
            var deleteUserModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteUserModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteUserModal.dismiss('cancel');
            };
            vm.$$ix.deleteUserDefinitive = function ($id) {
                deleteUserModal.close(true);
                console.log($id);

                var deleteUserDefinitive = deleteUserFactory.hardDelete(vm.data.user.id);

                $q.all(deleteUserDefinitive).then(function success(data){
                    $window.location.href = '/admin/users';
                });
            };
        }
    }

})();
