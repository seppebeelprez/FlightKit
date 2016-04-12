/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .controller('FlightsOverviewController', FlightsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    FlightsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',

        //Custom
        'getFlightsFactory',
        'scheduleFlightAPIFactory',
        'config'
    ];

    function FlightsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,

        //Custom
        getFlightsFactory,
        scheduleFlightAPIFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getFlights();
        //vm.overview = getSchedules();

        //$scope.promises = [];

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flights Overview',
            subtitle: 'Overview of your added flights!'
        };


        //function flightDashboard() {
        //
        //    var getFlights = function() {
        //        var params = {};
        //        return getFlightsFactory
        //            .query(params)
        //            .$promise.then(function(data) {
        //                vm.flights = data[0].flights;
        //                console.log('vm.flights: ', vm.flights);
        //                return vm.flights;
        //            });
        //    },
        //        getAdditionalInfo = function() {
        //
        //            //$scope.data = null ; //remove existing data
        //            //var promises = [];
        //            //angular.forEach(vm.flights,function(flight,key){
        //            //
        //            //    var result = $.ajax({
        //            //        url: 'https://api.flightstats.com/flex/schedules/rest/v1/jsonp/flight/' +
        //            //        '' + flight.airline + '/' +
        //            //        '' + flight.number + '/departing/' +
        //            //        '' + $filter('date')(flight.day, 'yyyy/MM/dd') + '?appId=' +
        //            //        '' + config.appId + '&appKey=' +
        //            //        '' + config.appKey + '',
        //            //        dataType: 'jsonp',
        //            //        crossDomain: true
        //            //    });
        //            //    promises.push(result);
        //            //
        //            //});
        //            //$q.all(promises).then(function success(data){
        //            //    console.log($scope.data); // Should all be here
        //            //}, function failure(err){
        //            //    // Can handle this is we want
        //            //});
        //
        //            //angular.forEach(vm.flights, function(flight, key){
        //            //    console.log('In foreach');
        //            //    //BECAUSE FUCK CORS ORIGIN SHIT
        //            //
        //            //    $.ajax({
        //            //        url: 'https://api.flightstats.com/flex/schedules/rest/v1/jsonp/flight/' +
        //            //        '' + flight.airline + '/' +
        //            //        '' + flight.number + '/departing/' +
        //            //        '' + $filter('date')(flight.day, 'yyyy/MM/dd') + '?appId=' +
        //            //        '' + config.appId + '&appKey=' +
        //            //        '' + config.appKey + '',
        //            //        dataType: 'jsonp',
        //            //        crossDomain: true
        //            //    }).then(function(result) {
        //            //        console.log('Result: ', result);
        //            //        $scope.promises.push(result);
        //            //    });
        //            //
        //            //    //vm.promises.push(vm.data.status);
        //            //
        //            //    //vm.promises.push(flight = {
        //            //    //    id              : flight.id,
        //            //    //    departure       : data.responseJSON.appendix.airports[0].name + " (" + data.responseJSON.appendix.airports[0].iata +")",
        //            //    //    arrival         : data.responseJSON.appendix.airports[1].name + " (" + data.responseJSON.appendix.airports[1].iata +")",
        //            //    //    departureTime   : $filter('date')(data.responseJSON.scheduledFlights[0].departureTime, 'hh:mm a, MMM d'),
        //            //    //    carrier         : data.responseJSON.scheduledFlights[0].carrierFsCode,
        //            //    //    number          : data.responseJSON.scheduledFlights[0].flightNumber
        //            //    //});
        //            //
        //            //    console.log('Promises: ', vm.promises);
        //            //});
        //
        //        };
        //
        //    getFlights()
        //        .then(getAdditionalInfo);
        //
        //    //console.log('Outside: ', getAdditionalInfo());
        //
        //}



        function getFlights() {
            var params = {};
            return getFlightsFactory
                    .query(
                        params,
                        getFlightsSuccess,
                        getFlightsError);
        }

        function getFlightsError(reason) {
            $log.error('getFlightsError:', reason);
        }
        function getFlightsSuccess(response, responseHeader) {
            //$log.success('getFlightsSuccess:', response);
            vm.data = response[0];
            console.log('Retrieved own flights: ', vm.data.flights);

            getSchedules();

            //angular.forEach(vm.data.flights, function(flight, key){
            //    var params = {
            //        id      : flight.id,
            //        airline : flight.airline,
            //        day     : $filter('date')(flight.day, 'yyyy/MM/dd'),
            //        number  : flight.number
            //    };
            //
            //    var responsePromise = scheduleFlightAPIFactory.scheduleFlightAPI(params);
            //
            //    responsePromise.success(function(data) {
            //        console.log('scheduleFlightAPIFactory:success: ', data);
            //        //console.log(data);
            //
            //        vm.overview.push(flight = {
            //            id              : params.id,
            //            departure       : data.appendix.airports[0].name + " (" + data.appendix.airports[0].iata +")",
            //            arrival         : data.appendix.airports[1].name + " (" + data.appendix.airports[1].iata +")",
            //            departureTime   : $filter('date')(data.scheduledFlights[0].departureTime, 'hh:mm a, MMM d'),
            //            carrier         : data.scheduledFlights[0].carrierFsCode,
            //            number          : data.scheduledFlights[0].flightNumber
            //        });
            //    });
            //    responsePromise.error(function(data, status, headers, config) {
            //        console.log('failed!!!!');
            //    });
            //
            //    //vm.overview.push(flight);
            //});
        }

        function getSchedules() {
            console.log('getSchedules');
            $scope.data = null ; //remove existing data
            $scope.data = [];
            vm.allFlightsData = [];
            vm.flights = [];
            angular.forEach(vm.data.flights,function(flight,key){

                var result = $.ajax({
                    //url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    //'' + flight.airline + '/' +
                    //'' + flight.number + '/dep/' +
                    //'' + $filter('date')(flight.day, 'yyyy/MM/dd') + '?appId=' +
                    //'' + config.appId + '&appKey=' +
                    //'' + config.appKey + '',
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    '' + flight.flightId + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true,
                    success: function(data) {
                        console.log('data:', data);
                        //return vm.flights.push(data);
                        //
                        //vm.flights.push(flight = {
                        //    id                      : flight.id,
                        //    departure               : data.appendix.airports[0].name + " (" + data.appendix.airports[0].iata +")",
                        //    arrival                 : data.appendix.airports[1].name + " (" + data.appendix.airports[1].iata +")",
                        //    departureTime           : $filter('date')(data.flightStatuses[0].departureDate.dateLocal, 'hh:mm a, MMM d'),
                        //    actualDepartureTime     : $filter('date')(data.flightStatuses[0].operationalTimes.actualGateDeparture.dateLocal, 'hh:mm a, MMM d'),
                        //    carrier                 : data.flightStatuses[0].carrierFsCode,
                        //    number                  : data.flightStatuses[0].flightNumber,
                        //    status                  : data.flightStatuses[0].status
                        //});

                        vm.flights.push(data);
                    }
                });

                //console.log(result);
                vm.allFlightsData.push(result);

            });
            $q.all(vm.allFlightsData).then(function success(data){
                console.log('vm.flights: ', vm.flights); // Should all be here
                //console.log($scope.data);
            }, function failure(err){
                // Can handle this is we want
            });

        }

        function getSchedulesError(reason) {
            $log.error('getSchedulesError:', reason);
        }

        function getSchedulesSuccess(reason) {
            $log.error('getSchedulesSuccess:', reason);
        }

    }

})();
