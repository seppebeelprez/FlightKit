/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('scheduleFlightAPIFactory', scheduleFlightAPIFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    scheduleFlightAPIFactory.$inject = [
        // Angular
        '$resource',
        'config',
        '$filter'
    ];

    function scheduleFlightAPIFactory(
        // Angular
        $resource,
        config,
        $filter
    ) {

        var vm = this;

        return {
            scheduleFlightAPI : function(ScheduleFlightAPI) {

                //BECAUSE FUCK CORS ORIGIN SHIT
                return $.ajax({
                    url: 'https://api.flightstats.com/flex/schedules/rest/v1/jsonp/flight/' +
                    '' + ScheduleFlightAPI.airline + '/' +
                    '' + ScheduleFlightAPI.number + '/departing/' +
                    '' + ScheduleFlightAPI.day + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                });
            },

            scheduleFlightAPI2 : function(ScheduleFlightAPI2) {

                console.log('Inside scheduleFlightAPI2: ', ScheduleFlightAPI2);

                vm.overview = [];

                return vm.overview = angular.forEach(ScheduleFlightAPI2, function(flight, key){
                    //BECAUSE FUCK CORS ORIGIN SHIT
                    vm.overview.push(
                        $.ajax({
                            url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                            '' + flight.airline + '/' +
                            '' + flight.number + '/dep/' +
                            '' + $filter('date')(flight.day, 'yyyy/MM/dd') + '?appId=' +
                            '' + config.appId + '&appKey=' +
                            '' + config.appKey + '',
                            dataType: 'jsonp',
                            crossDomain: true
                        })
                    );
                });
            }
        };

        //var url = 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/:airline/:number/departing/:year/:month/:day?appId=:appId&appKey=:appKey';
        ////var url = 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/4200/departing/2016/04/08?appId=dbb6ea9e&appKey=5bf1b2bedbd8e63dc1b3221cbd834c2c';
        //
        //var paramDefaults = {
        //    airline   : '@airline',
        //    number    : '@number',
        //    year      : '@year',
        //    month     : '@month',
        //    day       : '@day',
        //    appId     : config.appId,
        //    appKey    : config.appKey,
        //    format    : 'jsonp'
        //};
        //
        //var actions = {
        //    'query' : {
        //        method : 'GET',
        //        headers: {
        //            Accept: "application/json; charset=utf-8",
        //            "Content-Type": "application/json; charset=utf-8"
        //        },
        //        dataType: 'jsonp',
        //        crossDomain : true
        //    }
        //};
        //
        //return $resource(url, paramDefaults, actions);


    }

})();