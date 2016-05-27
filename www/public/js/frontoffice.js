/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    // Module declarations
    var app = angular.module('app',
        [
            // Angular Module Dependencies
            // ---------------------------
            //'ngAnimate',
            //'ngMaterial',
            //'ngMessages',
            'ngRoute',
            'ngResource',
            //'ui.router', // Angular UI Router

            // Module Dependencies
            // -------------------
            'app.home',
            'app.flights',
            'app.trips',
            'app.account',
            'app.factories',

            'app.adminflights',
            'app.admintrips',
            'app.adminusers'
            //'app.style-guide'
        ]);

    angular.module('app.home', ['ui.router', 'ngRoute']);
    angular.module('app.flights', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy']);
    angular.module('app.trips', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy']);
    angular.module('app.account', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'validation.match']);

    angular.module('app.adminflights', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'angularUtils.directives.dirPagination']);
    angular.module('app.admintrips', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'angularUtils.directives.dirPagination']);
    angular.module('app.adminusers', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap', 'angucomplete-alt', 'ngMaterial', 'cgBusy', 'angularUtils.directives.dirPagination']);

    angular.module('app.factories', ['ui.router']);
})();




/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app')
        .config(Config);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Config.$inject = [
        // Angular
        '$httpProvider'
    ];

    function Config(
        // Angular
        $httpProvider
    ) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
})();




/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app')
        .constant('config', {
            appId : '8ea22765',
            appKey : 'f25a316d50feb48ecde4d35e5d235985',
            api : 'api/v1/'
        });
})();




/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminflights')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/admin/flights', {
                url: '/admin/flights',
                views: {
                    main: {
                        controller: 'AdminFlightsOverviewController as vm',
                        templateUrl: getView('admin/flights/flights')
                    }
                }
            });
            // .state('/flights/create', {
            //     url: '/flights/create',
            //     views: {
            //         main: {
            //             controller: 'FlightsCreateController as vm',
            //             templateUrl: getView('flights/create')
            //         }
            //     }
            // })
            // .state('/flights/detail/:airline/:number', {
            //     url: '/flights/detail/:airline/:number',
            //     views: {
            //         main: {
            //             controller: 'FlightsDetailController as vm',
            //             templateUrl: getView('flights/detail')
            //         }
            //     }
            // });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminflights')
        .controller('AdminFlightsOverviewController', AdminFlightsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminFlightsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',
        '$uibModal',
        '$window',

        //Custom
        'getAdminFlightsFactory',
        'deleteFlightsFactory',
        'config'
    ];

    function AdminFlightsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,
        $uibModal,
        $window,

        //Custom
        getAdminFlightsFactory,
        deleteFlightsFactory,
        // scheduleFlightAPIFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getFlights();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flights Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            options: optionsModal
        };

        function getFlights() {
            var params = {};
            return vm.getData = getAdminFlightsFactory
                    .query(
                        params,
                        getFlightsSuccess,
                        getFlightsError);
        }

        function getFlightsError(reason) {
            $log.error('getFlightsError:', reason);
        }

        function getFlightsSuccess(response, responseHeader) {
            // console.log(response.flights);
            vm.data = response.flights;
            getSchedules();
        }

        function getSchedules() {

            //Test array
            vm.allFlightsData = [];
            //Array to save flight from database
            vm.flights = [];

            //Foreach to get API information for each flight from the user in the database
            angular.forEach(vm.data,function(flight,key){

                var result = $.ajax({
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    '' + flight.flightId + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                }).then (function successCallback (data, status, headers, config){
                        //Empty array to make sure it's empty
                        vm.currentFlightData = null;
                        //Array to save API + database info for 1 flight
                        vm.currentFlightData = {};
                        //Store API data
                        vm.currentFlightData.allData = data;
                        //Store database id to go later to the details view
                        vm.currentFlightData.database = flight;
                        //Push array with 1 flight to array with multiple flights
                        vm.flights.push(vm.currentFlightData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                //Fill test array to make sure for each went well!
                //Use this name for next $q.all
                vm.allFlightsData.push(result);
            });

            $q.all(vm.allFlightsData).then(function success(data){
                // console.log('vm.flights: ', vm.flights); // Should all be here


                //Test array
                vm.checkForEachQAll = [];
                //Array to store other arrays with checked flight information
                vm.allCheckedFlights = [];


                //For each flight of the user in the database get the correct information
                //Especially for the departure and arrival airport
                angular.forEach(vm.flights,function(flight,key){

                    if (flight.allData.error) {
                        console.log('404 remove flight: ', flight.database.id);
                        deleteFlightsFactory.deleteOutdatedFlight(flight.database.id);
                    }
                    else {
                        //Get current departure and arrival code of flight
                        //ex. BRU, JFK
                        var depCode = null;
                        var arrCode = null;
                        depCode = flight.allData.flightStatus.departureAirportFsCode;
                        arrCode = flight.allData.flightStatus.arrivalAirportFsCode;

                        //Get all the airports of the current flight
                        //Connected flight can have multiple airports
                        //other than the departure and arrival
                        vm.allAirports = null;
                        vm.allAirports = [];
                        vm.allAirports = flight.allData.appendix.airports;

                        //Test array
                        vm.foreachCheckDataAirport = [];

                        //Temporary arrays
                        vm.tempDepartureAirport = null;
                        vm.tempDepartureAirport = {};
                        vm.tempArrivalAirport = null;
                        vm.tempArrivalAirport = {};


                        //Loop to each airport of current flight and check if the
                        //departure and arrival airports correspond, then push info
                        //to correct place in array checkThisFlight
                        angular.forEach(vm.allAirports, function(airport, key) {

                            //Check if correspond with departureCode
                            if ( airport.iata == depCode ) {
                                vm.tempDepartureAirport = airport;
                            }
                            //Check if correspond with arrivalCode
                            else if ( airport.iata == arrCode ) {
                                vm.tempArrivalAirport = airport;
                            }
                        });

                        //console.log('should be after check 2');
                        //Array to store all information to push to the complete array
                        //In this array:
                        // - all flight information about this flight:  'allFlightDetails'
                        // - departure airport with its information     'departureAirport'
                        // - arrival airport with its information       'arrivalAirport'
                        vm.checkThisFlight = null;
                        vm.checkThisFlight = {};

                        vm.checkThisFlight.departureAirport     = null;
                        vm.checkThisFlight.arrivalAirport       = null;
                        vm.checkThisFlight.allFlightDetails     = null;
                        vm.checkThisFlight.databaseFlight       = null;

                        //Place all current flight information in allFlightDetails
                        vm.checkThisFlight.departureAirport     = vm.tempDepartureAirport;
                        vm.checkThisFlight.arrivalAirport       = vm.tempArrivalAirport;
                        vm.checkThisFlight.allFlightDetails     = flight.allData;
                        vm.checkThisFlight.databaseFlight       = flight;

                        //Push current checkThisFlight to allCheckedFlights
                        //console.log('before push tot allCheckedFlights', vm.checkThisFlight);
                        vm.allCheckedFlights.push(vm.checkThisFlight);
                        //console.log('Test checkThisFlight (ONLY 2 TIMES)', key, vm.allCheckedFlights);

                        //Fill test array to make sure for each went well!
                        //Use this name for next $q.all
                        //console.log('check 3');
                        vm.checkForEachQAll.push(flight);
                    }
                });

                $q.all(vm.checkForEachQAll).then(function success(data) {
                    angular.forEach(vm.allCheckedFlights, function(flight, key) {
                       // console.log(key, flight);
                    });
                }, function failure(err){

                });
            }, function failure(err){
            });

        }

        function getCorrectData () {
          console.log('getCorrectData: ', vm.flights)
        }

        function getSchedulesError(reason) {
            $log.error('getSchedulesError:', reason);
        }

        function getSchedulesSuccess(reason) {
            $log.error('getSchedulesSuccess:', reason);
        }

        // Show popup
        // -----
        function optionsModal($flight) {
            var flightOptionsModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'optionsModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                flightOptionsModal.dismiss('cancel');
            };
            vm.$$ix.delete = function () {
                flightOptionsModal.close(true);

                var deleteFlight = deleteFlightsFactory.hardDelete($flight.databaseFlight.database.id);
                
                $q.all(deleteFlight).then(function success(data){
                    // console.log(data);
                    $window.location.href = '/admin/flights';
                });
            };
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.admintrips')
        .controller('AdminTripsOverviewController', AdminTripsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminTripsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',
        '$uibModal',
        '$window',

        //Custom
        'getAdminTripsFactory',
        'deleteTripsFactory',
        'config'
    ];

    function AdminTripsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,
        $uibModal,
        $window,

        //Custom
        getAdminTripsFactory,
        deleteTripsFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getTrips();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Trips Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            options: optionsModal
        };

        function getTrips() {
            var params = {};
            return vm.getData = getAdminTripsFactory
                    .query(
                        params,
                        getTripsSuccess,
                        getTripsError);
        }

        function getTripsError(reason) {
            $log.error('getTripsError:', reason);
        }

        function getTripsSuccess(response, responseHeader) {
            console.log(response.trips);
            vm.data = response.trips;
            // console.log('1: ', response);
            //
            //Test array
            vm.allTripsData = [];
            //Array to save trips from database
            vm.trips = [];

            angular.forEach(vm.data,function(trip,key){

                console.log(trip);

                var result = $.ajax({
                    url: 'https://api.flightstats.com/flex/airports/rest/v1/jsonp/iata/' +
                    '' + trip.airport + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                }).then (function successCallback (data, status, headers, config){
                        //Empty array to make sure it's empty
                        vm.currentTripData = null;
                        //Array to save API + database info for 1 trip
                        vm.currentTripData = {};
                        //Store API data
                        vm.currentTripData.allData = data[0];
                        //Store database id to go later to the details view
                        vm.currentTripData.databaseId = trip.id;
                        vm.currentTripData.dbtrip = trip;

                        //Push array with 1 flight to array with multiple trips
                        vm.trips.push(vm.currentTripData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                vm.allTripsData.push(result);

            });

            $q.all(vm.allTripsData).then(function success(data){
                console.log('[2]: ', vm.trips);
                // return vm.getData = vm.allTripsData;
            });
        }

        // Show popup
        // -----
        function optionsModal($trip) {
            console.log($trip);
            var tripOptionsModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'optionsModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                tripOptionsModal.dismiss('cancel');
            };
            vm.$$ix.delete = function () {
                tripOptionsModal.close(true);

                var deleteTrip = deleteTripsFactory.hardDelete($trip.databaseId);

                $q.all(deleteTrip).then(function success(data){
                    $window.location.href = '/admin/trips';
                });
            };
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.admintrips')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/admin/trips', {
                url: '/admin/trips',
                views: {
                    main: {
                        controller: 'AdminTripsOverviewController as vm',
                        templateUrl: getView('admin/trips/trips')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminusers')
        .controller('AdminUsersDetailController', AdminUsersDetailController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminUsersDetailController.$inject = [
        // Angular
        '$log',
        '$stateParams',
        '$uibModal',
        '$scope',
        '$q',
        '$window',

        //Custom
        'detailUsersFactory',
        'deleteUserFactory'
    ];

    function AdminUsersDetailController(
        // Angular
        $log,
        $stateParams,
        $uibModal,
        $scope,
        $q,
        $window,

        //Custom
        detailUsersFactory,
        deleteUserFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        getUser();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Users Overview'
        };

        vm.animationsEnabled = true;

        // User Interaction
        // --------------
        vm.$$ix = {
            deleteUser : deleteUserModal
        };

        function getUser() {
            var params = {
                id : $stateParams.id
            };
            return vm.getData =  detailUsersFactory
                    .query(
                        params,
                        getDetailUserSuccess,
                        getDetailUserError);
        }

        function getDetailUserError(reason) {
            $log.error('getUsersError:', reason);
        }

        function getDetailUserSuccess(response, responseHeader) {
            vm.data = response;
            console.log(vm.data)
        }

        // Show delete modal popup
        // -----
        function deleteUserModal() {
            var deleteUserModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteUserModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteUserModal.dismiss('cancel');
            };
            vm.$$ix.deleteUserDefinitive = function ($id) {
                deleteUserModal.close(true);
                console.log($id);

                var deleteUserDefinitive = deleteUserFactory.hardDelete(vm.data.user.id);

                $q.all(deleteUserDefinitive).then(function success(data){
                    $window.location.href = '/admin/users';
                });
            };
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminusers')
        .controller('AdminUsersOverviewController', AdminUsersOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AdminUsersOverviewController.$inject = [
        // Angular
        '$log',

        //Custom
        'getAdminUsersFactory',
        'config'
    ];

    function AdminUsersOverviewController(
        // Angular
        $log,

        //Custom
        getAdminUsersFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getUsers();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Users Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
        };

        function getUsers() {
            var params = {};
            return vm.getData =  getAdminUsersFactory
                    .query(
                        params,
                        getUsersSuccess,
                        getUsersError);
        }

        function getUsersError(reason) {
            $log.error('getUsersError:', reason);
        }

        function getUsersSuccess(response, responseHeader) {
            console.log(response);
            vm.users = response.users;
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.adminusers')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/admin/users', {
                url: '/admin/users',
                views: {
                    main: {
                        controller: 'AdminUsersOverviewController as vm',
                        templateUrl: getView('admin/users/users')
                    }
                }
            })
            .state('/admin/users/detail/:id', {
            url: '/admin/users/detail/:id',
            views: {
                main: {
                    controller: 'AdminUsersDetailController as vm',
                    templateUrl: getView('admin/users/detail')
                }
            }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.account')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/account', {
                url: '/account',
                views: {
                    main: {
                        controller: 'AccountOverviewController as vm',
                        templateUrl: getView('account/account')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.account')
        .controller('AccountOverviewController', AccountOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    AccountOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        'config',
        '$q',
        '$uibModal',
        '$window',

        // Custom
        'GetAccountFactory',
        'accountFactory'
    ];

    function AccountOverviewController(
        // Angular
        $log,
        $scope,
        config,
        $q,
        $uibModal,
        $window,

        // Custom
        GetAccountFactory,
        accountFactory
    ) {
        // ViewModel
        // =========
        var vm = this;
        
        getAccount();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Account Details',
            subtitle: 'Overview of records!'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            confirm     : changePassword
        };

        vm.animationsEnabled = true;

        vm.data = {};
        
        function getAccount() {
            var params = {};

            return vm.user = accountFactory.query(params, getAccountSuccess, getAccountError);
            // var account = GetAccountFactory.getAccount();
            //
            // $q.all(account).then(function success(data){
            //     console.log('q', data);
            // });
        }

        function getAccountError(reason) {

        }

        function getAccountSuccess(response, responseHeader) {
            vm.user = response.user;
        }

        function changePassword() {
            if(vm.form.$valid){
                console.log(vm.data);

                var updateAccount = GetAccountFactory.changePass(vm.data);

                $q.all(updateAccount).then(function success(data){
                    console.log('check');
                    confirmModal();
                });
            }
        }

        // Show delete modal popup
        // -----
        function confirmModal() {
            var confirmModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'confirmModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                confirmModal.dismiss('cancel');
                $window.location.href = '/account';
            };
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .controller('FlightsCreateController', FlightsCreateController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    FlightsCreateController.$inject = [
        // Angular
        '$log',
        '$state',
        '$location',
        '$filter',
        'config',
        '$scope',
        '$q',
        '$uibModal',
        '$window',
        '$http',

        //Custom
        'createFlightsFactory',
        'getFlightsFactory'
    ];

    function FlightsCreateController(
        // Angular
        $log,
        $state,
        $location,
        $filter,
        config,
        $scope,
        $q,
        $uibModal,
        $window,
        $http,

        //Custom
        createFlightsFactory,
        getFlightsFactory
    ) {
        //console.log('FlightsCreateController');
        // ViewModel
        // =========
        var vm = this;

        // User Interaction
        // --------------
        vm.$$ix = {
            next        : createFlight,
            confirm     : showModal,
            airline     : airlineSelected,
            airport     : airportSelected
        };

        getFlights();
        getAirlines();
        getAirports();

        vm.animationsEnabled = true;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Create a flight',
            subtitle: 'Select your airline, airport, flight number and date.'
        };

        // Data
        // ----
        // vm.flight
        vm.flight = {};
        vm.userFlights = {};
        vm.data = {};
        vm.airlines = {};
        vm.airports = {};
        vm.flight.airline = {};
        vm.flight.airport = {};
        vm.existingFlightDetailId = {};

        vm.flight.today = new Date();
        vm.flight.setToday = new Date();


        // Functions
        // =========

        // Angular autocomplete
        // -----
        function getAirlines() {
            $http.get('../json/airlines_clean.json')
                .then(function(data){
                    vm.airlines = data.data.airlines;
                    // console.log('airlines,', data.data.airlines);
                });
        }

        function airlineSelected(selected) {
            if (selected) {
                console.log(selected);
                vm.flight.airline = selected.description.iata;
            } else {
                console.log('cleared');
            }
        }

        // vm.localSearch = function(str) {
        //     console.log('localSearch');
        //     var matches = [];
        //     vm.airlines.forEach(function(airline) {
        //         var fullName = airline.name;
        //         matches.push(fullName);
        //     });
        //     return matches;
        // };

        function getAirports() {
            $http.get('../json/airports_clean.json')
                .then(function(data){
                    vm.airports = data.data.airports;
                    // console.log('airports,', data.data.airports);
                });
        }

        function airportSelected(selected) {
            if (selected) {
                console.log(selected);
                vm.flight.airport = selected.description.iata;
            } else {
                console.log('cleared');
            }
        }

        // Show popup
        // -----
        function showModal() {


            if($scope.form.$valid) {

                vm.ArrayToCheckFlightData = [];
                vm.checkCurrentFlight = [];

                var check = $.ajax({
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    '' + vm.flight.airline + '/' +
                    '' + vm.flight.number + '/dep/' +
                    '' + $filter('date')(vm.flight.today, 'yyyy/MM/dd') + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '&airport=' + vm.flight.airport + '',
                    dataType: 'jsonp',
                    crossDomain: true,
                    success: function(data) {
                        //console.log('data:', data);
                        vm.checkCurrentFlight.push(data);
                    }
                });

                //console.log(result);
                vm.ArrayToCheckFlightData.push(check);
                $q.all(vm.ArrayToCheckFlightData).then(function success(data){
                    console.log('vm.checkCurrentFlight: ', vm.checkCurrentFlight);


                    if ( vm.checkCurrentFlight[0].error || vm.checkCurrentFlight[0].flightStatuses[0] == null ) {
                        var alertFlightModal = $uibModal.open({
                            animation: vm.animationsEnabled,
                            templateUrl: 'errorModal.html',
                            scope: $scope
                        });
                        vm.$$ix.again = function () {
                            alertFlightModal.dismiss('cancel');
                        };
                    } else {

                        vm.flight.departureCode = vm.checkCurrentFlight[0].flightStatuses[0].departureAirportFsCode;
                        vm.flight.arrivalCode = vm.checkCurrentFlight[0].flightStatuses[0].arrivalAirportFsCode;

                        vm.allAirports = [];
                        vm.allAirports = vm.checkCurrentFlight[0].appendix.airports;

                        vm.departureAirport = [];
                        vm.arrivalAirport = [];

                        angular.forEach(vm.allAirports, function(airport, key) {
                            //console.log(key, airport);
                            if ( airport.iata == vm.flight.departureCode ) {
                                vm.departureAirport = airport;
                                //console.log('Start: ', vm.departureAirport);
                            }
                            else if ( airport.iata == vm.flight.arrivalCode ) {
                                vm.arrivalAirport = airport;
                                //console.log('End: ', vm.arrivalAirport);
                            }
                        });


                        var checkFlightModal = $uibModal.open({
                            animation: vm.animationsEnabled,
                            templateUrl: 'confirmModal.html',
                            scope: $scope
                        });
                        vm.$$ix.cancel = function () {
                            checkFlightModal.dismiss('cancel');
                        };
                        vm.$$ix.add = function () {
                            checkFlightModal.close(true);
                            createFlight();
                        };
                    }
                }, function failure(err){
                });
            }
        }

        // Get already added flights
        // -----
        function getFlights() {
            var params = {};
            return getFlightsFactory
                .query(
                    params,
                    getFlightsSuccess,
                    getFlightsError);
        }

        function getFlightsError(reason) {
            //$log.error('getFlightsError:', reason);
        }
        function getFlightsSuccess(response) {
            //$log.success('getFlightsSuccess:', response);
            vm.userFlights = response[0].flights;
            console.log('vm.userFlights: ', vm.userFlights);
        }


        // Create Flight
        // -----
        function createFlight() {
            console.log('createFlight: ', vm.checkCurrentFlight);
            vm.flight.flightId = vm.checkCurrentFlight[0].flightStatuses[0].flightId;
            vm.flight.date = $filter('date')(vm.flight.today, 'yyyy/MM/dd');
            console.log('vm.flight: ', vm.flight);

            vm.flightIdArray = [];

            var checkDuplicate = false;

            angular.forEach(vm.userFlights,function(flight,key){

                vm.flightIdArray.push(flight);

                if (vm.flight.flightId == flight.flightId) {
                    console.log('DUPLICATE: ', vm.flight.flightId, flight.flightId);

                    var duplicateFlightModal = $uibModal.open({
                        animation: vm.animationsEnabled,
                        templateUrl: 'duplicateModal.html',
                        scope: $scope
                    });
                    vm.$$ix.cancel = function () {
                        duplicateFlightModal.dismiss('cancel');
                    };

                    vm.$$ix.detail = function () {
                        console.log('existingFlightDetailId: ', flight.flightId);
                        duplicateFlightModal.dismiss('Go to detail: ', flight.flightId);
                    };

                    checkDuplicate = true;
                }
            });

            if(checkDuplicate == true){
                console.log('checkDuplicate = true!');
            }else {
                console.log('checkDuplicate = false!');
                createFlightsFactory.createFlight(vm.flight);
            }
        }


        // Go Back
        // -----
        vm.go = function ( path ) {
            $location.path( path );
        };
    }

})();

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
        '$stateParams',
        '$window',
        '$http',
        '$filter',
        '$uibModal',
        '$q',

        //Custom
        'detailFlightsFactory',
        'deleteFlightsFactory',
        'createTripsFactory',
        'getTripsFactory',
        'deleteTripsFactory'
    ];

    function FlightsDetailController(
        // Angular
        $log,
        $scope,
        $state,
        $stateParams,
        $window,
        $http,
        $filter,
        $uibModal,
        $q,

        //Custom
        detailFlightsFactory,
        deleteFlightsFactory,
        createTripsFactory,
        getTripsFactory,
        deleteTripsFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        getDetailFlight();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flight Detail',
            subtitle: 'Detail flight!'
        };

        vm.flight = {};
        vm.trip = {};

        vm.weather = [
            {name:'Clear', icon:'wi-day-sunny'},
            {name:'Rain', icon:'wi-rain'},
            {name:'Mist', icon:'wi-day-fog'},
            {name:'Clouds', icon:'wi-cloudy'},
            {name:'Atmosphere', icon:'wi-fog'},
            {name:'Snow', icon:'wi-snow'},
            {name:'Drizzle', icon:'wi-showers'},
            {name:'Thunderstorm', icon:'wi-thunderstorm'},
            {name:'Extreme', icon:'wi-hurricane'},
            {name:'Haze', icon:'wi-day-haze'}
        ];

        vm.checkIfTrip = null;

        // User Interaction
        // --------------
        vm.$$ix = {
            refresh: refresh,
            delete: deleteModal,
            favorite: addToTrips,
            removefavorite: deleteFromTripsModal,
            convert: convertMins,
            convertToCel: convertToCel,
            convertToFah: convertToFah
        };

        vm.animationsEnabled = true;

        // Functions
        // --------------
        function refresh() {
            console.log('refresh');
            $window.location.reload();
        }

        function convertMins(minutes) {
            var hours = Math.floor( minutes / 60);
            var mins = minutes % 60;
            var time = hours + 'h' + mins + 'm';
            return time;
        }

        function convertToCel(temperature) {
            var cel = temperature - 273.15;
            return cel;
        }

        function convertToFah(temperature) {
            var fah = (temperature - 273.15) * 9.0 / 5.0 + 32;
            return fah;
        }

        function getDetailFlight() {
            // console.log('getDetailFlight');
            var params = {
                airline : $stateParams.airline,
                number  : $stateParams.number
            };

            return vm.getData = detailFlightsFactory.query(params, getDetailFlightSuccess, getDetailFlightError);
        }

        function getDetailFlightError(reason) {
            $log.error('getDetailFlightError:', reason);
        }
        function getDetailFlightSuccess(response, responseHeader) {
            // vm.data = response[0];
            // console.log('succes: ', response);
            vm.flight.databaseflight = response.dbflight[0];
            vm.flight.apiflight = response.apiflight;
            vm.flight.apiDepAirport = response.apiDepAirport;
            vm.flight.apiArrAirport = response.apiArrAirport;
            vm.flight.apischeduleflight = response.apischeduleflight;
            vm.flight.apiDepWeather = response.apiDepWeather;
            vm.flight.apiArrWeather = response.apiArrWeather;

            // var depWeatherCondition = $filter('filter')(response.apiDepWeather.weather[0].main, {key: 'Prevailing Conditions'}, true);
            var depWeatherValue = $filter('filter')(vm.weather, {name: response.apiDepWeather.weather[0].main}, true);
            if(depWeatherValue.length > 0) {
                vm.flight.depWeatherIcon = depWeatherValue[0].icon;
            }else {
                vm.flight.depWeatherIcon = 'wi-day-sunny';
            }

            // var arrWeatherCondition = $filter('filter')(response.apiArrWeather.metar.tags, {key: 'Prevailing Conditions'}, true);
            var arrWeatherValue = $filter('filter')(vm.weather, {name: response.apiArrWeather.weather[0].main}, true);
            vm.flight.arrWeatherIcon = arrWeatherValue[0].icon;
            if(arrWeatherValue.length > 0) {
                vm.flight.arrWeatherIcon = arrWeatherValue[0].icon;
            }else {
                vm.flight.arrWeatherIcon = 'wi-day-sunny';
            }


            console.log(vm.flight);
            getTrips();
        }

        function addToTrips() {
            // console.log('createTrip');
            // console.log('vm.trip to add: ', vm.flight.databaseflight.arrival);

            vm.tripIdArray = [];
            var checkDuplicate = false;

            angular.forEach(vm.userTrips,function(trip,key){
            
                vm.tripIdArray.push(trip);
            
                if (vm.flight.databaseflight.arrival == trip.airport) {
                    // console.log('DUPLICATE: ', vm.flight.databaseflight.arrival, trip.airport);
            
                    var duplicateTripModal = $uibModal.open({
                        animation: vm.animationsEnabled,
                        templateUrl: 'duplicateModal.html',
                        scope: $scope
                    });
                    vm.$$ix.cancel = function () {
                        duplicateTripModal.dismiss('cancel');
                    };
                    
                    vm.$$ix.detail = function () {
                        // console.log('existingTripDetailId: ', trip.id);
                        duplicateTripModal.dismiss('Go to detail: ', trip.id);
                    };
                    checkDuplicate = true;
                }
            });
            
            if(checkDuplicate == true){
            }else {
                vm.trip.airport = vm.flight.databaseflight.arrival;
                var createTrips = createTripsFactory.createTrip(vm.trip);

                $q.all(createTrips).then(function success(data){
                    vm.checkIfTrip = true;
                });

                var addedToTripsModal = $uibModal.open({
                    animation: vm.animationsEnabled,
                    templateUrl: 'addedToTripsModal.html',
                    scope: $scope
                });
                vm.$$ix.cancel = function () {
                    addedToTripsModal.dismiss('cancel');
                    getTrips();
                };
            }
        }
        
        function removeFromTrips($airport) {
            var searchTrip = $filter('filter')(vm.userTrips, {airport: $airport}, true);
            var deleteTrip = deleteTripsFactory.deleteTrip(searchTrip[0].id);

            $q.all(deleteTrip).then(function success(data){
                getTrips();
            });
        }

        // Get already added trips
        // -----
        function getTrips() {
            console.log('getTrips');
            var params = {};
            return getTripsFactory
                .query(
                    params,
                    getTripsSuccess,
                    getTripsError);
        }

        function getTripsError(reason) {
            //$log.error('getTripsError:', reason);
        }
        function getTripsSuccess(response) {
            vm.userTrips = response[0].trips;

            var checkIfTrip = $filter('filter')(vm.userTrips, {airport: vm.flight.databaseflight.arrival}, true);

            $q.all(checkIfTrip).then(function success(data){
                if(checkIfTrip.length > 0) {
                    vm.checkIfTrip = true;
                }else {
                    vm.checkIfTrip = false;
                }
            });
        }


        // Show delete modal popup
        // -----
        function deleteModal() {
            var deleteFlightModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteFlightModal.dismiss('cancel');
            };
            vm.$$ix.deleteFlight = function ($id) {
                deleteFlightModal.close(true);

                var deleteFlight = deleteFlightsFactory.deleteFlight($id);

                $q.all(deleteFlight).then(function success(data){
                    $window.location.href = '/flights';
                });
            };
        }

        function deleteFromTripsModal() {
            var deleteTripModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteFromTripsModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteTripModal.dismiss('cancel');
            };
            vm.$$ix.deleteTrip = function ($airport) {
                vm.checkIfTrip = false;
                console.log(vm.checkIfTrip);
                deleteTripModal.close(true);
                console.log($airport);
                removeFromTrips($airport);
            };
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/flights', {
                url: '/flights',
                views: {
                    main: {
                        controller: 'FlightsOverviewController as vm',
                        templateUrl: getView('flights/flights')
                    }
                }
            })
            .state('/flights/create', {
                url: '/flights/create',
                views: {
                    main: {
                        controller: 'FlightsCreateController as vm',
                        templateUrl: getView('flights/create')
                    }
                }
            })
            .state('/flights/detail/:airline/:number', {
                url: '/flights/detail/:airline/:number',
                views: {
                    main: {
                        controller: 'FlightsDetailController as vm',
                        templateUrl: getView('flights/detail')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.flights')
        .controller('FlightsOverviewController', FlightsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    FlightsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',
        '$uibModal',

        //Custom
        'getFlightsFactory',
        'deleteFlightsFactory',
        'config'
    ];

    function FlightsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,
        $uibModal,

        //Custom
        getFlightsFactory,
        deleteFlightsFactory,
        // scheduleFlightAPIFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getFlights();
        
        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flights Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            delete: deleteFlight
        };

        function getFlights() {
            var params = {};
            return getFlightsFactory
                    .query(
                        params,
                        getFlightsSuccess,
                        getFlightsError);
        }

        function getFlightsError(reason) {
            $log.error('getFlightsError:', reason);
        }
        function getFlightsSuccess(response, responseHeader) {
            // $log.success('getFlightsSuccess:', response);
            vm.data = response[0];

            getSchedules();
        }

        function getSchedules() {

            // console.log('vm.data: ', vm.data);

            //Test array
            vm.allFlightsData = [];
            //Array to save flight from database
            vm.flights = [];

            //Foreach to get API information for each flight from the user in the database
            angular.forEach(vm.data.flights,function(flight,key){

                var result = $.ajax({
                    url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                    '' + flight.flightId + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                }).then (function successCallback (data, status, headers, config){
                        //Empty array to make sure it's empty
                        vm.currentFlightData = null;
                        //Array to save API + database info for 1 flight
                        vm.currentFlightData = {};
                        //Store API data
                        vm.currentFlightData.allData = data;
                        //Store database id to go later to the details view
                        vm.currentFlightData.database = flight;
                        //Push array with 1 flight to array with multiple flights
                        vm.flights.push(vm.currentFlightData);
                        // console.log('vm.currentFlightData: ', vm.currentFlightData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                //Fill test array to make sure for each went well!
                //Use this name for next $q.all
                //console.log('check 1');
                vm.allFlightsData.push(result);
            });

            return vm.getData = $q.all(vm.allFlightsData).then(function success(data){
                console.log('vm.flights: ', vm.flights); // Should all be here


                //Test array
                vm.checkForEachQAll = [];
                //Array to store other arrays with checked flight information
                vm.allCheckedFlights = [];


                //For each flight of the user in the database get the correct information
                //Especially for the departure and arrival airport
                angular.forEach(vm.flights,function(flight,key){

                    if (flight.allData.error) {
                        console.log('404 remove flight: ', flight.database.id);
                        deleteFlightsFactory.deleteOutdatedFlight(flight.database.id);
                    }
                    else {
                        // console.log('found flight');

                        //Get current departure and arrival code of flight
                        //ex. BRU, JFK
                        var depCode = null;
                        var arrCode = null;
                        depCode = flight.allData.flightStatus.departureAirportFsCode;
                        //console.log('depCode:', key, depCode);
                        arrCode = flight.allData.flightStatus.arrivalAirportFsCode;
                        //console.log('arrCode:', key, arrCode);
                        //++++

                        //Get all the airports of the current flight
                        //Connected flight can have multiple airports
                        //other than the departure and arrival
                        vm.allAirports = null;
                        vm.allAirports = [];
                        vm.allAirports = flight.allData.appendix.airports;
                        //console.log('vm.allAirports:', vm.allAirports);
                        //++++

                        //Test array
                        //vm.foreachCheckDataAirport = null;
                        vm.foreachCheckDataAirport = [];

                        //Temporary arrays
                        vm.tempDepartureAirport = null;
                        vm.tempDepartureAirport = {};
                        //console.log('vm.tempDepartureAirport:', vm.tempDepartureAirport);
                        vm.tempArrivalAirport = null;
                        vm.tempArrivalAirport = {};
                        //console.log('vm.tempArrivalAirport:', vm.tempArrivalAirport);


                        //Loop to each airport of current flight and check if the
                        //departure and arrival airports correspond, then push info
                        //to correct place in array checkThisFlight
                        angular.forEach(vm.allAirports, function(airport, key) {
                            //console.log(key, airport);

                            //Check if correspond with departureCode
                            if ( airport.iata == depCode ) {
                                vm.tempDepartureAirport = airport;
                                //console.log('tempDepartureAirport: ', vm.tempDepartureAirport);
                                //vm.checkThisFlight.departureAirport = vm.tempDepartureAirport;
                            }
                            //Check if correspond with arrivalCode
                            else if ( airport.iata == arrCode ) {
                                vm.tempArrivalAirport = airport;
                                //console.log('tempArrivalAirport: ', vm.tempArrivalAirport);
                                //vm.checkThisFlight.arrivalAirport = vm.tempArrivalAirport;
                            }

                            //console.log('vm.tempDepartureAirport:', key, vm.tempDepartureAirport);
                            //console.log('vm.tempArrivalAirport:', key, vm.tempArrivalAirport);

                            //Fill test array to make sure for each went well!
                            //Use this name for next $q.all
                            //console.log('check 2 = airport check');
                            //vm.foreachCheckDataAirport.push(airport);
                        });
                        //$q.all(vm.foreachCheckDataAirport).then(function success(data) {
                        //
                        //}, function failure(err){
                        //    // Can handle this is we want
                        //});

                        //console.log('should be after check 2');
                        //Array to store all information to push to the complete array
                        //In this array:
                        // - all flight information about this flight:  'allFlightDetails'
                        // - departure airport with its information     'departureAirport'
                        // - arrival airport with its information       'arrivalAirport'
                        vm.checkThisFlight = null;
                        vm.checkThisFlight = {};

                        vm.checkThisFlight.departureAirport     = null;
                        vm.checkThisFlight.arrivalAirport       = null;
                        vm.checkThisFlight.allFlightDetails     = null;
                        vm.checkThisFlight.databaseFlight       = null;

                        //Place all current flight information in allFlightDetails
                        vm.checkThisFlight.departureAirport     = vm.tempDepartureAirport;
                        vm.checkThisFlight.arrivalAirport       = vm.tempArrivalAirport;
                        vm.checkThisFlight.allFlightDetails     = flight.allData;
                        vm.checkThisFlight.databaseFlight       = flight;

                        //Push current checkThisFlight to allCheckedFlights
                        //console.log('before push tot allCheckedFlights', vm.checkThisFlight);
                        vm.allCheckedFlights.push(vm.checkThisFlight);
                        //console.log('Test checkThisFlight (ONLY 2 TIMES)', key, vm.allCheckedFlights);

                        //Fill test array to make sure for each went well!
                        //Use this name for next $q.all
                        //console.log('check 3');
                        vm.checkForEachQAll.push(flight);
                    }
                });

                $q.all(vm.checkForEachQAll).then(function success(data) {
                    //console.log('allCheckedFlights out for each: ', vm.allCheckedFlights)
                    angular.forEach(vm.allCheckedFlights, function(flight, key) {
                       console.log(key, flight);
                    });
                }, function failure(err){
                    // Can handle this is we want
                });

                //console.log($scope.data);
            }, function failure(err){
                // Can handle this is we want
            });

        }

        function getCorrectData () {
          console.log('getCorrectData: ', vm.flights)
        }

        function getSchedulesError(reason) {
            $log.error('getSchedulesError:', reason);
        }

        function getSchedulesSuccess(reason) {
            $log.error('getSchedulesSuccess:', reason);
        }


        function deleteFlight($id) {

            var deleteFlightModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteFlightModal.dismiss('cancel');
            };
            vm.$$ix.deleteFlight = function () {
                deleteFlightModal.close(true);
                console.log($id);
                deleteFlightsFactory.deleteFlight($id);
            };
            //
            // console.log('deleteFlight: ', $id);
            // deleteFlightsFactory.deleteFlight($id);
        }

    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.home')
        .controller('HomeController', HomeController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HomeController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$route',
        '$rootScope',

        // Custom
        'GetAccountFactory'
    ];

    function HomeController(
        // Angular
        $log,
        $scope,
        $route,
        $rootScope,

        // Custom
        GetAccountFactory
    ) {
        // ViewModel
        // =========
        var vm = this;
        //$scope.accountApi = $rootScope.ownAPI + 'account';

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Home'
        };

        //vm.user = GetAccountFactory.getAccount($scope);
        //
        //vm.reloadRoute = function() {
        //    $route.reload();
        //    console.log('reload!')
        //}
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.home')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/landing', {
                url: '/home',
                views: {
                    main: {
                        controller: 'HomeController as vm',
                        templateUrl: getView('home/home')
                    }
                }
            })
            .state('/', {
                url: '/',
                views: {
                    main: {
                        controller: 'HomeController as vm',
                        templateUrl: getView('home/home')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsCreateController', TripsCreateController)
        .directive('preventEnterSubmit', function () {
            return function (scope, el, attrs) {
                console.log('enter');
                el.bind('keydown', function (event) {
                    if (13 == event.which) {
                        event.preventDefault(); // Doesn't work at all
                        window.stop(); // Works in all browsers but IE...
                        document.execCommand('Stop'); // Works in IE
                        return false; // Don't even know why it's here. Does nothing.
                    }
                });
            };
        });

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsCreateController.$inject = [
        // Angular
        '$log',
        '$state',
        '$location',
        '$filter',
        'config',
        '$scope',
        '$q',
        '$uibModal',
        '$window',
        '$http',

        //Custom
        'createTripsFactory',
        'getTripsFactory'
    ];

    function TripsCreateController(
        // Angular
        $log,
        $state,
        $location,
        $filter,
        config,
        $scope,
        $q,
        $uibModal,
        $window,
        $http,

        //Custom
        createTripsFactory,
        getTripsFactory

    ) {
        // ViewModel
        // =========
        var vm = this;

        // User Interaction
        // --------------
        vm.$$ix = {
            next        : createTrip,
            airport     : airportSelected
        };

        getTrips();
        getAirports();

        vm.animationsEnabled = true;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Create a trip',
            subtitle: 'Select your airport and get information about your destination.'
        };

        // Data
        // ----
        // vm.trip
        vm.trip = {};
        vm.airports = {};
        vm.trip.airport = {};
        vm.existingTripDetailId = {};


        // Functions
        // =========

        // Angular autocomplete
        // -----
        function getAirports() {
            $http.get('../json/airports_clean.json')
                .then(function(data){
                    vm.airports = data.data.airports;
                    // console.log('airports,', data.data.airports);
                });
        }
        function airportSelected(selected) {
            if (selected) {
                console.log(selected);
                vm.trip.airport = selected.description.iata;
            } else {
                console.log('cleared');
            }
        }

        // Show popup
        // -----


        // Get already added trips
        // -----
        function getTrips() {
            var params = {};
            return getTripsFactory
                .query(
                    params,
                    getTripsSuccess,
                    getTripsError);
        }

        function getTripsError(reason) {
            //$log.error('getTripsError:', reason);
        }
        function getTripsSuccess(response) {
            //$log.success('getTripsSuccess:', response);
            vm.userTrips = response[0].trips;
            console.log('vm.userTrips: ', vm.userTrips);
        }

        // Create Trip
        // -----
        function createTrip() {
            console.log('createTrip');
            console.log('vm.trip: ', vm.trip);

            vm.tripIdArray = [];
            var checkDuplicate = false;

            angular.forEach(vm.userTrips,function(trip,key){

                vm.tripIdArray.push(trip);

                if (vm.trip.airport == trip.airport) {
                    console.log('DUPLICATE: ', vm.trip.airport, trip.airport);

                    var duplicateTripModal = $uibModal.open({
                        animation: vm.animationsEnabled,
                        templateUrl: 'duplicateModal.html',
                        scope: $scope
                    });
                    vm.$$ix.cancel = function () {
                        duplicateTripModal.dismiss('cancel');
                    };

                    vm.$$ix.detail = function () {
                        console.log('existingTripDetailId: ', trip.id);
                        duplicateTripModal.dismiss('Go to detail: ', trip.id);
                        $window.location.href = '/trips/detail/' + vm.trip.airport;
                    };
                    checkDuplicate = true;
                }
            });

            if(checkDuplicate == true){
                console.log('checkDuplicate = true!');
            }else {
                console.log('checkDuplicate = false!');
                var createTrips = createTripsFactory.createTrip(vm.trip);

                $q.all(createTrips).then(function success(data){
                    $window.location.href = '/trips/detail/' + vm.trip.airport;
                });
            }
        }

        // Go Back
        // -----
        vm.go = function ( path ) {
            $location.path( path );
        };
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsDetailController', TripsDetailController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsDetailController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$stateParams',
        '$window',
        '$http',
        '$filter',
        '$uibModal',
        '$q',

        //Custom
        'detailTripsFactory',
        'deleteTripsFactory'
    ];

    function TripsDetailController(
        // Angular
        $log,
        $scope,
        $state,
        $stateParams,
        $window,
        $http,
        $filter,
        $uibModal,
        $q,

        //Custom
        detailTripsFactory,
        deleteTripsFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        getDetailTrip();
        getCurrency();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Trip Detail',
            subtitle: 'Detail trip!'
        };

        vm.trip = {};

        vm.weather = [
            {name:'Clear', icon:'wi-day-sunny'},
            {name:'Rain', icon:'wi-rain'},
            {name:'Clouds', icon:'wi-cloudy'},
            {name:'Atmosphere', icon:'wi-fog'},
            {name:'Snow', icon:'wi-snow'},
            {name:'Drizzle', icon:'wi-showers'},
            {name:'Thunderstorm', icon:'wi-thunderstorm'},
            {name:'Extreme', icon:'wi-hurricane'}
        ];

        // User Interaction
        // --------------
        vm.$$ix = {
            refresh: refresh,
            delete: deleteModal,
            // addToTrips: addToTrips,
            convert: convertMins,
            convertToCel: convertToCel,
            convertToFah: convertToFah,
            convertValuta: convertValuta,
            reverseValuta: reverseValuta
            // currencySecond: currencySecondSelected
        };
        
        vm.animationsEnabled = true;
        vm.currency = {};
        vm.currency.selectFirst = '';
        vm.currency.selectSecond = '';

        // Functions
        // --------------
        function refresh() {
            console.log('refresh');
            $window.location.reload();
        }

        function deleteTrip($id) {
            console.log('deleteTrip: ', $id);

            var deleteTrip = deleteTripsFactory.deleteTrip($id);

            $q.all(deleteTrip).then(function success(data){
                $window.location.href = '/trips';
            });
        }

        function getCurrency() {
            $http.get('../json/currency2.json')
                .then(function(data){
                    vm.trip.currency = data.data;
                });
        }

        function reverseValuta() {
            if(vm.currency.selectFirst && vm.currency.selectSecond ) {
                var oldFirst = vm.currency.selectFirst.code;
                var oldSecond = vm.currency.selectSecond.code;

                vm.currency.selectFirst.code = oldSecond;
                vm.currency.selectSecond.code = oldFirst;

                convertValuta();
            }
        }

        function convertValuta() {
            if(vm.currency.selectFirst && vm.currency.selectSecond ) {

                vm.currencyArray = [];

                var check = $.ajax({
                    url: "https://api.fixer.io/latest",
                    dataType: 'jsonp',
                    crossDomain: true,
                    success: function(data) {
                        // console.log('data', data);
                    }
                });
                vm.currencyArray.push(check);

                $q.all(vm.currencyArray).then(function success(data){
                    fx.rates = data[0].rates;
                    // console.log(fx.rates);
                    // console.log(vm.currency.selectFirst.code, vm.currency.selectSecond.code);

                    if(vm.currency.selectFirst.code == "EUR" && vm.currency.selectSecond.code != "EUR"){
                        var rate = fx(1).to(vm.currency.selectSecond.code);
                        vm.currency.currencyChanged = rate.toFixed(2);
                    }else if(vm.currency.selectSecond.code == "EUR" && vm.currency.selectFirst.code != "EUR"){
                        var rate2 = fx(1).to(vm.currency.selectFirst.code);
                        vm.currency.currencyChanged = (1 / rate2).toFixed(2);
                    }else if(vm.currency.selectFirst.code === vm.currency.selectSecond.code){
                        vm.currency.currencyChanged = (1.00).toFixed(2);
                    }
                    else {
                        var rate3= fx(1).from(vm.currency.selectFirst.code).to(vm.currency.selectSecond.code);
                        vm.currency.currencyChanged = rate3.toFixed(2);
                    }
                });
            }
        }

        function convertMins(minutes) {
            var hours = Math.floor( minutes / 60);
            var mins = minutes % 60;
            var time = hours + 'h' + mins + 'm';
            return time;
        }

        function convertToCel(temperature) {
            var cel = temperature - 273.15;
            return cel;
        }

        function convertToFah(temperature) {
            var fah = (temperature - 273.15) * 9.0 / 5.0 + 32;
            return fah;
        }

        var toUTCDate = function(date){
            var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        };

        var millisToUTCDate = function(millis){
            return toUTCDate(new Date(millis));
        };

        function getDetailTrip() {
            var params = {
                trip_airport : $stateParams.airport
            };

            return vm.getData = detailTripsFactory.query(params, getDetailTripSuccess, getDetailTripError);
        }

        function getDetailTripError(reason) {
            $log.error('getDetailFlightError:', reason);
        }
        function getDetailTripSuccess(response, responseHeader) {
            // vm.data = response;
            // console.log('succes: ', response);
            vm.trip.databasetrip = response.dbtrip;
            vm.trip.apitrip = response.apitrip;
            vm.trip.apiweather = response.apiweather;
            vm.trip.apiforecast = response.apiforecast;
            vm.trip.forecast = {};

            var weatherValue = $filter('filter')(vm.weather, {name: response.apiweather.weather[0].main}, true);
            vm.trip.weatherIcon = weatherValue[0].icon;

            var sunrise = (vm.trip.apiweather.sys.sunrise + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var sunset = (vm.trip.apiweather.sys.sunset + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            
            vm.trip.apiweather.sys.sunrise = sunrise;
            vm.trip.apiweather.sys.sunset = sunset;

            //FORECAST 1 DAY FUTURE
            vm.trip.forecast.day1 = {};
            vm.trip.forecast.day1.date = (vm.trip.apiforecast.list[1].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay1 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[1].weather[0].main}, true);
            vm.trip.forecast.day1.weatherIcon = weatherValueDay1[0].icon;
            vm.trip.forecast.day1.minTemp = convertToCel(vm.trip.apiforecast.list[1].temp.min);
            vm.trip.forecast.day1.maxTemp = convertToCel(vm.trip.apiforecast.list[1].temp.max);

            //FORECAST 2 DAY FUTURE
            vm.trip.forecast.day2 = {};
            vm.trip.forecast.day2.date = (vm.trip.apiforecast.list[2].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay2 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[2].weather[0].main}, true);
            vm.trip.forecast.day2.weatherIcon = weatherValueDay2[0].icon;
            vm.trip.forecast.day2.minTemp = convertToCel(vm.trip.apiforecast.list[2].temp.min);
            vm.trip.forecast.day2.maxTemp = convertToCel(vm.trip.apiforecast.list[2].temp.max);

            //FORECAST 3 DAY FUTURE
            vm.trip.forecast.day3 = {};
            vm.trip.forecast.day3.date = (vm.trip.apiforecast.list[3].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay3 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[3].weather[0].main}, true);
            vm.trip.forecast.day3.weatherIcon = weatherValueDay3[0].icon;
            vm.trip.forecast.day3.minTemp = convertToCel(vm.trip.apiforecast.list[3].temp.min);
            vm.trip.forecast.day3.maxTemp = convertToCel(vm.trip.apiforecast.list[3].temp.max);

            //FORECAST 4 DAY FUTURE
            vm.trip.forecast.day4 = {};
            vm.trip.forecast.day4.date = (vm.trip.apiforecast.list[4].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay4 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[4].weather[0].main}, true);
            vm.trip.forecast.day4.weatherIcon = weatherValueDay4[0].icon;
            vm.trip.forecast.day4.minTemp = convertToCel(vm.trip.apiforecast.list[4].temp.min);
            vm.trip.forecast.day4.maxTemp = convertToCel(vm.trip.apiforecast.list[4].temp.max);

            //FORECAST 5 DAY FUTURE
            vm.trip.forecast.day5 = {};
            vm.trip.forecast.day5.date = (vm.trip.apiforecast.list[5].dt + (vm.trip.apitrip.utcOffsetHours * 3600)) * 1000;
            var weatherValueDay5 = $filter('filter')(vm.weather, {name: vm.trip.apiforecast.list[5].weather[0].main}, true);
            vm.trip.forecast.day5.weatherIcon = weatherValueDay5[0].icon;
            vm.trip.forecast.day5.minTemp = convertToCel(vm.trip.apiforecast.list[5].temp.min);
            vm.trip.forecast.day5.maxTemp = convertToCel(vm.trip.apiforecast.list[5].temp.max);
            
            console.log(vm.trip);

        }


        vm.toUTCDate = toUTCDate;
        vm.millisToUTCDate = millisToUTCDate;

        // Show delete modal popup
        // -----
        function deleteModal() {
            console.log(vm.trip);
            var deleteTripModal = $uibModal.open({
                animation: vm.animationsEnabled,
                templateUrl: 'deleteModal.html',
                scope: $scope
            });
            vm.$$ix.cancel = function () {
                deleteTripModal.dismiss('cancel');
            };
            vm.$$ix.deleteTrip = function ($id) {
                deleteTripModal.close(true);
                console.log($id);
                deleteTrip($id);
            };
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .controller('TripsOverviewController', TripsOverviewController);

    // Inject dependencies into constructor (needed when JS minification is applied).
    TripsOverviewController.$inject = [
        // Angular
        '$log',
        '$scope',
        '$state',
        '$filter',
        '$q',

        //Custom
        'getTripsFactory',
        'deleteTripsFactory',
        'config'
    ];

    function TripsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,

        //Custom
        getTripsFactory,
        deleteTripsFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getTrips();

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Trips Overview'
        };

        // User Interaction
        // --------------
        vm.$$ix = {
            // delete: deleteTrip
        };

        //Array to stack all trip with api info
        // vm.trips = [];
        //Fake array to complete $q.all
        // vm.databaseTrips = {};

        function getTrips() {
            var params = {};
            return getTripsFactory
                .query(
                    params,
                    getTripsSuccess,
                    getTripsError);
        }

        function getTripsError(reason) {
            $log.error('getFlightsError:', reason);
        }
        function getTripsSuccess(response, responseHeader) {
            vm.databaseTrips = response[0];
            console.log('1: ', vm.databaseTrips);

            //Test array
            vm.allTripsData = [];
            //Array to save trips from database
            vm.trips = [];

            angular.forEach(vm.databaseTrips.trips,function(trip,key){

                console.log(trip);

                var result = $.ajax({
                    url: 'https://api.flightstats.com/flex/airports/rest/v1/jsonp/iata/' +
                    '' + trip.airport + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                }).then (function successCallback (data, status, headers, config){
                        //Empty array to make sure it's empty
                        vm.currentTripData = null;
                        //Array to save API + database info for 1 trip
                        vm.currentTripData = {};
                        //Store API data
                        vm.currentTripData.allData = data[0];
                        //Store database id to go later to the details view
                        vm.currentTripData.databaseId = trip.id;
                        vm.currentTripData.dbtrip = trip;

                        //Push array with 1 flight to array with multiple trips
                        vm.trips.push(vm.currentTripData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                vm.allTripsData.push(result);

            });

            return vm.getData = $q.all(vm.allTripsData).then(function success(data){
                console.log('[2]: ', vm.trips);
            });

            

            // var apiKey = 's48vh9gfa7bbya2cy53sbe8w';
            // $.ajax({
            //     type:'GET',
            //     // dataType: 'jsonp',
            //     // crossDomain: true,
            //     url:"https://api.gettyimages.com:443/v3/search/images/creative?orientations=Horizontal&page=1&page_size=1&phrase=london&sort_order=most_popular",
            //     beforeSend: function (request)
            //     {
            //         request.setRequestHeader("Api-Key", apiKey);
            //     }
            // }).then (function successCallback (data, status, headers, config){
            //         console.log('success: ', data)
            //     },
            //     function errorCallback (){
            //         console.log("data not sent to API, new object is not created");
            //     });

            // $.ajax(
            //     {
            //         type:'GET',
            //         url:"https://api.gettyimages.com:443/v3/search/images/creative?orientations=Horizontal&page=1&page_size=1&phrase=london&sort_order=most_popular",
            //         beforeSend: function (request)
            //         {
            //             request.setRequestHeader("Api-Key", apiKey);
            //
            //
            //         }})
            //     .done(function(data){
            //         console.log("Success with data", data)
            //
            //         $("#output").append("<img src='" + data.images[0].display_sizes[0].uri + "'/>");
            //     })
            //     .fail(function(data){
            //         alert(JSON.stringify(data,2))
            //     });
        }
    }

})();

/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () {
    'use strict';

    angular.module('app.trips')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider'
    ];

    function Routes(
        // Angular
        $stateProvider,
        $urlRouterProvider,
        $locationProvider
    ) {
        var getView = function( viewName ){
            return '/views/' + viewName + '.view.html';
        };

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/trips', {
                url: '/trips',
                views: {
                    main: {
                        controller: 'TripsOverviewController as vm',
                        templateUrl: getView('trips/trips')
                    }
                }
            })
            .state('/trips/create', {
                url: '/trips/create',
                views: {
                    main: {
                        controller: 'TripsCreateController as vm',
                        templateUrl: getView('trips/create')
                    }
                }
            })
            .state('/trips/detail/:airport', {
                url: '/trips/detail/:airport',
                views: {
                    main: {
                        controller: 'TripsDetailController as vm',
                        templateUrl: getView('trips/detail')
                    }
                }
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.adminflights')
        .factory('getAdminFlightsFactory', getAdminFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getAdminFlightsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getAdminFlightsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'admin/flights';

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
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('createFlightsFactory', createFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    createFlightsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function createFlightsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            createFlight : function(CreateFlight) {
                console.log('FlightFactory.createFlight');
                $http.post(config.api + 'flights',
                    {
                        'airline'   : CreateFlight.airline,
                        'number'    : CreateFlight.number,
                        'day'       : CreateFlight.date,
                        'flightId'  : CreateFlight.flightId,
                        'departure' : CreateFlight.departureCode,
                        'arrival'   : CreateFlight.arrivalCode
                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("data sent to API, new object created");
                            $window.location.href = '/flights';
                        },
                        function errorCallback (){
                            console.log("data not sent to API, new object is not created");
                        });
            }
        }
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('deleteFlightsFactory', deleteFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    deleteFlightsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function deleteFlightsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            deleteFlight : function(id) {
                console.log('deleteFlightsFactory.deleteFlight: ', id);
                $http.delete(config.api + 'flights/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get pivot flights: ", data);
                            // $window.location.href = '/flights';
                        },
                        function errorCallback (){
                            console.log("flight not deleted");
                        });
            },

            deleteOutdatedFlight : function(id) {
                console.log('deleteFlightsFactory.deleteOutdatedFlight: ', id);
                $http.delete(config.api + 'flights/outdated/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get oudated flights: ", data);
                            // $window.location.href = '/flights';
                        },
                        function errorCallback (){
                            console.log("flight not deleted");
                        });
            },
            hardDelete : function(id) {
            console.log('hardDelete.deleteFlight: ', id);
            $http.delete(config.api + 'admin/flights/delete/' + id)
                .then (function successCallback (data, status, headers, config){
                        console.log ("get pivot flights: ", data);
                    },
                    function errorCallback (){
                        console.log("flight not deleted");
                    });
            }
        }
    }

})();
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
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('getFlightsFactory', getFlightsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getFlightsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getFlightsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'flights';

        var paramDefaults = {
            
        };

        var actions = {
            'query' : {
                method : 'GET',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.flights')
        .factory('scheduleFlightAPIFactory', scheduleFlightAPIFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    scheduleFlightAPIFactory.$inject = [
        // Angular
        '$resource',
        'config',
        '$filter'
    ];

    function scheduleFlightAPIFactory(
        // Angular
        $resource,
        config,
        $filter
    ) {

        var vm = this;

        return {
            scheduleFlightAPI : function(ScheduleFlightAPI) {

                //BECAUSE FUCK CORS ORIGIN SHIT
                return $.ajax({
                    url: 'https://api.flightstats.com/flex/schedules/rest/v1/jsonp/flight/' +
                    '' + ScheduleFlightAPI.airline + '/' +
                    '' + ScheduleFlightAPI.number + '/departing/' +
                    '' + ScheduleFlightAPI.day + '?appId=' +
                    '' + config.appId + '&appKey=' +
                    '' + config.appKey + '',
                    dataType: 'jsonp',
                    crossDomain: true
                });
            },

            scheduleFlightAPI2 : function(ScheduleFlightAPI2) {

                console.log('Inside scheduleFlightAPI2: ', ScheduleFlightAPI2);

                vm.overview = [];

                return vm.overview = angular.forEach(ScheduleFlightAPI2, function(flight, key){
                    //BECAUSE FUCK CORS ORIGIN SHIT
                    vm.overview.push(
                        $.ajax({
                            url: 'https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/' +
                            '' + flight.airline + '/' +
                            '' + flight.number + '/dep/' +
                            '' + $filter('date')(flight.day, 'yyyy/MM/dd') + '?appId=' +
                            '' + config.appId + '&appKey=' +
                            '' + config.appKey + '',
                            dataType: 'jsonp',
                            crossDomain: true
                        })
                    );
                });
            }
        };
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('createTripsFactory', createTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    createTripsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function createTripsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            createTrip : function(CreateTrip) {
                console.log('TripFactory.createTrip');
                $http.post(config.api + 'trips',
                    {
                        'airport'   : CreateTrip.airport
                    })
                    .then (function successCallback (data, status, headers, config){
                            console.log ("data sent to API, new object created");
                            // $window.location.href = '/trips';
                        },
                        function errorCallback (){
                            console.log("data not sent to API, new object is not created");
                        });
            }
        }
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('deleteTripsFactory', deleteTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    deleteTripsFactory.$inject = [
        '$http',
        'config',
        '$state',
        '$window'
    ];

    function deleteTripsFactory(
        $http,
        config,
        $state,
        $window
    ) {
        return {

            deleteTrip : function(id) {
                console.log('deleteTripsFactory.deleteTrip: ', id);
                $http.delete(config.api + 'trips/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get pivot trips: ", data);
                        },
                        function errorCallback (){
                            console.log("trips not deleted");
                        });
            },
            hardDelete : function(id) {
                console.log('hardDelete.deleteTrip: ', id);
                $http.delete(config.api + 'admin/trips/delete/' + id)
                    .then (function successCallback (data, status, headers, config){
                            console.log ("get pivot trips: ", data);
                        },
                        function errorCallback (){
                            console.log("trips not deleted");
                        });
            }
        }
    }

})();
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('detailTripsFactory', detailTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    detailTripsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function detailTripsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'trips/detail/:trip_airport';

        var paramDefaults = {
            trip_airport : '@airport',
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
/**
 * @author    Seppe Beelprez
 * @copyright Copyright © 2014-2015 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */
;(function () { 'use strict';

    angular.module('app.trips')
        .factory('getTripsFactory', getTripsFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    getTripsFactory.$inject = [
        // Angular
        '$resource',

        // Custom
        'config'
    ];

    function getTripsFactory(
        // Angular
        $resource,

        // Custom
        config
    ) {
        var url = config.api + 'trips';

        var paramDefaults = {
            
        };

        var actions = {
            'query' : {
                method : 'GET',
                isArray: true
            }
        };

        return $resource(url, paramDefaults, actions);
    }

})();