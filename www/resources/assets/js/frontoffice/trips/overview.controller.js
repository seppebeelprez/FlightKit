/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsOverviewController', TripsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',

        //Custom
        'config'
    ];

    function TripsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,

        //Custom
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Trips Overview',
            subtitle: 'Not available right now!'
        };

        // User Interaction
        // --------------
        vm.$$ix = {

        };


    }

})();
