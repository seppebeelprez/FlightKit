/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.account')
        .factory('accountFactory', accountFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    accountFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function accountFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'account';

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