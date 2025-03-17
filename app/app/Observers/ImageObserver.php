<?php

namespace App\Observers;

use App\Models\Image;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageObserver
{
    /**
     * Handle the Image "created" event.
     */
    public function created(Image $image): void
    {
        //
    }

    /**
     * Handle the Image "updated" event.
     */
    public function updated(Image $image): void
    {
        //
    }

    /**
     * Handle the Image "deleted" event.
     */
    public function deleted(Image $image): void
    {
        //
    }

    /**
     * Handle the Image "restored" event.
     */
    public function restored(Image $image): void
    {
        //
    }

    /**
     * Handle the Image "force deleted" event.
     */
    public function forceDeleted(Image $image): void
    {
        Log::debug('Image: Delete from disk', ['id' => $image->id, 'name' => $image->name]);
        $disk = Storage::disk('public');
        $directories = $disk->directories('images/items');
        foreach ($directories as $directory) {
            $path = str_replace('images/items/original', $directory, $image->url);
            if ($disk->exists($path)) {
                $disk->delete($path);
            }
        }
    }
}
