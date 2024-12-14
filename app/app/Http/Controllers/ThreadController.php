<?php

namespace App\Http\Controllers;

use App\Models\Thread;

class ThreadController extends Controller
{
    public function view(Thread $thread)
    {
        return view('pages.thread', ['thread' => $thread]);
    }
}
