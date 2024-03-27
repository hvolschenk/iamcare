<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagResource;
use App\Models\Tag;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TagResource::collection(Tag::all());
    }

    public function popular()
    {
        $tags = Tag::withCount(['items'])->orderBy('items_count', 'DESC')->paginate(15);
        return TagResource::collection($tags);
    }
}
