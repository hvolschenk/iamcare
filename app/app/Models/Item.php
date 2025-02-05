<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\App;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'googlePlaceID',
        'is_given',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'location_id',
        'user_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'location_id',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['location'];

    /**
     * Bootstrap the model and its traits.
     */
    public static function boot()
    {
        parent::boot();

        self::deleting(function ($item) {
            $item->images()->each(function ($image) {
                $image->delete();
            });
        });

        self::retrieved(function ($item) {
            if ($item->location === null) {
                $item->location = Location::fetchFromGooglePlaces(
                    $item->googlePlaceID,
                    App::currentLocale(),
                );
            }
        });
    }

    /**
     * Get all of the item's images.
     */
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    /**
     * The location where this item is available
     */
    public function location(): BelongsTo
    {
        $relation = $this->belongsTo(Location::class);
        $relation->setQuery(
            Location::where([
                'googlePlaceID' => $this->googlePlaceID,
                'language' => App::currentLocale(),
            ])->limit(1)->getQuery(),
        );
        return $relation;
    }

    /**
     * All tags for the item
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    /**
     * The user that this item belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
