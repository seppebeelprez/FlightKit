/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('detailFlightsFactory', detailFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    detailFlightsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function detailFlightsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'flights/detail/:airline/:number';

        var paramDefaults = {
            airline : '@airline',
            number  : '@number',
            format  : 'json'
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