<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthenticationController;
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
Route::controller(AuthenticationController::class)->group(function () {
    Route::post('/authenticate/{provider}', 'loginWithProvider')->where(['provider' => '^google$']);
    Route::get('/authenticate/me', 'currentUser');
});

Route::controller(ArticleController::class)->group(function () {
    Route::delete('articles/{article}', 'delete');
    Route::get('articles', 'index');
    Route::get('articles/{article}', 'show');
    Route::post('articles', 'store');
    Route::put('articles/{article}', 'update');
});
