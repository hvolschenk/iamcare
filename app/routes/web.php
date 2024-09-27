<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\UserController;

Route::controller(PageController::class) ->group(function () {
    Route::get('/', 'home')->name('home');
});

Route::controller(UserController::class)->group(function () {
    Route::get('login', 'login')->name('login');
    Route::get('logout', 'logout')->name('logout');
    Route::get('me', 'me')->name('me');
    Route::post('login/google', 'loginHandlerGoogle')->name('loginHandlerGoogle');
});
