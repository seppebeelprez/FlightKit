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
            'app.factories'
            //'app.style-guide'
        ]);

    angular.module('app.home', ['ui.router', 'ngRoute']);
    angular.module('app.flights', ['ui.router', 'ngRoute', 'ngResource', 'ui.bootstrap']);
    angular.module('app.trips', ['ui.router']);
    angular.module('app.account', ['ui.router']);

    angular.module('app.factories', ['ui.router']);
    //angular.module('app.style-guide', []);
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
            appId : 'dbb6ea9e',
            appKey : '5bf1b2bedbd8e63dc1b3221cbd834c2c',
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

        // Custom
        'GetAccountFactory'
    ];

    function AccountOverviewController(
        // Angular
        $log,
        $scope,
        config,

        // Custom
        GetAccountFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Account Details',
            subtitle: 'Overview of records!'
        };

        vm.user = GetAccountFactory.getAccount($scope);
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

        //Custom
        'createFlightsFactory',
        'scheduleFlightAPIFactory'
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

        //Custom
        createFlightsFactory,
        scheduleFlightAPIFactory
    ) {
        //console.log('FlightsCreateController');
        // ViewModel
        // =========
        var vm = this;

        // User Interaction
        // --------------
        vm.$$ix = {
            next        : createFlight,
            confirm     : showModal
        };

        vm.animationsEnabled = true;

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Create a flight',
            subtitle: 'Select your airline, flight number and date.'
        };

        // Data
        // ----
        // vm.flight
        vm.flight = {};
        vm.data = {};

        vm.flight.today = new Date();



        // Functions
        // =========
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
                    '' + config.appKey + '',
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
                            console.log('Start: ', vm.departureAirport);
                        }
                        else if ( airport.iata == vm.flight.arrivalCode ) {
                            vm.arrivalAirport = airport;
                            console.log('End: ', vm.arrivalAirport);
                        }
                    });


                    if ( vm.checkCurrentFlight[0].error ) {
                        if ( vm.checkCurrentFlight[0].error.httpStatusCode === 400) {
                            var alertFlightModal = $uibModal.open({
                                animation: vm.animationsEnabled,
                                templateUrl: 'errorModal.html',
                                scope: $scope
                            });
                            vm.$$ix.again = function () {
                                alertFlightModal.dismiss('cancel');
                            };
                        }
                    } else {
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


        // Create Flight
        // -----
        function createFlight() {
            console.log('createFlight: ', vm.checkCurrentFlight);
            vm.flight.flightId = vm.checkCurrentFlight[0].flightStatuses[0].flightId;
            vm.flight.date = $filter('date')(vm.flight.today, 'yyyy/MM/dd');
            console.log('vm.flight: ', vm.flight);

            createFlightsFactory.createFlight(vm.flight);

            //console.log('All airports: ', vm.allAirports);
            //console.log('original flight: ', vm.flight);
            //
            //createFlightsFactory.createFlight(vm.flight);
            //$window.location.href = '/flights';
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
            .state('/flights/', {
                url: '/flights/:flight_id',
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

        //Custom
        'getFlightsFactory',
        'scheduleFlightAPIFactory',
        'config'
    ];

    function FlightsOverviewController(
        // Angular
        $log,
        $scope,
        $state,
        $filter,
        $q,

        //Custom
        getFlightsFactory,
        scheduleFlightAPIFactory,
        config
    ) {
        // ViewModel
        // =========
        var vm = this;

        getFlights();
        //vm.overview = getSchedules();

        //$scope.promises = [];

        // User Interface
        // --------------
        vm.$$ui = {
            title: 'Flights Overview',
            subtitle: 'Overview of your added flights!'
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
            //$log.success('getFlightsSuccess:', response);
            vm.data = response[0];

            getSchedules();
        }

        function getSchedules() {

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
                        vm.currentFlightData.databaseId = flight.id;
                        //Push array with 1 flight to array with multiple flights
                        vm.flights.push(vm.currentFlightData);
                    },
                    function errorCallback (){
                        console.log("data not sent to API, new object is not created");
                    });

                //Fill test array to make sure for each went well!
                //Use this name for next $q.all
                //console.log('check 1');
                vm.allFlightsData.push(result);
            });

            $q.all(vm.allFlightsData).then(function success(data){
                //console.log('vm.flights: ', vm.flights); // Should all be here


                //Test array
                vm.checkForEachQAll = [];
                //Array to store other arrays with checked flight information
                vm.allCheckedFlights = [];


                //For each flight of the user in the database get the correct information
                //Especially for the departure and arrival airport
                angular.forEach(vm.flights,function(flight,key){

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
                    vm.checkThisFlight.databaseFlightId     = null;

                    //Place all current flight information in allFlightDetails
                    vm.checkThisFlight.departureAirport     = vm.tempDepartureAirport;
                    vm.checkThisFlight.arrivalAirport       = vm.tempArrivalAirport;
                    vm.checkThisFlight.allFlightDetails     = flight.allData;
                    vm.checkThisFlight.databaseFlightId     = flight.databaseId;

                    //Push current checkThisFlight to allCheckedFlights
                    //console.log('before push tot allCheckedFlights', vm.checkThisFlight);
                    vm.allCheckedFlights.push(vm.checkThisFlight);
                    //console.log('Test checkThisFlight (ONLY 2 TIMES)', key, vm.allCheckedFlights);

                    //Fill test array to make sure for each went well!
                    //Use this name for next $q.all
                    //console.log('check 3');
                    vm.checkForEachQAll.push(flight);
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
        var url = config.api + 'flights/:flight_id';

        var paramDefaults = {
            flight_id : '@id',
            format    : 'json'
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
            format    : 'json'
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

        //var url = 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/:airline/:number/departing/:year/:month/:day?appId=:appId&appKey=:appKey';
        ////var url = 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/4200/departing/2016/04/08?appId=dbb6ea9e&appKey=5bf1b2bedbd8e63dc1b3221cbd834c2c';
        //
        //var paramDefaults = {
        //    airline   : '@airline',
        //    number    : '@number',
        //    year      : '@year',
        //    month     : '@month',
        //    day       : '@day',
        //    appId     : config.appId,
        //    appKey    : config.appKey,
        //    format    : 'jsonp'
        //};
        //
        //var actions = {
        //    'query' : {
        //        method : 'GET',
        //        headers: {
        //            Accept: "application/json; charset=utf-8",
        //            "Content-Type": "application/json; charset=utf-8"
        //        },
        //        dataType: 'jsonp',
        //        crossDomain : true
        //    }
        //};
        //
        //return $resource(url, paramDefaults, actions);


    }

})();