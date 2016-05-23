/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('createFlightsFactory', createFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    createFlightsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function createFlightsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            createFlight : function(CreateFlight) {
                console.log('FlightFactory.createFlight');
                $http.post(config.api + 'flights',
                    {
                        'airline'   : CreateFlight.airline,
                        'number'    : CreateFlight.number,
                        'day'       : CreateFlight.date,
                        'flightId'  : CreateFlight.flightId,
                        'departure' : CreateFlight.departureCode,
                        'arrival'   : CreateFlight.arrivalCode
                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("data sent to API, new object created");
                            $window.location.href = '/flights';
                        },
                        function errorCallback (){
                            console.log("data not sent to API, new object is not created");
                        });
            }
        }
    }

})();