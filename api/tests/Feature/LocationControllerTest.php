<?php

namespace Tests\Feature;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class LocationControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;

    /**
     * View a single location by id
     */
    public function test_show(): void
    {
        $location = Location::inRandomOrder()->first();
        $response = $this->getJson("/locations/{$location->id}");

        $resource = new LocationResource($location);
        $request = Request::create("/locations/{$location->id}", 'GET');

        $response
            ->assertStatus(200)
            ->assertJson($resource->toArray($request));
    }

    /**
     * View a location given it's Google Places ID
     */
    public function test_google(): void
    {
        $location = Location::inRandomOrder()->first();
        $this->app->setLocale($location->language);
        $response = $this->getJson(
            "/locations/google/{$location->googlePlaceID}",
            ["Accept-Language" => $location->language],
        );

        $resource = new LocationResource($location);
        $request = Request::create("/locations/{$location->id}", 'GET');

        $response
            ->assertStatus(200)
            ->assertJson($resource->toArray($request));
    }
}
