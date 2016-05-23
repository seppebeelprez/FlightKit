/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('createTripsFactory', createTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    createTripsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function createTripsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            createTrip : function(CreateTrip) {
                console.log('TripFactory.createTrip');
                $http.post(config.api + 'trips',
                    {
                        'airport'   : CreateTrip.airport
                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("data sent to API, new object created");
                            // $window.location.href = '/trips';
                        },
                        function errorCallback (){
                            console.log("data not sent to API, new object is not created");
                        });
            }
        }
    }

})();