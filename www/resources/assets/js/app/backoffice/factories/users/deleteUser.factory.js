/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.adminusers')
        .factory('deleteUserFactory', deleteUserFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    deleteUserFactory.$inject = [
        '$http',
        'config'
    ];

    function deleteUserFactory(
        $http,
        config
    ) {
        return {
            
            hardDelete : function(id) {
                console.log('hardDelete.deleteUser: ', id);
                $http.delete(config.api + 'admin/users/delete/' + id)
                    .then (function successCallback (data, status, headers, config){
                        },
                        function errorCallback (){
                        });
            }
        }
    }

})();