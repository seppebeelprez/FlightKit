/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.factories')
        .factory('GetAccountFactory', GetAccountFactory);

    GetAccountFactory.$inject = [
        '$http',
        'config'
    ];

    function GetAccountFactory(

        $http,
        config
    ) {

        return {

            getAccount : function(GetAccount) {
                $http.get(config.api + 'account')
                    .then (function(data){
                            GetAccount.account = data.data;
                            console.log("GetAccount works!");
                            console.log(GetAccount.account);
                        },
                        function(){
                            console.log("GetAccount doesn't works!");
                        });
            }
        }
    }
})();