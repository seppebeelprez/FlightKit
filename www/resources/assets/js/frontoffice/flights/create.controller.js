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
        $q,
        $uibModal,
        $window,

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
            next        : createFlight,
            confirm     : showModal
        };

        vm.animationsEnabled = true;

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
                    '' + config.appKey + '',
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
                            console.log('Start: ', vm.departureAirport);
                        }
                        else if ( airport.iata == vm.flight.arrivalCode ) {
                            vm.arrivalAirport = airport;
                            console.log('End: ', vm.arrivalAirport);
                        }
                    });


                    if ( vm.checkCurrentFlight[0].error ) {
                        if ( vm.checkCurrentFlight[0].error.httpStatusCode === 400) {
                            var alertFlightModal = $uibModal.open({
                                animation: vm.animationsEnabled,
                                templateUrl: 'errorModal.html',
                                scope: $scope
                            });
                            vm.$$ix.again = function () {
                                alertFlightModal.dismiss('cancel');
                            };
                        }
                    } else {
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


        // Create Flight
        // -----
        function createFlight() {
            console.log('createFlight: ', vm.checkCurrentFlight);
            vm.flight.flightId = vm.checkCurrentFlight[0].flightStatuses[0].flightId;
            vm.flight.date = $filter('date')(vm.flight.today, 'yyyy/MM/dd');
            console.log('vm.flight: ', vm.flight);

            createFlightsFactory.createFlight(vm.flight);

            //console.log('All airports: ', vm.allAirports);
            //console.log('original flight: ', vm.flight);
            //
            //createFlightsFactory.createFlight(vm.flight);
            //$window.location.href = '/flights';
        }

        // Go Back
        // -----
        vm.go = function ( path ) {
            $location.path( path );
        };
    }

})();
