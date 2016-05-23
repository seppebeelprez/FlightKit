/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('getTripsFactory', getTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getTripsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getTripsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'trips';

        var paramDefaults = {
            
        };

        var actions = {
            'query' : {
                method : 'GET',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }

})();