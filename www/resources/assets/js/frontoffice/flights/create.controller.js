/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .controller('FlightsCreateController', FlightsCreateController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    FlightsCreateController.$inject = [
        // Angular
        '$log',
        '$state',
        '$location',
        '$filter',
        'config',
        '$scope',

        //Custom
        'createFlightsFactory',
        'scheduleFlightAPIFactory'
    ];

    function FlightsCreateController(
        // Angular
        $log,
        $state,
        $location,
        $filter,
        config,
        $scope,

        //Custom
        createFlightsFactory,
        scheduleFlightAPIFactory
    ) {
        //console.log('FlightsCreateController');
        // ViewModel
        // =========
        var vm = this;

        // User Interaction
        // --------------
        vm.$$ix = {
            next: createFlight
        };

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Create a flight',
            subtitle: 'Select your airline, flight number and date.'
        };

        // Data
        // ----
        // vm.flight
        vm.flight = {};
        vm.data = {};

        vm.flight.today = new Date();



        // Functions
        // =========
        // Create Flight
        // -----
        function createFlight() {
            vm.flight.date = $filter('date')(vm.flight.today, 'yyyy/MM/dd');
            //console.log(vm.flight);

            var dateArray = vm.flight.date.split("/");

            console.log(vm.flight);

            if($scope.form.$valid) {

                //vm.flight.year = dateArray[0];
                //vm.flight.month = dateArray[1];
                //vm.flight.day = dateArray[2];

                createFlightsFactory.createFlight(vm.flight);
            }
        }

        // Go Back
        // -----
        vm.go = function ( path ) {
            $location.path( path );
        };
    }

})();
