<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemReportController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserReportController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthenticationController::class)->group(function () {
    Route::get('login', 'login')->name('login');
    Route::get('login/{driver}', 'loginHandler')
        ->name('loginHandler');
    Route::get('login/{driver}/redirect', 'loginRedirect')
        ->name('loginRedirect');
    Route::get('logout', 'logout')->name('logout');
    Route::middleware(['auth'])->group(function () {
        Route::post(
            'me/authentication-methods/{authenticationMethod}/default',
            'setAuthenticationMethodDefault',
        )->name('authenticationMethodSetDefault');
    });
});

Route::controller(ItemController::class)->group(function () {
    Route::middleware(['auth'])->group(function () {
        Route::delete('items/{item}', 'destroy')->name('itemDelete');
        Route::get('items/give', 'give')->name('itemGive');
        Route::get('items/give/form', 'giveForm')->name('itemGiveForm');
        Route::get('items/{item}/edit', 'edit')->name('itemEdit');
        Route::get('items/{item}/edit/form', 'editForm')->name('itemEditForm');
        Route::post('items/give', 'giveHandler')->name('itemGiveHandler');
        Route::post('items/{item}/edit', 'editHandler')->name('itemEditHandler');
        Route::post('items/{item}/mark-given', 'markGiven')->name('itemMarkGiven');
        Route::post('items/{item}/unmark-given', 'unmarkGiven')->name('itemUnmarkGiven');
    });
    Route::get('items/{item}', 'item')->name('item');
    Route::get('search', 'search')->name('search');
});

Route::controller(ItemReportController::class)->middleware(['auth'])->group(function () {
    Route::get('items/{item}/report', 'report')->name('reportItem');
    Route::get('items/{item}/report/form', 'reportForm')->name('reportItemForm');
    Route::post('items/{item}/report', 'reportHandler')->name('reportItemHandler');
});

Route::controller(LegalController::class)->group(function () {
    Route::get('legal', 'legal')->name('legal');
    Route::get('legal/privacy-policy', 'privacyPolicy')->name('privacyPolicy');
    Route::get('legal/terms-of-use', 'termsOfUse')->name('termsOfUse');
});

Route::controller(PageController::class)->group(function () {
    Route::get('/', 'home')->name('home');
});

Route::controller(ThreadController::class)->middleware(['auth'])->group(function () {
    Route::get('inbox', 'index')->name('threads');
    Route::get('inbox/create/{item}', 'create')->name('threadCreate');
    Route::get('inbox/create/{item}/form', 'createForm')->name('threadCreateForm');
    Route::get('inbox/{thread}', 'view')->name('thread');
    Route::get('inbox/{thread}/reply/form', 'replyForm')->name('threadReplyForm');
    Route::post('inbox/create/{item}', 'createHandler')->name('threadCreateHandler');
    Route::post('inbox/{thread}/reply', 'reply')->name('threadReply');
});

Route::controller(UserController::class)->group(function () {
    Route::middleware(['auth'])->group(function () {
        Route::get('me', 'me')->name('me');
        Route::get('me/items', 'items')->name('myItems');
        Route::get('me/profile', 'profile')->name('myProfile');
    });
    Route::get('me/language/{language}', 'language')
        ->where(['language' => '^(af|en|nl)$'])
        ->name('language');
    Route::get('users/{user}', 'user')->name('user');
});

Route::controller(UserReportController::class)->middleware(['auth'])->group(function () {
    Route::get('users/{user}/report', 'report')->name('reportUser');
    Route::get('users/{user}/report/form', 'reportForm')->name('reportUserForm');
    Route::post('users/{user}/report', 'reportHandler')->name('reportUserHandler');
});
