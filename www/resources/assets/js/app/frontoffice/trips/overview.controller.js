/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsOverviewController', TripsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',

        //Custom
        'getTripsFactory',
        'deleteTripsFactory',
        'config'
    ];

    function TripsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,

        //Custom
        getTripsFactory,
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
            // delete: deleteTrip
        };

        //Array to stack all trip with api info
        // vm.trips = [];
        //Fake array to complete $q.all
        // vm.databaseTrips = {};

        function getTrips() {
            var params = {};
            return getTripsFactory
                .query(
                    params,
                    getTripsSuccess,
                    getTripsError);
        }

        function getTripsError(reason) {
            $log.error('getFlightsError:', reason);
        }
        function getTripsSuccess(response, responseHeader) {
            vm.databaseTrips = response[0];
            console.log('1: ', vm.databaseTrips);

            //Test array
            vm.allTripsData = [];
            //Array to save trips from database
            vm.trips = [];

            angular.forEach(vm.databaseTrips.trips,function(trip,key){

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

            return vm.getData = $q.all(vm.allTripsData).then(function success(data){
                console.log('[2]: ', vm.trips);
            });

            

            // var apiKey = 's48vh9gfa7bbya2cy53sbe8w';
            // $.ajax({
            //     type:'GET',
            //     // dataType: 'jsonp',
            //     // crossDomain: true,
            //     url:"https://api.gettyimages.com:443/v3/search/images/creative?orientations=Horizontal&page=1&page_size=1&phrase=london&sort_order=most_popular",
            //     beforeSend: function (request)
            //     {
            //         request.setRequestHeader("Api-Key", apiKey);
            //     }
            // }).then (function successCallback (data, status, headers, config){
            //         console.log('success: ', data)
            //     },
            //     function errorCallback (){
            //         console.log("data not sent to API, new object is not created");
            //     });

            // $.ajax(
            //     {
            //         type:'GET',
            //         url:"https://api.gettyimages.com:443/v3/search/images/creative?orientations=Horizontal&page=1&page_size=1&phrase=london&sort_order=most_popular",
            //         beforeSend: function (request)
            //         {
            //             request.setRequestHeader("Api-Key", apiKey);
            //
            //
            //         }})
            //     .done(function(data){
            //         console.log("Success with data", data)
            //
            //         $("#output").append("<img src='" + data.images[0].display_sizes[0].uri + "'/>");
            //     })
            //     .fail(function(data){
            //         alert(JSON.stringify(data,2))
            //     });
        }
    }

})();
