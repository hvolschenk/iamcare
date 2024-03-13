<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemCreateRequest;
use App\Http\Requests\ItemDeleteRequest;
use App\Http\Requests\ItemMarkAsGivenRequest;
use App\Http\Requests\ItemSearchRequest;
use App\Http\Requests\ItemUpdateRequest;
use App\Http\Resources\ItemResource;
use App\Models\Image;
use App\Models\Item;
use App\Models\Location;
use App\Services\GooglePlaces;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function destroy(ItemDeleteRequest $request, Item $item)
    {
        $item->delete();
        return response()->noContent();
    }

    public function index()
    {
        return ItemResource::collection(
            Item::where(['is_given', false])->paginate(15),
        );
    }

    public function show(Item $item)
    {
        return new ItemResource(
            Item::with(['location', 'images', 'tags', 'user'])
                ->find($item->id),
        );
    }

    public function create(ItemCreateRequest $request)
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
            return new ItemResource(
                Item::with(['location', 'images', 'tags', 'user'])
                    ->find($item->id),
            );
        } catch (\Exception $error) {
            Log::debug('Item: Create: Undo: Delete Images');
            foreach ($images as $image) {
                Storage::delete($image->url);
            }
            response(null, 500);
        }
    }

    public function markAsGiven(ItemMarkAsGivenRequest $request, Item $item)
    {
        $item->is_given = true;
        $item->save();
        return new ItemResource(
            Item::with(['location', 'images', 'tags', 'user'])
                ->find($item->id),
        );
    }

    public function search(ItemSearchRequest $request)
    {
        $validated = $request->safe(['distance', 'location', 'query', 'tags']);
        $distance = $validated['distance'] ?? null;
        $googlePlaceID = $validated['location'] ?? null;
        $searchQuery = $validated['query'] ?? null;
        $tagIDs = $validated['tags'] ?? null;

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

        Log::debug('Item: Search: Done');
        return ItemResource::collection($itemsQuery->paginate(15));
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
            /** @var $filesystem Illuminate\Filesystem\FilesystemAdapter */
            $filesystem = Storage::disk('public');
            $path = $filesystem->putFile('images/items', $uploadedFile);
            $image = new Image([
                'mimeType' => $uploadedFile->getMimeType(),
                'name' => $uploadedFile->getFilename(),
                'sizeBytes' => $uploadedFile->getSize(),
                'url' => $filesystem->url($path),
            ]);
            array_push($images, $image);
        }
        return $images;
    }
}
