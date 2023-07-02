<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::controller(CategoryController::class)->group(function () {
    Route::get('categories', 'index');
});

Route::controller(ItemController::class)->group(function () {
    Route::get('items', 'index');
    Route::get('items/{item}', 'show');
    Route::post('items', 'create');
});

Route::controller(UserController::class)->group(function () {
    Route::get('users/me', 'currentUser');
    Route::get('users/{user}', 'show');
    Route::post('users/authenticate/{provider}', 'loginWithProvider')
        ->where(['provider' => '^google$']);
});
