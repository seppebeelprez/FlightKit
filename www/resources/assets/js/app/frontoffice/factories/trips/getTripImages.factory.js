/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('getTripImagesFactory', getTripImagesFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getTripImagesFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function getTripImagesFactory(
        $http,
        config,
        $state,
        $window
    ) {

        // var apiKey = 's48vh9gfa7bbya2cy53sbe8w';
        $http.defaults.headers.common['Api-Key'] = 's48vh9gfa7bbya2cy53sbe8w';
        
        return {
            
            tripImages : function(GetTripImage) {
                console.log('TripFactory.createTrip');
                $http.get('https://api.gettyimages.com:443/v3/search/images/creative?orientations=Horizontal&page=1&page_size=1&phrase=london&sort_order=most_popular',
                    {

                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("Image retrieved: ", data.data.images[0].display_sizes[0].uri);
                        },
                        function errorCallback (){
                            console.log("Image not retrieved!");
                        });
            }
        }
    }

})();