/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('deleteTripsFactory', deleteTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    deleteTripsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function deleteTripsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            deleteTrip : function(id) {
                console.log('deleteTripsFactory.deleteTrip: ', id);
                $http.delete(config.api + 'trips/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get pivot trips: ", data);
                        },
                        function errorCallback (){
                            console.log("trips not deleted");
                        });
            },
            hardDelete : function(id) {
                console.log('hardDelete.deleteTrip: ', id);
                $http.delete(config.api + 'admin/trips/delete/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get pivot trips: ", data);
                        },
                        function errorCallback (){
                            console.log("trips not deleted");
                        });
            }
        }
    }

})();