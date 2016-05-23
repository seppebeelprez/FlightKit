/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminflights')
        .controller('AdminFlightsOverviewController', AdminFlightsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminFlightsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',
        '$uibModal',
        '$window',

        //Custom
        'getAdminFlightsFactory',
        'deleteFlightsFactory',
        'config'
    ];

    function AdminFlightsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,
        $uibModal,
        $window,

        //Custom
        getAdminFlightsFactory,
        deleteFlightsFactory,
        // scheduleFlightAPIFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getFlights();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flights Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            options: optionsModal
        };

        function getFlights() {
            var params = {};
            return vm.getData = getAdminFlightsFactory
                    .query(
                        params,
                        getFlightsSuccess,
                        getFlightsError);
        }

        function getFlightsError(reason) {
            $log.error('getFlightsError:', reason);
        }

        function getFlightsSuccess(response, responseHeader) {
            // console.log(response.flights);
            vm.data = response.flights;
            getSchedules();
        }

        function getSchedules() {

            //Test array
            vm.allFlightsData = [];
            //Array to save flight from database
            vm.flights = [];

            //Foreach to get API information for each flight from the user in the database
            angular.forEach(vm.data,function(flight,key){

                var result = $.ajax({
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    '' + flight.flightId + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                }).then (function successCallback (data, status, headers, config){
                        //Empty array to make sure it's empty
                        vm.currentFlightData = null;
                        //Array to save API + database info for 1 flight
                        vm.currentFlightData = {};
                        //Store API data
                        vm.currentFlightData.allData = data;
                        //Store database id to go later to the details view
                        vm.currentFlightData.database = flight;
                        //Push array with 1 flight to array with multiple flights
                        vm.flights.push(vm.currentFlightData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                //Fill test array to make sure for each went well!
                //Use this name for next $q.all
                vm.allFlightsData.push(result);
            });

            $q.all(vm.allFlightsData).then(function success(data){
                // console.log('vm.flights: ', vm.flights); // Should all be here


                //Test array
                vm.checkForEachQAll = [];
                //Array to store other arrays with checked flight information
                vm.allCheckedFlights = [];


                //For each flight of the user in the database get the correct information
                //Especially for the departure and arrival airport
                angular.forEach(vm.flights,function(flight,key){

                    if (flight.allData.error) {
                        console.log('404 remove flight: ', flight.database.id);
                        deleteFlightsFactory.deleteOutdatedFlight(flight.database.id);
                    }
                    else {
                        //Get current departure and arrival code of flight
                        //ex. BRU, JFK
                        var depCode = null;
                        var arrCode = null;
                        depCode = flight.allData.flightStatus.departureAirportFsCode;
                        arrCode = flight.allData.flightStatus.arrivalAirportFsCode;

                        //Get all the airports of the current flight
                        //Connected flight can have multiple airports
                        //other than the departure and arrival
                        vm.allAirports = null;
                        vm.allAirports = [];
                        vm.allAirports = flight.allData.appendix.airports;

                        //Test array
                        vm.foreachCheckDataAirport = [];

                        //Temporary arrays
                        vm.tempDepartureAirport = null;
                        vm.tempDepartureAirport = {};
                        vm.tempArrivalAirport = null;
                        vm.tempArrivalAirport = {};


                        //Loop to each airport of current flight and check if the
                        //departure and arrival airports correspond, then push info
                        //to correct place in array checkThisFlight
                        angular.forEach(vm.allAirports, function(airport, key) {

                            //Check if correspond with departureCode
                            if ( airport.iata == depCode ) {
                                vm.tempDepartureAirport = airport;
                            }
                            //Check if correspond with arrivalCode
                            else if ( airport.iata == arrCode ) {
                                vm.tempArrivalAirport = airport;
                            }
                        });

                        //console.log('should be after check 2');
                        //Array to store all information to push to the complete array
                        //In this array:
                        // - all flight information about this flight:  'allFlightDetails'
                        // - departure airport with its information     'departureAirport'
                        // - arrival airport with its information       'arrivalAirport'
                        vm.checkThisFlight = null;
                        vm.checkThisFlight = {};

                        vm.checkThisFlight.departureAirport     = null;
                        vm.checkThisFlight.arrivalAirport       = null;
                        vm.checkThisFlight.allFlightDetails     = null;
                        vm.checkThisFlight.databaseFlight       = null;

                        //Place all current flight information in allFlightDetails
                        vm.checkThisFlight.departureAirport     = vm.tempDepartureAirport;
                        vm.checkThisFlight.arrivalAirport       = vm.tempArrivalAirport;
                        vm.checkThisFlight.allFlightDetails     = flight.allData;
                        vm.checkThisFlight.databaseFlight       = flight;

                        //Push current checkThisFlight to allCheckedFlights
                        //console.log('before push tot allCheckedFlights', vm.checkThisFlight);
                        vm.allCheckedFlights.push(vm.checkThisFlight);
                        //console.log('Test checkThisFlight (ONLY 2 TIMES)', key, vm.allCheckedFlights);

                        //Fill test array to make sure for each went well!
                        //Use this name for next $q.all
                        //console.log('check 3');
                        vm.checkForEachQAll.push(flight);
                    }
                });

                $q.all(vm.checkForEachQAll).then(function success(data) {
                    angular.forEach(vm.allCheckedFlights, function(flight, key) {
                       // console.log(key, flight);
                    });
                }, function failure(err){

                });
            }, function failure(err){
            });

        }

        function getCorrectData () {
          console.log('getCorrectData: ', vm.flights)
        }

        function getSchedulesError(reason) {
            $log.error('getSchedulesError:', reason);
        }

        function getSchedulesSuccess(reason) {
            $log.error('getSchedulesSuccess:', reason);
        }

        // Show popup
        // -----
        function optionsModal($flight) {
            var flightOptionsModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'optionsModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                flightOptionsModal.dismiss('cancel');
            };
            vm.$$ix.delete = function () {
                flightOptionsModal.close(true);

                var deleteFlight = deleteFlightsFactory.hardDelete($flight.databaseFlight.database.id);
                
                $q.all(deleteFlight).then(function success(data){
                    // console.log(data);
                    $window.location.href = '/admin/flights';
                });
            };
        }
    }

})();
