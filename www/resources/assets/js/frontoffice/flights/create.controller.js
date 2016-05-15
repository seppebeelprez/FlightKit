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
        '$q',
        '$uibModal',
        '$window',
        '$http',

        //Custom
        'createFlightsFactory',
        'getFlightsFactory'
    ];

    function FlightsCreateController(
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
        createFlightsFactory,
        getFlightsFactory
    ) {
        //console.log('FlightsCreateController');
        // ViewModel
        // =========
        var vm = this;

        // User Interaction
        // --------------
        vm.$$ix = {
            next        : createFlight,
            confirm     : showModal,
            airline     : airlineSelected,
            airport     : airportSelected
        };

        getFlights();
        getAirlines();
        getAirports();

        vm.animationsEnabled = true;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Create a flight',
            subtitle: 'Select your airline, airport, flight number and date.'
        };

        // Data
        // ----
        // vm.flight
        vm.flight = {};
        vm.userFlights = {};
        vm.data = {};
        vm.airlines = {};
        vm.airports = {};
        vm.flight.airline = {};
        vm.flight.airport = {};
        vm.existingFlightDetailId = {};

        vm.flight.today = new Date();


        // Functions
        // =========

        // Angular autocomplete
        // -----
        function getAirlines() {
            $http.get('../json/airlines.json')
                .then(function(data){
                    vm.airlines = data.data.airlines;
                    // console.log('airlines,', data.data.airlines);
                });
        }

        function airlineSelected(selected) {
            if (selected) {
                console.log(selected);
                vm.flight.airline = selected.description.iata;
            } else {
                console.log('cleared');
            }
        }

        // vm.localSearch = function(str) {
        //     console.log('localSearch');
        //     var matches = [];
        //     vm.airlines.forEach(function(airline) {
        //         var fullName = airline.name;
        //         matches.push(fullName);
        //     });
        //     return matches;
        // };

        function getAirports() {
            $http.get('../json/airports.json')
                .then(function(data){
                    vm.airports = data.data.airports;
                    // console.log('airports,', data.data.airports);
                });
        }

        function airportSelected(selected) {
            if (selected) {
                console.log(selected);
                vm.flight.airport = selected.description.iata;
            } else {
                console.log('cleared');
            }
        }

        // Show popup
        // -----
        function showModal() {


            if($scope.form.$valid) {

                vm.ArrayToCheckFlightData = [];
                vm.checkCurrentFlight = [];

                var check = $.ajax({
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    '' + vm.flight.airline + '/' +
                    '' + vm.flight.number + '/dep/' +
                    '' + $filter('date')(vm.flight.today, 'yyyy/MM/dd') + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '&airport=' + vm.flight.airport + '',
                    dataType: 'jsonp',
                    crossDomain: true,
                    success: function(data) {
                        //console.log('data:', data);
                        vm.checkCurrentFlight.push(data);
                    }
                });

                //console.log(result);
                vm.ArrayToCheckFlightData.push(check);
                $q.all(vm.ArrayToCheckFlightData).then(function success(data){
                    console.log('vm.checkCurrentFlight: ', vm.checkCurrentFlight);


                    if ( vm.checkCurrentFlight[0].error || vm.checkCurrentFlight[0].flightStatuses[0] == null ) {
                        var alertFlightModal = $uibModal.open({
                            animation: vm.animationsEnabled,
                            templateUrl: 'errorModal.html',
                            scope: $scope
                        });
                        vm.$$ix.again = function () {
                            alertFlightModal.dismiss('cancel');
                        };
                    } else {

                        vm.flight.departureCode = vm.checkCurrentFlight[0].flightStatuses[0].departureAirportFsCode;
                        vm.flight.arrivalCode = vm.checkCurrentFlight[0].flightStatuses[0].arrivalAirportFsCode;

                        vm.allAirports = [];
                        vm.allAirports = vm.checkCurrentFlight[0].appendix.airports;

                        vm.departureAirport = [];
                        vm.arrivalAirport = [];

                        angular.forEach(vm.allAirports, function(airport, key) {
                            //console.log(key, airport);
                            if ( airport.iata == vm.flight.departureCode ) {
                                vm.departureAirport = airport;
                                //console.log('Start: ', vm.departureAirport);
                            }
                            else if ( airport.iata == vm.flight.arrivalCode ) {
                                vm.arrivalAirport = airport;
                                //console.log('End: ', vm.arrivalAirport);
                            }
                        });


                        var checkFlightModal = $uibModal.open({
                            animation: vm.animationsEnabled,
                            templateUrl: 'confirmModal.html',
                            scope: $scope
                        });
                        vm.$$ix.cancel = function () {
                            checkFlightModal.dismiss('cancel');
                        };
                        vm.$$ix.add = function () {
                            checkFlightModal.close(true);
                            createFlight();
                        };
                    }
                }, function failure(err){
                });
            }
        }

        // Get already added flights
        // -----
        function getFlights() {
            var params = {};
            return getFlightsFactory
                .query(
                    params,
                    getFlightsSuccess,
                    getFlightsError);
        }

        function getFlightsError(reason) {
            //$log.error('getFlightsError:', reason);
        }
        function getFlightsSuccess(response) {
            //$log.success('getFlightsSuccess:', response);
            vm.userFlights = response[0].flights;
            console.log('vm.userFlights: ', vm.userFlights);
        }


        // Create Flight
        // -----
        function createFlight() {
            console.log('createFlight: ', vm.checkCurrentFlight);
            vm.flight.flightId = vm.checkCurrentFlight[0].flightStatuses[0].flightId;
            vm.flight.date = $filter('date')(vm.flight.today, 'yyyy/MM/dd');
            console.log('vm.flight: ', vm.flight);

            vm.flightIdArray = [];

            var checkDuplicate = false;

            angular.forEach(vm.userFlights,function(flight,key){

                vm.flightIdArray.push(flight);

                if (vm.flight.flightId == flight.flightId) {
                    console.log('DUPLICATE: ', vm.flight.flightId, flight.flightId);

                    var duplicateFlightModal = $uibModal.open({
                        animation: vm.animationsEnabled,
                        templateUrl: 'duplicateModal.html',
                        scope: $scope
                    });
                    vm.$$ix.cancel = function () {
                        duplicateFlightModal.dismiss('cancel');
                    };

                    vm.$$ix.detail = function () {
                        console.log('existingFlightDetailId: ', flight.flightId);
                        duplicateFlightModal.dismiss('Go to detail: ', flight.flightId);
                    };

                    checkDuplicate = true;
                }
            });

            if(checkDuplicate == true){
                console.log('checkDuplicate = true!');
            }else {
                console.log('checkDuplicate = false!');
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
