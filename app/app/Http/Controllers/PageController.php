<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Builder;

/**
 * A controller to handle all pages not directly related to a specific model.
 */
class PageController extends Controller
{
    public function home()
    {
        $latestItems = Item::latest()->where('is_given', false)->limit(12)->get();
        $popularTags = Tag::withCount([
            'items' => function (Builder $query) {
                $query->where('is_given', false);
            },
        ])
            ->orderBy('items_count', 'DESC')
            ->limit(12)
            ->get();
        $latestGivenItems = Item::latest()->where('is_given', true)->limit(12)->get();

        return view(
            'pages.home',
            [
                'latestGivenItems' => $latestGivenItems,
                'latestItems' => $latestItems,
                'popularTags' => $popularTags,
            ],
        );
    }
}
