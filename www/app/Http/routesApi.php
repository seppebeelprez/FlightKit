<?php

Route::group(['prefix' => 'api/v1'], function () {
    Route::resource('flights', 'Api\FlightsController');

    //Account
    Route::resource('account', 'Api\AccountController');
});
