/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.admintrips')
        .controller('AdminTripsOverviewController', AdminTripsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminTripsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',
        '$uibModal',
        '$window',

        //Custom
        'getAdminTripsFactory',
        'deleteTripsFactory',
        'config'
    ];

    function AdminTripsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,
        $uibModal,
        $window,

        //Custom
        getAdminTripsFactory,
        deleteTripsFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getTrips();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Trips Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            options: optionsModal
        };

        function getTrips() {
            var params = {};
            return vm.getData = getAdminTripsFactory
                    .query(
                        params,
                        getTripsSuccess,
                        getTripsError);
        }

        function getTripsError(reason) {
            $log.error('getTripsError:', reason);
        }

        function getTripsSuccess(response, responseHeader) {
            console.log(response.trips);
            vm.data = response.trips;
            // console.log('1: ', response);
            //
            //Test array
            vm.allTripsData = [];
            //Array to save trips from database
            vm.trips = [];

            angular.forEach(vm.data,function(trip,key){

                console.log(trip);

                var result = $.ajax({
                    url: 'https://api.flightstats.com/flex/airports/rest/v1/jsonp/iata/' +
                    '' + trip.airport + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                }).then (function successCallback (data, status, headers, config){
                        //Empty array to make sure it's empty
                        vm.currentTripData = null;
                        //Array to save API + database info for 1 trip
                        vm.currentTripData = {};
                        //Store API data
                        vm.currentTripData.allData = data[0];
                        //Store database id to go later to the details view
                        vm.currentTripData.databaseId = trip.id;
                        vm.currentTripData.dbtrip = trip;

                        //Push array with 1 flight to array with multiple trips
                        vm.trips.push(vm.currentTripData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                vm.allTripsData.push(result);

            });

            $q.all(vm.allTripsData).then(function success(data){
                console.log('[2]: ', vm.trips);
                // return vm.getData = vm.allTripsData;
            });
        }

        // Show popup
        // -----
        function optionsModal($trip) {
            console.log($trip);
            var tripOptionsModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'optionsModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                tripOptionsModal.dismiss('cancel');
            };
            vm.$$ix.delete = function () {
                tripOptionsModal.close(true);

                var deleteTrip = deleteTripsFactory.hardDelete($trip.databaseId);

                $q.all(deleteTrip).then(function success(data){
                    $window.location.href = '/admin/trips';
                });
            };
        }
    }

})();
