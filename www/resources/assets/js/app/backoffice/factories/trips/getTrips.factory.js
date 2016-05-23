/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.admintrips')
        .factory('getAdminTripsFactory', getAdminTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getAdminTripsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getAdminTripsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'admin/trips';
        
        var paramDefaults = {
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