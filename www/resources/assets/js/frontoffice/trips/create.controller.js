/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsCreateController', TripsCreateController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsCreateController.$inject = [
        // Angular
        '$log',
        '$state',
        '$location',
        '$filter',
        'config',
        '$scope',
        '$q',
        '$uibModal',
        '$window',
        '$http',

        //Custom
        'createTripsFactory',
        'getTripsFactory'
    ];

    function TripsCreateController(
        // Angular
        $log,
        $state,
        $location,
        $filter,
        config,
        $scope,
        $q,
        $uibModal,
        $window,
        $http,

        //Custom
        createTripsFactory,
        getTripsFactory

    ) {
        // ViewModel
        // =========
        var vm = this;

        // User Interaction
        // --------------
        vm.$$ix = {
            next        : createTrip,
            airport     : airportSelected
        };

        getTrips();
        getAirports();

        vm.animationsEnabled = true;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Create a trip',
            subtitle: 'Select your airport and get information about your destination.'
        };

        // Data
        // ----
        // vm.trip
        vm.trip = {};
        vm.airports = {};
        vm.trip.airport = {};
        vm.existingTripDetailId = {};


        // Functions
        // =========

        // Angular autocomplete
        // -----
        function getAirports() {
            $http.get('../json/airports.json')
                .then(function(data){
                    vm.airports = data.data.airports;
                    console.log('airports,', data.data.airports);
                });
        }
        function airportSelected(selected) {
            if (selected) {
                console.log(selected);
                vm.trip.airport = selected.description.iata;
            } else {
                console.log('cleared');
            }
        }

        // Show popup
        // -----


        // Get already added trips
        // -----
        function getTrips() {
            var params = {};
            return getTripsFactory
                .query(
                    params,
                    getTripsSuccess,
                    getTripsError);
        }

        function getTripsError(reason) {
            //$log.error('getTripsError:', reason);
        }
        function getTripsSuccess(response) {
            //$log.success('getTripsSuccess:', response);
            vm.userTrips = response[0].trips;
            console.log('vm.userTrips: ', vm.userTrips);
        }

        // Create Trip
        // -----
        function createTrip() {
            console.log('createTrip');
            console.log('vm.trip: ', vm.trip);

            vm.tripIdArray = [];
            var checkDuplicate = false;

            angular.forEach(vm.userTrips,function(trip,key){

                vm.tripIdArray.push(trip);

                if (vm.trip.airport == trip.airport) {
                    console.log('DUPLICATE: ', vm.trip.airport, trip.airport);

                    var duplicateTripModal = $uibModal.open({
                        animation: vm.animationsEnabled,
                        templateUrl: 'duplicateModal.html',
                        scope: $scope
                    });
                    vm.$$ix.cancel = function () {
                        duplicateTripModal.dismiss('cancel');
                    };

                    vm.$$ix.detail = function () {
                        console.log('existingTripDetailId: ', trip.id);
                        duplicateTripModal.dismiss('Go to detail: ', trip.id);
                        $window.location.href = '/trips/detail/' + vm.trip.airport;
                    };
                    checkDuplicate = true;
                }
            });

            if(checkDuplicate == true){
                console.log('checkDuplicate = true!');
            }else {
                console.log('checkDuplicate = false!');
                var createTrips = createTripsFactory.createTrip(vm.trip);

                $q.all(createTrips).then(function success(data){
                    $window.location.href = '/trips/detail/' + vm.trip.airport;
                });
            }
        }

        // Go Back
        // -----
        vm.go = function ( path ) {
            $location.path( path );
        };
    }

})();
