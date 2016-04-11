/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .controller('FlightsDetailController', FlightsDetailController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    FlightsDetailController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',

        //Custom
        'detailFlightsFactory'
    ];

    function FlightsDetailController(
        // Angular
        $log,
        $scope,
        $state,

        //Custom
        detailFlightsFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        detailFlight();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flight Detail',
            subtitle: 'Detail flight!'
        };

        function detailFlight() {
            console.log('detailFlight');
            var params = {};

            return detailFlightsFactory.query(params, getDetailFlightSuccess, getDetailFlightError);
        }

        function getDetailFlightError(reason) {
            $log.error('getDetailFlightError:', reason);
        }
        function getDetailFlightSuccess(response, responseHeader) {
            vm.data = response[0];
            console.log(vm.data)
        }
    }

})();
