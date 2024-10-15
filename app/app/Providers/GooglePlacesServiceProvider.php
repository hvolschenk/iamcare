<?php

namespace App\Providers;

use App\Services\GooglePlaces;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class GooglePlacesServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(GooglePlaces::class, function () {
            return new GooglePlaces();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [GooglePlaces::class];
    }
}
