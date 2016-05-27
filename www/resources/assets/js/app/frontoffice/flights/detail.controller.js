/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .controller('FlightsDetailController', FlightsDetailController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    FlightsDetailController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$stateParams',
        '$window',
        '$http',
        '$filter',
        '$uibModal',
        '$q',

        //Custom
        'detailFlightsFactory',
        'deleteFlightsFactory',
        'createTripsFactory',
        'getTripsFactory',
        'deleteTripsFactory'
    ];

    function FlightsDetailController(
        // Angular
        $log,
        $scope,
        $state,
        $stateParams,
        $window,
        $http,
        $filter,
        $uibModal,
        $q,

        //Custom
        detailFlightsFactory,
        deleteFlightsFactory,
        createTripsFactory,
        getTripsFactory,
        deleteTripsFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        getDetailFlight();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flight Detail',
            subtitle: 'Detail flight!'
        };

        vm.flight = {};
        vm.trip = {};

        vm.weather = [
            {name:'Clear', icon:'wi-day-sunny'},
            {name:'Rain', icon:'wi-rain'},
            {name:'Mist', icon:'wi-day-fog'},
            {name:'Clouds', icon:'wi-cloudy'},
            {name:'Atmosphere', icon:'wi-fog'},
            {name:'Snow', icon:'wi-snow'},
            {name:'Drizzle', icon:'wi-showers'},
            {name:'Thunderstorm', icon:'wi-thunderstorm'},
            {name:'Extreme', icon:'wi-hurricane'},
            {name:'Haze', icon:'wi-day-haze'}
        ];

        vm.checkIfTrip = null;

        // User Interaction
        // --------------
        vm.$$ix = {
            refresh: refresh,
            delete: deleteModal,
            favorite: addToTrips,
            removefavorite: deleteFromTripsModal,
            convert: convertMins,
            convertToCel: convertToCel,
            convertToFah: convertToFah
        };

        vm.animationsEnabled = true;

        // Functions
        // --------------
        function refresh() {
            console.log('refresh');
            $window.location.reload();
        }

        function convertMins(minutes) {
            var hours = Math.floor( minutes / 60);
            var mins = minutes % 60;
            var time = hours + 'h' + mins + 'm';
            return time;
        }

        function convertToCel(temperature) {
            var cel = temperature - 273.15;
            return cel;
        }

        function convertToFah(temperature) {
            var fah = (temperature - 273.15) * 9.0 / 5.0 + 32;
            return fah;
        }

        function getDetailFlight() {
            // console.log('getDetailFlight');
            var params = {
                airline : $stateParams.airline,
                number  : $stateParams.number
            };

            return vm.getData = detailFlightsFactory.query(params, getDetailFlightSuccess, getDetailFlightError);
        }

        function getDetailFlightError(reason) {
            $log.error('getDetailFlightError:', reason);
        }
        function getDetailFlightSuccess(response, responseHeader) {
            // vm.data = response[0];
            // console.log('succes: ', response);
            vm.flight.databaseflight = response.dbflight[0];
            vm.flight.apiflight = response.apiflight;
            vm.flight.apiDepAirport = response.apiDepAirport;
            vm.flight.apiArrAirport = response.apiArrAirport;
            vm.flight.apischeduleflight = response.apischeduleflight;
            vm.flight.apiDepWeather = response.apiDepWeather;
            vm.flight.apiArrWeather = response.apiArrWeather;

            // var depWeatherCondition = $filter('filter')(response.apiDepWeather.weather[0].main, {key: 'Prevailing Conditions'}, true);
            var depWeatherValue = $filter('filter')(vm.weather, {name: response.apiDepWeather.weather[0].main}, true);
            if(depWeatherValue.length > 0) {
                vm.flight.depWeatherIcon = depWeatherValue[0].icon;
            }else {
                vm.flight.depWeatherIcon = 'wi-day-sunny';
            }

            // var arrWeatherCondition = $filter('filter')(response.apiArrWeather.metar.tags, {key: 'Prevailing Conditions'}, true);
            var arrWeatherValue = $filter('filter')(vm.weather, {name: response.apiArrWeather.weather[0].main}, true);
            vm.flight.arrWeatherIcon = arrWeatherValue[0].icon;
            if(arrWeatherValue.length > 0) {
                vm.flight.arrWeatherIcon = arrWeatherValue[0].icon;
            }else {
                vm.flight.arrWeatherIcon = 'wi-day-sunny';
            }


            console.log(vm.flight);
            getTrips();
        }

        function addToTrips() {
            // console.log('createTrip');
            // console.log('vm.trip to add: ', vm.flight.databaseflight.arrival);

            vm.tripIdArray = [];
            var checkDuplicate = false;

            angular.forEach(vm.userTrips,function(trip,key){
            
                vm.tripIdArray.push(trip);
            
                if (vm.flight.databaseflight.arrival == trip.airport) {
                    // console.log('DUPLICATE: ', vm.flight.databaseflight.arrival, trip.airport);
            
                    var duplicateTripModal = $uibModal.open({
                        animation: vm.animationsEnabled,
                        templateUrl: 'duplicateModal.html',
                        scope: $scope
                    });
                    vm.$$ix.cancel = function () {
                        duplicateTripModal.dismiss('cancel');
                    };
                    
                    vm.$$ix.detail = function () {
                        // console.log('existingTripDetailId: ', trip.id);
                        duplicateTripModal.dismiss('Go to detail: ', trip.id);
                    };
                    checkDuplicate = true;
                }
            });
            
            if(checkDuplicate == true){
            }else {
                vm.trip.airport = vm.flight.databaseflight.arrival;
                var createTrips = createTripsFactory.createTrip(vm.trip);

                $q.all(createTrips).then(function success(data){
                    vm.checkIfTrip = true;
                });

                var addedToTripsModal = $uibModal.open({
                    animation: vm.animationsEnabled,
                    templateUrl: 'addedToTripsModal.html',
                    scope: $scope
                });
                vm.$$ix.cancel = function () {
                    addedToTripsModal.dismiss('cancel');
                    getTrips();
                };
            }
        }
        
        function removeFromTrips($airport) {
            var searchTrip = $filter('filter')(vm.userTrips, {airport: $airport}, true);
            var deleteTrip = deleteTripsFactory.deleteTrip(searchTrip[0].id);

            $q.all(deleteTrip).then(function success(data){
                getTrips();
            });
        }

        // Get already added trips
        // -----
        function getTrips() {
            console.log('getTrips');
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
            vm.userTrips = response[0].trips;

            var checkIfTrip = $filter('filter')(vm.userTrips, {airport: vm.flight.databaseflight.arrival}, true);

            $q.all(checkIfTrip).then(function success(data){
                if(checkIfTrip.length > 0) {
                    vm.checkIfTrip = true;
                }else {
                    vm.checkIfTrip = false;
                }
            });
        }


        // Show delete modal popup
        // -----
        function deleteModal() {
            var deleteFlightModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteFlightModal.dismiss('cancel');
            };
            vm.$$ix.deleteFlight = function ($id) {
                deleteFlightModal.close(true);

                var deleteFlight = deleteFlightsFactory.deleteFlight($id);

                $q.all(deleteFlight).then(function success(data){
                    $window.location.href = '/flights';
                });
            };
        }

        function deleteFromTripsModal() {
            var deleteTripModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteFromTripsModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteTripModal.dismiss('cancel');
            };
            vm.$$ix.deleteTrip = function ($airport) {
                vm.checkIfTrip = false;
                console.log(vm.checkIfTrip);
                deleteTripModal.close(true);
                console.log($airport);
                removeFromTrips($airport);
            };
        }
    }

})();
