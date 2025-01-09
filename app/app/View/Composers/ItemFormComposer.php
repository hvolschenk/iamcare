<?php

namespace App\View\Composers;

use App\Models\Tag;
use Illuminate\View\View;

class ItemFormComposer
{
    /**
     * Create a new profile composer.
     */
    public function __construct() {}

    /**
     * Bind data to the view.
     */
    public function compose(View $view): void
    {
        $tags = Tag::all();
        $view->with('tags', $tags);
    }
}
