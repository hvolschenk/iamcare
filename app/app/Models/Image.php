<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Enums\Fit;
use Spatie\Image\Image as SpatieImage;

class Image extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'mimeType',
        'name',
        'sizeBytes',
        'url'
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'imageable_id',
        'imageable_type',
        'item_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'imageable_id',
        'imageable_type',
        'item_id',
    ];

    /**
     * Get a URL to the image at a given size
     */
    public function get(int $width = null, int $height = null): string
    {
        $pathOriginal = $this->url;
        $path = $pathOriginal;
        if ($width !== null && $height !== null) {
            $pathResized = str_replace('original/', "{$width}x{$height}/", $pathOriginal);
            $path = $pathResized;
            /** @var Illuminate\Filesystem\FilesystemAdapter $filesystem */
            $filesystem = Storage::disk('public');
            if (!$filesystem->exists($pathResized)) {
                $filesystem->copy($pathOriginal, $pathResized);
                $pathResizedFull = $filesystem->path($pathResized);
                $spatieImage = SpatieImage::load($pathResizedFull);
                $spatieImage
                    ->fit(Fit::Crop, $width, $height)
                    ->save();
            }
        }
        return asset("storage/{$path}");
    }

    /**
     * Get the parent imageable model
     */
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
