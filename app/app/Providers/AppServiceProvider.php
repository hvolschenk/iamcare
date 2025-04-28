<?php

namespace App\Providers;

use App\Enums\AuthenticationProvider;
use App\Models\Image;
use App\Models\Item;
use App\Models\Thread;
use App\Models\User;
use App\Observers\ImageObserver;
use App\Observers\ItemObserver;
use App\Observers\ThreadObserver;
use App\Observers\UserObserver;
use App\View\Composers\AppBarComposer;
use App\View\Composers\ItemFormComposer;
use Illuminate\Support\Facades\Event;
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

        Image::observe(ImageObserver::class);
        Item::observe(ItemObserver::class);
        Thread::observe(ThreadObserver::class);
        User::observe(UserObserver::class);

        Paginator::defaultView('components.pagination');

        View::composer('components.layouts.base.app-bar', AppBarComposer::class);
        View::composer('components.item-form', ItemFormComposer::class);

        Event::listen(function (\SocialiteProviders\Manager\SocialiteWasCalled $event) {
            $event->extendSocialite(
                AuthenticationProvider::Microsoft->value,
                \SocialiteProviders\Microsoft\Provider::class,
            );
        });
    }
}
