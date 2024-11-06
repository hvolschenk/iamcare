<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemGiveRequest;
use App\Http\Requests\ItemSearchRequest;
use App\Models\Image;
use App\Models\Item;
use App\Models\Location;
use App\Models\Tag;
use App\Services\GooglePlaces;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function give ()
    {
        $tags = Tag::all();
        return view('pages.item-give', ['tags' => $tags]);
    }

    public function giveForm ()
    {
        $tags = Tag::all();
        return view('components.item-form', ['tags' => $tags]);
    }

    public function giveHandler (ItemGiveRequest $request)
    {
        $validated = $request->safe(['description', 'image', 'location', 'name', 'tag']);
        $description = $validated['description'];
        $googlePlaceID = $validated['location'];
        $images = $validated['image'];
        $name = $validated['name'];
        $tags = $validated['tag'];

        Log::debug('Item: Create: Start', ['name' => $name]);

        $language = $request->getPreferredLanguage(GooglePlaces::SUPPORTED_LANGUAGES);

        $location = Location::fromGooglePlaceID($googlePlaceID, $language);
        $images = $this->imagesFromInput($images);
        $user = $request->user();
        $item = new Item([
            'name' => $name,
            'description' => $description,
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
            $tags = Tag::all();
            return view(
                'components.item-form',
                ['error' => __('item.errorCreate'), 'tags' => $tags],
            );
        }
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

        $itemsQuery = Item::query()->select()->where('is_given', false);

        if ($searchQuery !== null) {
            $itemsQuery->where(function (Builder $builder) use ($searchQuery) {
                $builder
                    ->whereFullText('name', $searchQuery)
                    ->orWhereFullText('description', $searchQuery);
            });
        }

        if ($googlePlaceID !== null) {
            $language = $request->getPreferredLanguage(GooglePlaces::SUPPORTED_LANGUAGES);
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
