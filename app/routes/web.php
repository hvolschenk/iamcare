<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Todo;

Route::get('/', function () {
    return view('pages.home');
});

Route::get('/todos', function () {
    $todos = Todo::all();
    return view('pages.todos', ['todos' => $todos]);
});

Route::post('/todos', function (Request $request) {
    $title = $request->input('title');
    $description = $request->input('description');
    $todo = new Todo();
    $todo->title = $title;
    $todo->description = $description;
    $todo->save();
    $todos = Todo::all();
    return view('components.todos', ['todos' => $todos]);
});
