<?php

Route::group(['middleware' => 'web'], function () {
    Route::auth();

    Route::get('/', 'HomeController@index');

    Route::get('/logout', 'Auth\AuthController@logout');

    Route::get('/redirect', 'SocialAuthController@redirect');
    Route::get('/callback', 'SocialAuthController@callback');

//    Route::get('/home', 'MainController@index');
//    Route::get('/account', 'Account\AccountController@index');
//    Route::resource('/flights', 'Flights\FlightsController@index');
//    Route::resource('/flights/detail/', 'Flights\FlightsController@detail');

    Route::group(['prefix' => 'flights'], function () {
        Route::resource('/', 'Flights\FlightsController@index');
        Route::get('/detail/{airline}/{number}', 'Flights\FlightsController@detail');
    });

    Route::group(['prefix' => 'trips'], function () {
        Route::resource('/', 'Trips\TripsController@index');
        Route::resource('/detail', 'Trips\TripsController@detail');
    });
});