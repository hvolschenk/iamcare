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
    }

    /**
     * Get all of the item's images.
     */
    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    /**
     * The location where this item is available.
     * INFO: There is a bit of a caveat, please read the note below.
     */
    public function location(): BelongsTo
    {
        $relation = $this->belongsTo(Location::class);
        // This will only be true when the _Location_ is **not** eager loaded,
        // meaning that when _Locations_ are eager loaded,
        // that they will be loaded in the language that was used when the _Item_ was created.
        // This is just a compromise that will have to be accepted.
        // Please see `/adrs/001-localised-location.md` for more information.
        if ($this->googlePlaceID) {
            Location::saveIfNotExists($this->googlePlaceID, App::currentLocale());
            $relation->setQuery(
                Location::where([
                    'googlePlaceID' => $this->googlePlaceID,
                    'language' => App::currentLocale(),
                ])->getQuery(),
            );
        }
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
