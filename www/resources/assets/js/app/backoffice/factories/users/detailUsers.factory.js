/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.adminusers')
        .factory('detailUsersFactory', detailUsersFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    detailUsersFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function detailUsersFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'admin/users/detail/:id';

        var paramDefaults = {
            id : '@id',
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