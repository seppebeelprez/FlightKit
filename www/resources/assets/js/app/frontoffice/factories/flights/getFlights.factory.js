/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('getFlightsFactory', getFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getFlightsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getFlightsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'flights';

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