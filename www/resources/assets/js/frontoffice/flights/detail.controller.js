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

        //Custom
        'detailFlightsFactory'
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

        //Custom
        detailFlightsFactory
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

        // $scope.loading = true;

        // vm.getData = function () {
        //     // spinnerService.show('booksSpinner');
        //
        //     getDetailFlight();
        //
        // };

        // vm.weather = {
        //     Drizzle: 'wi-sleet',
        //     Rain: 'wi-sleet'
        // };

        vm.weather = [
            {name:'Clouds', icon:'wi-cloudy'},
            {name:'Dust/sand whirls', icon:'wi-rain'},
            {name:'Dust storm', icon:'wi-sleet'},
            {name:'Fog', icon:'wi-fog'},
            {name:'Funnel cloud', icon:'wi-sleet'},
            {name:'Hail', icon:'wi-sleet'},
            {name:'Haze', icon:'wi-sleet'},
            {name:'Ice crystals', icon:'wi-sleet'},
            {name:'Ice pellets', icon:'wi-sleet'},
            {name:'Mist', icon:'wi-rain'},
            {name:'Rain', icon:'wi-rain'},
            {name:'Sand', icon:'wi-sleet'},
            {name:'Sand storm', icon:'wi-sleet'},
            {name:'Small hail', icon:'wi-sleet'},
            {name:'Smoke/fumes', icon:'wi-sleet'},
            {name:'Snow', icon:'wi-sleet'},
            {name:'Snow grains', icon:'wi-sleet'},
            {name:'Spray', icon:'wi-sleet'},
            {name:'Squalls', icon:'wi-sleet'},
            {name:'Unknown precipitation', icon:'wi-sleet'},
            {name:'Volcanic ash', icon:'wi-volcano'},
            {name:'Widespread dust', icon:'wi-sleet'}
        ];


        // User Interaction
        // --------------
        vm.$$ix = {
            refresh: refresh,
            convert: convertMins,
            convertToCel: convertToCel,
            convertToFah: convertToFah
        };

        function convertMins(minutes) {
            var hours = Math.floor( minutes / 60);
            var mins = minutes % 60;
            console.log('convertMins: ', hours, mins);
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

        console.log($stateParams.id);
        
        function refresh() {
            console.log('refresh');
            $window.location.reload();
        }

        function getDetailFlight() {
            // console.log('getDetailFlight');
            var params = {
                flight_id : $stateParams.id
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
            vm.flight.depWeatherIcon = depWeatherValue[0].icon;

            // var arrWeatherCondition = $filter('filter')(response.apiArrWeather.metar.tags, {key: 'Prevailing Conditions'}, true);
            var arrWeatherValue = $filter('filter')(vm.weather, {name: response.apiArrWeather.weather[0].main}, true);
            vm.flight.arrWeatherIcon = arrWeatherValue[0].icon;

            console.log(vm.flight.apiDepWeather, vm.flight.apiArrWeather);
            console.log(response.apiDepWeather.weather[0].main, response.apiArrWeather.weather[0].main);
            console.log(vm.flight.depWeatherIcon, vm.flight.arrWeatherIcon);
        }
    }

})();
