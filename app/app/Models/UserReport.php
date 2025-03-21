<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserReport extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reason',
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'user_id_reported',
        'user_id_reporter',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'user_id_reported',
        'user_id_reporter',
    ];

    /**
     * The user that this item belongs to
     */
    public function userReported(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_reported');
    }

    /**
     * The user who is interested in the item
     */
    public function userReporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_reporter');
    }
}
