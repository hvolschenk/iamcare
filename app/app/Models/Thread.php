<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Thread extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'item_id',
        'user_id_giver',
        'user_id_receiver',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'item_id',
        'user_id_giver',
        'user_id_receiver',
    ];

    /**
     * The item that this thread is about
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * The messages in this thread
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * The user that this item belongs to
     */
    public function userGiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_giver');
    }

    /**
     * The user who is interested in the item
     */
    public function userReceiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_receiver');
    }
}
