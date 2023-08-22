<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Models\Category;
use App\Models\Image;
use App\Models\Item;
use App\Models\Location;
use App\Services\GooglePlaces;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function destroy(Item $item)
    {
        $this->authorize('delete', $item);
        $item->delete();
        return response()->noContent();
    }

    public function index()
    {
        $this->authorize('viewAny', Item::class);
        return Item::all();
    }

    public function show(Item $item)
    {
        $this->authorize('view', $item);
        return new ItemResource(Item::with(['category', 'location', 'images', 'user'])->find($item->id));
    }

    public function create(Request $request)
    {
        Log::debug('Item: Create: Start', [ 'name' => $request->input(('name')) ]);
        $this->authorize('create', Item::class);
        $request->validate([
            'category' => 'bail|required|alpha',
            'description' => 'bail|required',
            'location' => 'bail|required',
            'name' => 'bail|required'
        ]);

        $googlePlaceID = $request->input('location');
        $language = $request->getPreferredLanguage(GooglePlaces::SUPPORTED_LANGUAGES);

        $location = Location::fromGooglePlaceID($googlePlaceID, $language);
        $category = Category::firstOrNew(['name' => $request->input('category')]);
        $images = $this->imagesFromInput($request->file('image'));
        $user = $request->user();
        $item = new Item([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
        ]);

        try {
            DB::transaction(function () use ($category, $images, $item, $location, $user) {
                Log::debug('Item: Create: Save', [ 'name' => $item->name ]);
                $item->save();
                $category->save();
                $item->location()->associate($location);
                $item->category()->associate($category);
                $item->images()->saveMany($images);
                $item->user()->associate($user);
                $item->save();
            }, 1);
            Log::debug('Item: Create: Return', [ 'id' => $item->id ]);
            return new ItemResource(Item::with(['category', 'location', 'images', 'user'])->find($item->id));
        } catch (\Exception $error) {
            Log::debug('Item: Create: Undo: Delete Images');
            foreach ($images as $image) {
                Storage::delete($image->url);
            }
            response(null, 500);
        }
    }

    /**
     * @param UploadedFile[] $uploadedFiles
     *
     * @return Image[]
     */
    private function imagesFromInput (array $uploadedFiles): array
    {
        $images = [];
        foreach ($uploadedFiles as $uploadedFile)
        {
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
