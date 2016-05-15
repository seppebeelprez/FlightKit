/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('detailTripsFactory', detailTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    detailTripsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function detailTripsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'trips/detail/:trip_airport';

        var paramDefaults = {
            trip_airport : '@airport',
            format    : 'json'
        };

        var actions = {
            'query' : {
                method : 'GET',
                isArray: false
            }
        };

        return $resource(url, paramDefaults, actions);
    }

})();