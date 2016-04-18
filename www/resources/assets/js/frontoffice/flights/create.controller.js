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
            airline     : airlineSelected
        };

        getFlights();
        getAirlines();

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
        vm.userFlights = {};
        vm.data = {};
        vm.airlines = {};
        vm.flight.airline = {};

        vm.flight.today = new Date();


        // Functions
        // =========

        // Angular autocomplete
        // -----
        function getAirlines() {
            $http.get('../json/airlines.json')
                .then(function(data){
                    vm.airlines = data.data.airlines;
                    //console.log('airlines,', data.data.airlines);
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

        vm.localSearch = function(str) {
            var matches = [];
            vm.airlines.forEach(function(airline) {
                var fullName = airline.name;
                matches.push(fullName);
            });
            return matches;
        };


        // Show popup
        // -----
        function showModal() {

            //console.log('showModal', vm.flight);

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
                    //console.log('vm.checkCurrentFlight: ', vm.checkCurrentFlight);


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

                //console.log('vm.flight.id: ', vm.flight.flightId);
                //console.log('vm.userflight.id: ', flight.flightId);

                vm.flightIdArray.push(flight);

                ////console.log(flight.flightId, key);
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
                        duplicateFlightModal.dismiss('Go to detail: ', flight.flightId);
                    };

                    checkDuplicate = true;

                }
                //else if(checkDuplicate == true){
                //    console.log('checkDuplicate = true!');
                //}else {
                //    console.log('checkDuplicate = false!')
                //}
                //else {
                //    console.log('createFlight Entered');
                //    createFlightsFactory.createFlight(vm.flight);
                //    $window.location.href = '/flights';
                //}

            });

            if(checkDuplicate == true){
                console.log('checkDuplicate = true!');
            }else {
                console.log('checkDuplicate = false!');
                createFlightsFactory.createFlight(vm.flight);
                $window.location.href = '/flights';
            }

            //console.log('checkduplicate array:', vm.flightIdArray);

            //q.all(vm.flightIdArray).then(function success(data){
            //    if(checkDuplicate == false) {
            //        console.log('checkduplicate:', vm.flightIdArray);
            //        console.log('you can create flight');
            //    }
            //}, function failure(err){
            //    // Can handle this is we want
            //});


            //console.log('All airports: ', vm.allAirports);
            //console.log('original flight: ', vm.flight);
            //
            //createFlightsFactory.createFlight(vm.flight);
            //$window.location.href = '/flights';

            //console.log(vm.flightIdArray);
        }


        // Go Back
        // -----
        vm.go = function ( path ) {
            $location.path( path );
        };
    }

})();
