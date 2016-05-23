/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.adminusers')
        .factory('getAdminUsersFactory', getAdminUsersFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getAdminUsersFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getAdminUsersFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'admin/users';
        
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