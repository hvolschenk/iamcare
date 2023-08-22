<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\Location;
use App\Models\User;
use App\Services\GooglePlaces;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ItemControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;

    /**
     * When validation of the POSTed fields fails
     */
    public function test_validation_failed(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $response = $this->postJson('/items', []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['category', 'description', 'location', 'name']);
    }

    /**
     * When validation passes, but something goes wrong during processing the request
     */
    public function test_server_error(): void
    {
        Storage::fake('public');
        $this->mock(GooglePlaces::class, function ($mock) {
            $mock
                ->shouldReceive('placeDetails')
                ->once()
                ->andThrow(new \Exception('Could not get place details'));
        });
        $image = UploadedFile::fake()->image("{$this->faker->word()}.jpg");

        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $response = $this->postJson(
            '/items',
            [
                'category' => $this->faker->word(),
                'description' => $this->faker->sentence(),
                'image' => [$image],
                'location' => strval($this->faker->randomNumber(4, true)),
                'name' => $this->faker->word(),
            ],
        );

        $response->assertStatus(500);
        /** @var $disk \Illuminate\Filesystem\FilesystemAdapter */
        $disk = Storage::disk('public');
        $disk->assertMissing($disk->url($image->hashName()));
    }

    /**
     * When the request goes through successfully
     */
    public function test_success()
    {
        Storage::fake('public');
        /** @var $disk \Illuminate\Filesystem\FilesystemAdapter */
        $disk = Storage::disk('public');
        $googlePlace = [
            'formatted_address' => str_replace("\n", ' ', $this->faker->address()),
            'place_id' => (string)$this->faker->randomNumber(5),
            'geometry' => [
                'location' => [
                    'lat' => $this->faker->latitude(),
                    'lng' => $this->faker->longitude(),
                ],
            ],
            'name' => $this->faker->city(),
            'utc_offset' => (string)$this->faker->randomNumber(3, true),
        ];
        $this->mock(GooglePlaces::class, function ($mock) use ($googlePlace) {
            $mock
                ->shouldReceive('placeDetails')
                ->once()
                ->andReturn(['result' => $googlePlace]);
        });
        $image1 = UploadedFile::fake()->image("{$this->faker->word()}.jpg");
        $image2 = UploadedFile::fake()->image("{$this->faker->word()}.jpg");
        $user = User::inRandomOrder()->first();
        $values = [
            'category' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'image' => [$image1, $image2],
            'location' => strval($this->faker->randomNumber(4, true)),
            'name' => $this->faker->word(),
        ];

        $this->actingAs($user);
        $response = $this->postJson('/items', $values);

        $response
            ->assertStatus(200)
            ->assertJson([
                'category' => ['name' => $values['category']],
                'description' => $values['description'],
                'images' => [
                    [
                        'mimeType' => $image1->getMimeType(),
                        'name' => $image1->getBasename(),
                        'sizeBytes' => $image1->getSize(),
                        'url' => $disk->url("images/items/{$image1->hashName()}"),
                    ],
                    [
                        'mimeType' => $image2->getMimeType(),
                        'name' => $image2->getBasename(),
                        'sizeBytes' => $image2->getSize(),
                        'url' => $disk->url("images/items/{$image2->hashName()}"),
                    ]
                ],
                'location' => [
                    'address' => $googlePlace['formatted_address'],
                    'googlePlaceID' => $googlePlace['place_id'],
                    'language' => 'en',
                    'latitude' => $googlePlace['geometry']['location']['lat'],
                    'longitude' => $googlePlace['geometry']['location']['lng'],
                    'name' => $googlePlace['name'],
                    'utcOffset' => $googlePlace['utc_offset'],
                ],
                'name' => $values['name'],
                'user' => [
                    'avatar' => $user->avatar,
                    'email' => $user->email,
                    'name' => $user->name,
                ],
            ]);
    }

    /**
     * When the item cannot be deleted,
     * as only the owner can delete an item.
     */
    public function test_delete_unauthorized()
    {
        $item = Item::inRandomOrder()->first();
        $user = User::whereNot(function (Builder $query) use ($item) {
            $query->where('id', '=', $item->user_id);
        })->first();
        $this->actingAs($user);
        $response = $this->deleteJson("/items/{$item->id}");
        $response->assertStatus(403);
    }

    /**
     * When the item can be deleted
     * as the current user is the owner.
     */
    public function test_delete()
    {
        $item = Item::inRandomOrder()->with(['category', 'location', 'images', 'user'])->first();
        $this->actingAs($item->user);
        $response = $this->deleteJson("/items/{$item->id}");
        $response->assertStatus(204);
        $this->assertSoftDeleted('items', ['id' => $item->id]);
        foreach ($item->images as $image) {
            $this->assertSoftDeleted('images', ['id' => $image->id]);
        }
    }

    /**
     * When searching with no inputs given
     * This just returns all results available (paginated)
     */
    public function test_search_no_input()
    {
        $response = $this->getJson('/items/search');
        $response
            ->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    /**
     * When searching given all inputs
     * Filters the results to the inputs given
     */
    public function test_search_all_inputs()
    {
        $item = Item::inRandomOrder()->first();
        $location = Location::find($item->location_id);

        $response = $this->getJson(
            "/items/search?distance=50&location={$location->googlePlaceID}&query={$item->name}",
            [ "Accept-Language" => $location->language ],
        );

        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(1, count($response->json('data')));
    }
}
