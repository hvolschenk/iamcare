<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\UserController;

Route::controller(ItemController::class)->group(function () {
    Route::delete('items/{item}', 'destroy')->name('itemDelete');
    Route::get('items/give', 'give')->name('itemGive');
    Route::get('items/give/form', 'giveForm')->name('itemGiveForm');
    Route::get('items/{item}', 'item')->name('item');
    Route::get('items/{item}/edit', 'edit')->name('itemEdit');
    Route::get('items/{item}/edit/form', 'editForm')->name('itemEditForm');
    Route::get('search', 'search')->name('search');
    Route::post('items/give', 'giveHandler')->name('itemGiveHandler');
    Route::post('items/{item}/edit', 'editHandler')->name('itemEditHandler');
    Route::post('items/{item}/mark-given', 'markGiven')->name('itemMarkGiven');
});

Route::controller(PageController::class)->group(function () {
    Route::get('/', 'home')->name('home');
});

Route::controller(ThreadController::class)->group(function () {
    Route::get('inbox', 'index')->name('threads');
    Route::get('inbox/create/{item}', 'create')->name('threadCreate');
    Route::get('inbox/create/{item}/form', 'createForm')->name('threadCreateForm');
    Route::get('inbox/{thread}', 'view')->name('thread');
    Route::get('inbox/{thread}/reply/form', 'replyForm')->name('threadReplyForm');
    Route::post('inbox/create/{item}', 'createHandler')->name('threadCreateHandler');
    Route::post('inbox/{thread}/reply', 'reply')->name('threadReply');
});

Route::controller(UserController::class)->group(function () {
    Route::get('login', 'login')->name('login');
    Route::get('logout', 'logout')->name('logout');
    Route::get('me', 'me')->name('me');
    Route::get('me/items', 'items')->name('myItems');
    Route::get('me/language/{language}', 'language')
        ->where(['language' => '^(af|en|nl)$'])
        ->name('language');
    Route::get('user/{user}', 'user')->name('user');
    Route::post('login/google', 'loginHandlerGoogle')->name('loginHandlerGoogle');
});
