<?php

Route::group(['middleware' => 'web'], function () {
    Route::auth();

    Route::get('/', 'HomeController@index');

    Route::get('/logout', 'Auth\AuthController@logout');

    Route::get('/redirect', 'SocialAuthController@redirect');
    Route::get('/callback', 'SocialAuthController@callback');
    
    
    Route::group(['prefix' => 'flights'], function () {
        Route::resource('/', 'Flights\FlightsController@index');
        Route::get('/detail/{airline}/{number}', 'Flights\FlightsController@detail');
    });

    Route::group(['prefix' => 'trips'], function () {
        Route::resource('/', 'Trips\TripsController@index');
        Route::resource('/detail', 'Trips\TripsController@detail');
    });
});

Route::group(['middleware' => 'admin'], function () {
    Route::group(['prefix' => 'admin'], function () {

        Route::resource('/flights', 'Admin\FlightsController@index');

        Route::resource('/trips', 'Admin\TripsController@index');

        Route::resource('/users', 'Admin\UsersController@index');
        Route::resource('/users/detail', 'Admin\UsersController@detail');
    });
});

// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');