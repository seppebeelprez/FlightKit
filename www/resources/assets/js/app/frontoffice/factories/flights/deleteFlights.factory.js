/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('deleteFlightsFactory', deleteFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    deleteFlightsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function deleteFlightsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            deleteFlight : function(id) {
                console.log('deleteFlightsFactory.deleteFlight: ', id);
                $http.delete(config.api + 'flights/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get pivot flights: ", data);
                            // $window.location.href = '/flights';
                        },
                        function errorCallback (){
                            console.log("flight not deleted");
                        });
            },

            deleteOutdatedFlight : function(id) {
                console.log('deleteFlightsFactory.deleteOutdatedFlight: ', id);
                $http.delete(config.api + 'flights/outdated/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get oudated flights: ", data);
                            // $window.location.href = '/flights';
                        },
                        function errorCallback (){
                            console.log("flight not deleted");
                        });
            },
            hardDelete : function(id) {
            console.log('hardDelete.deleteFlight: ', id);
            $http.delete(config.api + 'admin/flights/delete/' + id)
                .then (function successCallback (data, status, headers, config){
                        console.log ("get pivot flights: ", data);
                    },
                    function errorCallback (){
                        console.log("flight not deleted");
                    });
            }
        }
    }

})();