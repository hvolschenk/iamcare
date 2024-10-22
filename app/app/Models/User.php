<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'name',
        'email',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [];

    /**
     * Bootstrap the model and its traits.
     */
    public static function boot()
    {
        parent::boot();
        self::deleting(function($user) {
            $user->authenticationMethods()->each(function($authenticationMethod) {
                $authenticationMethod->delete();
            });
        });
    }

    /**
     * A list of authentication methods link to this user's account
     */
    public function authenticationMethods(): HasMany
    {
        return $this->hasMany(AuthenticationMethod::class);
    }

    /**
     * A list of items created by this user
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
