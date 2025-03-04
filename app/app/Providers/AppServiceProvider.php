<?php

namespace App\Providers;

use App\View\Composers\AppBarComposer;
use App\View\Composers\ItemFormComposer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\View;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Http::macro('googlePlaces', function () {
            return Http::baseUrl('https://maps.googleapis.com/maps/api');
        });
        Paginator::defaultView('components.pagination');

        View::composer('components.layouts.base.app-bar', AppBarComposer::class);
        View::composer('components.item-form', ItemFormComposer::class);
    }
}
