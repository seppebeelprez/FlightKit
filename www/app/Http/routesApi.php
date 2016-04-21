<?php

Route::group(['prefix' => 'api/v1'], function () {

    //Flights
    Route::resource('flights', 'Api\FlightsController');
    Route::resource('flights/outdated', 'Api\FlightsController@deleteOutdated');

    //Trips
    Route::resource('trips', 'Api\TripsController');

    //Account
    Route::resource('account', 'Api\AccountController');
});
