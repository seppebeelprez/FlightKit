/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsDetailController', TripsDetailController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsDetailController.$inject = [
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
        'detailTripsFactory',
        'deleteTripsFactory'
    ];

    function TripsDetailController(
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
        detailTripsFactory,
        deleteTripsFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        getDetailTrip();
        getCurrency();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Trip Detail',
            subtitle: 'Detail trip!'
        };

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

        // User Interaction
        // --------------
        vm.$$ix = {
            refresh: refresh,
            delete: deleteModal,
            // addToTrips: addToTrips,
            convert: convertMins,
            convertToCel: convertToCel,
            convertToFah: convertToFah,
            convertValuta: convertValuta,
            reverseValuta: reverseValuta
            // currencySecond: currencySecondSelected
        };
        
        vm.animationsEnabled = true;
        vm.currency = {};
        vm.currency.selectFirst = '';
        vm.currency.selectSecond = '';

        // Functions
        // --------------
        function refresh() {
            console.log('refresh');
            $window.location.reload();
        }

        function deleteTrip($id) {
            console.log('deleteTrip: ', $id);

            var deleteTrip = deleteTripsFactory.deleteTrip($id);

            $q.all(deleteTrip).then(function success(data){
                $window.location.href = '/trips';
            });
        }

        function getCurrency() {
            $http.get('../json/currency2.json')
                .then(function(data){
                    vm.trip.currency = data.data;
                });
        }

        function reverseValuta() {
            if(vm.currency.selectFirst && vm.currency.selectSecond ) {
                var oldFirst = vm.currency.selectFirst.code;
                var oldSecond = vm.currency.selectSecond.code;

                vm.currency.selectFirst.code = oldSecond;
                vm.currency.selectSecond.code = oldFirst;

                convertValuta();
            }
        }

        function convertValuta() {
            if(vm.currency.selectFirst && vm.currency.selectSecond ) {

                vm.currencyArray = [];

                var check = $.ajax({
                    url: "https://api.fixer.io/latest",
                    dataType: 'jsonp',
                    crossDomain: true,
                    success: function(data) {
                        // console.log('data', data);
                    }
                });
                vm.currencyArray.push(check);

                $q.all(vm.currencyArray).then(function success(data){
                    fx.rates = data[0].rates;
                    // console.log(fx.rates);
                    // console.log(vm.currency.selectFirst.code, vm.currency.selectSecond.code);

                    if(vm.currency.selectFirst.code == "EUR" && vm.currency.selectSecond.code != "EUR"){
                        var rate = fx(1).to(vm.currency.selectSecond.code);
                        vm.currency.currencyChanged = rate.toFixed(2);
                    }else if(vm.currency.selectSecond.code == "EUR" && vm.currency.selectFirst.code != "EUR"){
                        var rate2 = fx(1).to(vm.currency.selectFirst.code);
                        vm.currency.currencyChanged = (1 / rate2).toFixed(2);
                    }else if(vm.currency.selectFirst.code === vm.currency.selectSecond.code){
                        vm.currency.currencyChanged = (1.00).toFixed(2);
                    }
                    else {
                        var rate3= fx(1).from(vm.currency.selectFirst.code).to(vm.currency.selectSecond.code);
                        vm.currency.currencyChanged = rate3.toFixed(2);
                    }
                });
            }
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

        var toUTCDate = function(date){
            var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        };

        var millisToUTCDate = function(millis){
            return toUTCDate(new Date(millis));
        };

        function getDetailTrip() {
            var params = {
                trip_airport : $stateParams.airport
            };

            return vm.getData = detailTripsFactory.query(params, getDetailTripSuccess, getDetailTripError);
        }

        function getDetailTripError(reason) {
            $log.error('getDetailFlightError:', reason);
        }
        function getDetailTripSuccess(response, responseHeader) {
            // vm.data = response;
            // console.log('succes: ', response);
            vm.trip.databasetrip = response.dbtrip;
            vm.trip.apitrip = response.apitrip;
            vm.trip.apiweather = response.apiweather;
            vm.trip.apiforecast = response.apiforecast;
            vm.trip.forecast = {};
            
            var weatherValue = $filter('filter')(vm.weather, {name: response.apiweather.weather[0].main}, true);
            vm.trip.weatherIcon = weatherValue[0].icon;
            if(weatherValue.length > 0) {
                vm.trip.weatherIcon = weatherValue[0].icon;
            }else {
                vm.trip.weatherIcon = 'wi-day-sunny';
            }

            var sunrise = (vm.trip.apiweather.sys.sunrise + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var sunset = (vm.trip.apiweather.sys.sunset + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            
            vm.trip.apiweather.sys.sunrise = sunrise;
            vm.trip.apiweather.sys.sunset = sunset;

            //FORECAST 1 DAY FUTURE
            vm.trip.forecast.day1 = {};
            vm.trip.forecast.day1.date = (vm.trip.apiforecast.list[1].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay1 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[1].weather[0].main}, true);
            vm.trip.forecast.day1.weatherIcon = weatherValueDay1[0].icon;
            vm.trip.forecast.day1.minTemp = convertToCel(vm.trip.apiforecast.list[1].temp.min);
            vm.trip.forecast.day1.maxTemp = convertToCel(vm.trip.apiforecast.list[1].temp.max);

            //FORECAST 2 DAY FUTURE
            vm.trip.forecast.day2 = {};
            vm.trip.forecast.day2.date = (vm.trip.apiforecast.list[2].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay2 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[2].weather[0].main}, true);
            vm.trip.forecast.day2.weatherIcon = weatherValueDay2[0].icon;
            vm.trip.forecast.day2.minTemp = convertToCel(vm.trip.apiforecast.list[2].temp.min);
            vm.trip.forecast.day2.maxTemp = convertToCel(vm.trip.apiforecast.list[2].temp.max);

            //FORECAST 3 DAY FUTURE
            vm.trip.forecast.day3 = {};
            vm.trip.forecast.day3.date = (vm.trip.apiforecast.list[3].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay3 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[3].weather[0].main}, true);
            vm.trip.forecast.day3.weatherIcon = weatherValueDay3[0].icon;
            vm.trip.forecast.day3.minTemp = convertToCel(vm.trip.apiforecast.list[3].temp.min);
            vm.trip.forecast.day3.maxTemp = convertToCel(vm.trip.apiforecast.list[3].temp.max);

            //FORECAST 4 DAY FUTURE
            vm.trip.forecast.day4 = {};
            vm.trip.forecast.day4.date = (vm.trip.apiforecast.list[4].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay4 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[4].weather[0].main}, true);
            vm.trip.forecast.day4.weatherIcon = weatherValueDay4[0].icon;
            vm.trip.forecast.day4.minTemp = convertToCel(vm.trip.apiforecast.list[4].temp.min);
            vm.trip.forecast.day4.maxTemp = convertToCel(vm.trip.apiforecast.list[4].temp.max);

            //FORECAST 5 DAY FUTURE
            vm.trip.forecast.day5 = {};
            vm.trip.forecast.day5.date = (vm.trip.apiforecast.list[5].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay5 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[5].weather[0].main}, true);
            vm.trip.forecast.day5.weatherIcon = weatherValueDay5[0].icon;
            vm.trip.forecast.day5.minTemp = convertToCel(vm.trip.apiforecast.list[5].temp.min);
            vm.trip.forecast.day5.maxTemp = convertToCel(vm.trip.apiforecast.list[5].temp.max);
            
            console.log(vm.trip);

        }


        vm.toUTCDate = toUTCDate;
        vm.millisToUTCDate = millisToUTCDate;

        // Show delete modal popup
        // -----
        function deleteModal() {
            console.log(vm.trip);
            var deleteTripModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteTripModal.dismiss('cancel');
            };
            vm.$$ix.deleteTrip = function ($id) {
                deleteTripModal.close(true);
                console.log($id);
                deleteTrip($id);
            };
        }
    }

})();
