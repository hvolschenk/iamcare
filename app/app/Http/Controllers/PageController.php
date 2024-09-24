<?php

namespace App\Http\Controllers;

/**
 * A controller to handle all pages not directly related to a specific model.
 */
class PageController extends Controller
{
    public function home ()
    {
        return view('pages.home');
    }
}
