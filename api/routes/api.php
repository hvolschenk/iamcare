<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ThreadController;
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

Route::controller(ItemController::class)->group(function () {
    Route::delete('items/{item}', 'destroy');
    Route::get('items', 'index');
    Route::get('items/search', 'search');
    Route::get('items/{item}', 'show');
    Route::post('items', 'create');
    Route::post('items/{item}/mark-as-given', 'markAsGiven');
    Route::put('items/{item}', 'update');
});

Route::controller(LocationController::class)->group(function () {
    Route::get('locations/popular', 'popular');
    Route::get('locations/{location}', 'show');
    Route::get('locations/google/{googlePlaceID}', 'google');
});

Route::controller(TagController::class)->group(function () {
    Route::get('tags', 'index');
    Route::get('tags/popular', 'popular');
});

Route::controller(ThreadController::class)->group(function () {
    Route::get('threads', 'index');
    Route::get('threads/unread', 'unreadThreadCount');
    Route::get('threads/{thread}', 'show');
    Route::post('threads', 'create');
    Route::post('threads/{thread}/mark-as-read', 'markAsRead');
    Route::post('threads/{thread}/reply', 'reply');
});

Route::controller(UserController::class)->group(function () {
    Route::get('users/me', 'currentUser');
    Route::get('users/{user}', 'show');
    Route::get('users/{user}/items', 'items');
    Route::post('users/authenticate/{provider}', 'loginWithProvider')
        ->where(['provider' => '^google$']);
    Route::post('users/logout', 'logout');
});
