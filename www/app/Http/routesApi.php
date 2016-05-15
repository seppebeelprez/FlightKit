<?php

Route::group(['prefix' => 'api/v1'], function () {

    //Flights
    Route::resource('flights', 'Api\FlightsController');
    Route::resource('flights/outdated', 'Api\FlightsController@deleteOutdated');
    Route::get('flights/detail/{airline}/{number}', 'Api\FlightsController@show');

    //Trips
    Route::resource('trips', 'Api\TripsController');
    Route::resource('trips/detail', 'Api\TripsController@show');
    
    //Account
    Route::resource('account', 'Api\AccountController');
});
