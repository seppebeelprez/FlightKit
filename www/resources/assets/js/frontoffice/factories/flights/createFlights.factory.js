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
        '$resource'
    ];

    function createFlightsFactory(
        $http,
        config,
        $state,
        $resource
    ) {
        return {

            createFlight : function(CreateFlight) {
                console.log('FlightFactory.createFlight');
                $http.post(config.api + 'flights',
                    {
                        'airline'   : CreateFlight.airline,
                        'number'    : CreateFlight.number,
                        'day'       : CreateFlight.date
                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("data sent to API, new object created");
                            $state.go('/flights',  {reload:true});
                        },
                        function errorCallback (){
                            console.log("data not sent to API, new object is not created");
                        });
            }

            //, scheduleFlightAPI : function(ScheduleFlightAPI) {
            //    //BECAUSE FUCK CORS ORIGIN SHIT
            //    return $.ajax({
            //            url: 'https://api.flightstats.com/flex/schedules/rest/v1/jsonp/flight/' +
            //            '' + ScheduleFlightAPI.airline + '/' +
            //            '' + ScheduleFlightAPI.number + '/departing/' +
            //            '' + ScheduleFlightAPI.year + '/' +
            //            '' + ScheduleFlightAPI.month + '/' +
            //            '' + ScheduleFlightAPI.day + '?appId=' +
            //            '' + config.appId + '&appKey=' +
            //            '' + config.appKey + '',
            //            dataType: 'jsonp',
            //            crossDomain: true
            //        });
            //}
        }
    }

})();