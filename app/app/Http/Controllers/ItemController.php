<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemDeleteRequest;
use App\Http\Requests\ItemEditHandlerRequest;
use App\Http\Requests\ItemEditRequest;
use App\Http\Requests\ItemGiveHandlerRequest;
use App\Http\Requests\ItemGiveRequest;
use App\Http\Requests\ItemMarkGivenRequest;
use App\Http\Requests\ItemSearchRequest;
use App\Models\Image;
use App\Models\Item;
use App\Models\ItemReport;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Thread;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function destroy(ItemDeleteRequest $request, Item $item)
    {
        $item->delete();
        return response(null, 204, ['Hx-Redirect' => route('myItems')]);
    }

    public function edit (ItemEditRequest $request, Item $item)
    {
        return view('pages.item-edit', ['item' => $item]);
    }

    public function editForm (Item $item)
    {
        return view(
            'components.item-form',
            [
                'actionPrimaryLabel' => __('item.edit'),
                'actionPrimaryLocation' => route('itemEditHandler', $item),
                'item' => $item,
            ],
        );
    }

    public function editHandler (ItemEditHandlerRequest $request, Item $item)
    {
        Log::withContext(['id' => $item->id]);

        $validated = $request->safe([
            'description',
            'image',
            'imageExisting',
            'location',
            'name',
            'removeImage',
            'tag',
        ]);
        $description = $validated['description'];
        $googlePlaceID = $validated['location'];
        $images = $validated['image'] ?? [];
        $imagesExisting = $validated['imageExisting'] ?? [];
        $name = $validated['name'];
        $tags = $validated['tag'];

        Log::debug('Item: Update: Start');

        $isLocationUpdated = $item->location->googlePlaceID !== $googlePlaceID;
        if ($isLocationUpdated === true) {
            $language = App::currentLocale();
            $location = Location::fromGooglePlaceID($googlePlaceID, $language);
            Log::debug('Item: Update: Update Location', ['locationID' => $location->id]);
            $item->location()->associate($location);
        }

        foreach ($item->images as $image) {
            if (!in_array($image->id, $imagesExisting)) {
                $image->forceDelete();
            }
        }

        if ($images && count($images) > 0) {
            $images = $this->imagesFromInput($images);
            $item->images()->saveMany($images);
            $item->refresh();
        }

        $item->tags()->detach();
        $item->tags()->attach($tags);

        $item->description = $description;
        $item->name = $name;
        $item->save();

        return response(null, 204, ['Hx-Redirect' => route('myItems')]);
    }

    public function give (ItemGiveRequest $request)
    {
        return view('pages.item-give');
    }

    public function giveForm ()
    {
        return view(
            'components.item-form',
            [
                'actionPrimaryLabel' => __('item.give'),
                'actionPrimaryLocation' => route('itemGive'),
            ],
        );
    }

    public function giveHandler (ItemGiveHandlerRequest $request)
    {
        $validated = $request->safe(['description', 'image', 'location', 'name', 'tag']);
        $description = $validated['description'];
        $googlePlaceID = $validated['location'];
        $images = $validated['image'];
        $name = $validated['name'];
        $tags = $validated['tag'];

        Log::debug('Item: Create: Start', ['name' => $name]);

        $language = App::currentLocale();
        $location = Location::fromGooglePlaceID($googlePlaceID, $language);
        $images = $this->imagesFromInput($images);
        $user = $request->user();
        $item = new Item([
            'name' => $name,
            'description' => $description,
            'googlePlaceID' => $googlePlaceID,
        ]);

        try {
            DB::transaction(function () use ($images, $item, $location, $tags, $user) {
                Log::debug('Item: Create: Save', ['name' => $item->name]);
                $item->save();
                $item->location()->associate($location);
                $item->images()->saveMany($images);
                $item->tags()->attach($tags);
                $item->user()->associate($user);
                $item->save();
            }, 1);
            Log::debug('Item: Create: Return', ['id' => $item->id]);
            return response(null, 204, ['Hx-Redirect' => route('home')]);
        } catch (\Exception $error) {
            Log::error('Item: Create: Error', ['error' => $error]);
            Log::debug('Item: Create: Undo: Delete Images');
            foreach ($images as $image) {
                Storage::delete($image->url);
            }
            $request->flash();
            return view(
                'components.item-form',
                ['error' => __('item.errorCreate')],
            );
        }
    }

    public function item(Request $request, Item $item)
    {
        $user = $request->user();
        $itemReport = ItemReport::whereRelation('item', 'id', $item->id)
            ->whereRelation('user', 'id', $user->id)
            ->first();
        $thread = Thread::where([
            'item_id' => $item->id,
            'user_id_receiver' => $user->id,
        ])->first();
        return view(
            'pages.item',
            ['item' => $item, 'itemReport' => $itemReport, 'thread' => $thread],
        );
    }

    public function markGiven(ItemMarkGivenRequest $request, Item $item)
    {
        Log::debug('Item: Mark Given', ['id' => $item->id]);
        $item->is_given = true;
        $item->save();
        return response(null, 204, ['Hx-Redirect' => route('threads')]);
    }

    public function search(ItemSearchRequest $request)
    {
        $validated = $request->safe(['distance', 'location', 'query', 'tag']);
        $distance = $validated['distance'] ?? null;
        $googlePlaceID = $validated['location'] ?? null;
        $orderBy = $validated['orderBy'] ?? null;
        $searchQuery = $validated['query'] ?? null;
        $tagIDs = $validated['tag'] ?? null;

        Log::withContext([
            'distance' => $distance,
            'googlePlaceID' => $googlePlaceID,
            'query' => $searchQuery,
            'tagIDs' => $tagIDs,
        ]);
        Log::debug('Item: Search: Start');

        $itemsQuery = Item::where('is_given', false);

        if ($searchQuery !== null) {
            $itemsQuery->where(function (Builder $builder) use ($searchQuery) {
                $builder
                    ->whereFullText('name', $searchQuery)
                    ->orWhereFullText('description', $searchQuery);
            });
        }

        if ($googlePlaceID !== null) {
            $language = App::currentLocale();
            $location = Location::fromGooglePlaceID($googlePlaceID, $language);
            $locationName = $location->address;
            $locationsQuery = Location::query()
                ->select(['id'])
                ->selectRaw(
                    'ST_Distance_Sphere(point(?, ?), point(`latitude`, `longitude`)) * .001 AS `distance`',
                    [$location->latitude, $location->longitude]
                );
            if ($distance !== null && $distance !== '0') {
                $locationsQuery->having('distance', '<=', $distance);
            }
            $locationsQuery->orderBy('distance');
            $locations = $locationsQuery->get();
            $locationIds = array_map(function ($location) {
                return $location['id'];
            }, $locations->toArray());
            $locationIdsJoined = implode(',', $locationIds);

            $itemsQuery
                ->whereIn('location_id', $locationIds)
                ->orderByRaw("FIELD(`location_id`, {$locationIdsJoined})");
        }

        if ($tagIDs !== null) {
            $itemsQuery->whereHas('tags', function (Builder $builder) use ($tagIDs) {
                foreach ($tagIDs as $tagIDIndex => $tagID) {
                    if ($tagIDIndex === 0) {
                        $builder->where('id', $tagID);
                    } else {
                        $builder->orWhere('id', $tagID);
                    }
                }
            });
        }

        if ($orderBy === 'latest') {
            $itemsQuery->orderByDesc('created_at');
        }

        Log::debug('Item: Search: Done');
        $items = $itemsQuery->paginate(12);

        $tags = Tag::all();

        return view('pages.search', [
            'distance' => $distance,
            'googlePlaceID' => $googlePlaceID ?? '',
            'items' => $items,
            'locationName' => $locationName ?? '',
            'query' => $searchQuery ?? '',
            'tagIDs' => $tagIDs ?? [],
            'tags' => $tags,
        ]);
    }

    /**
     * @param UploadedFile[] $uploadedFiles
     *
     * @return Image[]
     */
    private function imagesFromInput(array $uploadedFiles): array
    {
        $images = [];
        foreach ($uploadedFiles as $uploadedFile) {
            $url = $uploadedFile->store(
                'images/items/original',
                ['disk' => 'public', 'visibility' => Filesystem::VISIBILITY_PUBLIC],
            );
            $image = new Image([
                'mimeType' => $uploadedFile->getMimeType(),
                'name' => $uploadedFile->getFilename(),
                'sizeBytes' => $uploadedFile->getSize(),
                'url' => $url,
            ]);
            array_push($images, $image);
        }
        return $images;
    }
}
