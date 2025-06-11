<?php

namespace App\Models;

use App\Services\GooglePlaces;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable implements HasLocalePreference
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'language',
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
     * Get the user's avatar image URL
     *
     * @return string
     */
    public function getAvatar(): string
    {
        if ($this->avatar) {
            return $this->avatar;
        }
        return asset('images/avatar.webp');
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

    /**
     * Get the user's preferred locale.
     */
    public function preferredLocale(): string
    {
        return $this->language;
    }

    /**
     * Saves a new language for the user.
     * Mostly used after login, or when swapping language.
     * Used for sending emails and other background processes.
     */
    public function updateLanguage(string $language): void {
        if (!in_array($language, GooglePlaces::SUPPORTED_LANGUAGES)) {
            Log::error('User: Update language: Unsupported language', ['language' => $language]);
            return;
        }
        $this->language = $language;
        $this->save();
        Log::debug('User: Update language: Success', ['language' => $language]);
    }
}
