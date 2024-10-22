<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemGiveRequest;
use App\Models\Image;
use App\Models\Item;
use App\Models\Location;
use App\Models\Tag;
use App\Services\GooglePlaces;
use Illuminate\Contracts\Filesystem\Filesystem;
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
