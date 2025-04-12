<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Tag;

/**
 * A controller to handle all pages not directly related to a specific model.
 */
class PageController extends Controller
{
    public function home()
    {
        $latestItems = Item::latest()->limit(12)->get();
        $popularTags = Tag::withCount(['items'])
            ->orderBy('items_count', 'DESC')
            ->limit(12)
            ->get();

        return view(
            'pages.home',
            ['latestItems' => $latestItems, 'popularTags' => $popularTags],
        );
    }
}
