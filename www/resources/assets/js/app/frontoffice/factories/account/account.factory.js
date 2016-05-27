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
                            console.log(data);
                            return data;
                        },
                        function(){
                            console.log("GetAccount doesn't works!");
                        });
            },
            changePass : function(ChangePass) {
                console.log('GetAccountFactory.ChangePass');
                $http.put(config.api + 'account',
                    {
                        'oldpassword'   : ChangePass.oldpassword,
                        'newpassword'   : ChangePass.newpassword,
                        'confirmpassword'   : ChangePass.confirmpassword
                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("data sent to API, new object created", data);
                            // $window.location.href = '/trips';
                        },
                        function errorCallback (){
                            console.log("data not sent to API, new object is not created");
                        });
            }
        }
    }
})();