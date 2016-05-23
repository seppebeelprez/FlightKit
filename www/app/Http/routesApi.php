<?php

Route::group(['prefix' => 'api/v1'], function () {

    //Flights
    Route::resource('flights', 'Api\FlightsController');
    Route::resource('flights/outdated', 'Api\FlightsController@deleteOutdated');
    Route::get('flights/detail/{airline}/{number}', 'Api\FlightsController@show');
    Route::resource('admin/flights', 'Api\FlightsController@admin');
    Route::resource('admin/flights/delete', 'Api\FlightsController@harddelete');

    //Trips
    Route::resource('trips', 'Api\TripsController');
    Route::resource('trips/detail', 'Api\TripsController@show');
    Route::resource('admin/trips', 'Api\TripsController@admin');
    Route::resource('admin/trips/delete', 'Api\TripsController@harddelete');
    
    //Account
    Route::resource('account', 'Api\AccountController');
    Route::resource('admin/users', 'Api\AccountController@users');
    Route::resource('admin/users/detail', 'Api\AccountController@show');
    Route::resource('admin/users/delete', 'Api\AccountController@harddelete');
    
});
