<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\UserController;

Route::controller(ItemController::class)->group(function () {
    Route::get('items/give', 'give')->name('itemGive');
    Route::get('items/give/form', 'giveForm')->name('itemGiveForm');
    Route::get('search', 'search')->name('search');
    Route::post('items/give', 'giveHandler')->name('itemGiveHandler');
});

Route::controller(PageController::class) ->group(function () {
    Route::get('/', 'home')->name('home');
});

Route::controller(UserController::class)->group(function () {
    Route::get('login', 'login')->name('login');
    Route::get('logout', 'logout')->name('logout');
    Route::get('me', 'me')->name('me');
    Route::get('me/items', 'items')->name('myItems');
    Route::post('login/google', 'loginHandlerGoogle')->name('loginHandlerGoogle');
});
