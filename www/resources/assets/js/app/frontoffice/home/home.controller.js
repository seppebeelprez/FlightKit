/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.home')
        .controller('HomeController', HomeController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HomeController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$route',
        '$rootScope',

        // Custom
        'GetAccountFactory'
    ];

    function HomeController(
        // Angular
        $log,
        $scope,
        $route,
        $rootScope,

        // Custom
        GetAccountFactory
    ) {
        // ViewModel
        // =========
        var vm = this;
        //$scope.accountApi = $rootScope.ownAPI + 'account';

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Home'
        };

        //vm.user = GetAccountFactory.getAccount($scope);
        //
        //vm.reloadRoute = function() {
        //    $route.reload();
        //    console.log('reload!')
        //}
    }

})();
