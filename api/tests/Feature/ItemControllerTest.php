<?php

namespace Tests\Feature;

use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Models\Location;
use App\Models\Tag;
use App\Models\User;
use App\Services\GooglePlaces;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Request;
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
    public function test_create_validation_failed(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $response = $this->postJson('/items', []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['description', 'location', 'name', 'tag']);
    }

    /**
     * When validation passes, but something goes wrong during processing the request
     */
    public function test_create_server_error(): void
    {
        Storage::fake('public');
        $this->mock(GooglePlaces::class, function ($mock) {
            $mock
                ->shouldReceive('placeDetails')
                ->once()
                ->andThrow(new \Exception('Could not get place details'));
        });
        $image = UploadedFile::fake()->image("{$this->faker->word()}.jpg");
        $tag = Tag::inRandomOrder()->first();
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $response = $this->postJson(
            '/items',
            [
                'description' => $this->faker->sentence(),
                'image' => [$image],
                'location' => strval($this->faker->randomNumber(4, true)),
                'name' => $this->faker->word(),
                'tag' => [$tag->id],
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
    public function test_create_success()
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
        $tag = Tag::inRandomOrder()->first();
        $user = User::inRandomOrder()->first();
        $values = [
            'description' => $this->faker->sentence(),
            'image' => [$image1, $image2],
            'location' => strval($this->faker->randomNumber(4, true)),
            'name' => $this->faker->word(),
            'tag' => [$tag->id],
        ];

        $this->actingAs($user);
        $response = $this->postJson('/items', $values);
        $request = Request::create('/items', 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        $insertID = $response->decodeResponseJson()['id'];
        $item = Item::with(['location', 'images', 'tags', 'user'])->find($insertID);
        $resource = new ItemResource($item);
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

    /**
     * When a user tries to mark an item given
     * but the item belongs to another user
     */
    public function test_mark_as_given_unauthorized()
    {
        $item = Item::inRandomOrder()->first();
        $user = User::whereNot('id', $item->user_id)->first();
        $this->actingAs($user);
        $response = $this->postJson("/items/{$item->id}/mark-as-given");
        $response->assertStatus(403);
    }

    /**
     * Marking an item as given
     */
    public function test_mark_as_given()
    {
        $item = Item::inRandomOrder()->first();
        $user = User::find($item->user_id);
        $this->actingAs($user);
        $response = $this->postJson("/items/{$item->id}/mark-as-given");
        $response->assertStatus(200);
        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'is_given' => true,
        ]);
    }

    /**
     * When the item cannot be deleted,
     * as only the owner can delete an item.
     */
    public function test_delete_unauthorized()
    {
        $item = Item::inRandomOrder()->first();
        $user = User::whereNot('id', $item->user_id)->first();
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
        $item = Item::inRandomOrder()->with(['location', 'images', 'tags', 'user'])->first();
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
            ["Accept-Language" => $location->language],
        );

        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(1, count($response->json('data')));
    }

    /**
     * When trying to update an item that does not belong to you
     */
    public function test_update_not_owned(): void
    {
        $item = Item::inRandomOrder()->with(['user'])->first();
        $user = User::inRandomOrder()->first();
        while ($user->id === $item->user_id) {
            $user = User::inRandomOrder()->first();
        }
        $this->actingAs($user);

        $response = $this->putJson("/items/{$item->id}", []);
        $response->assertStatus(403);
    }

    /**
     * When validation of the POSTed fields fails
     */
    public function test_update_validation_failed(): void
    {
        $item = Item::inRandomOrder()->with(['user'])->first();
        $this->actingAs($item->user);
        $response = $this->putJson("/items/{$item->id}", []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['description', 'location', 'name', 'tag']);
    }

    /**
     * When validatin fails because all images are deleted.
     * This validation is tested in isolation
     * as it is a special case which is manually checked.
     */
    public function test_update_validation_failed_all_images_deleted(): void
    {
        $item = Item::inRandomOrder()->with(['images', 'user'])->first();
        $this->actingAs($item->user);
        $response = $this->putJson(
            "/items/{$item->id}",
            [
                'description' => $this->faker->sentence(),
                'image' => [],
                'location' => strval($this->faker->randomNumber(4, true)),
                'name' => $this->faker->word(),
                'tag' => array_map(function ($tag) {
                    return $tag->id;
                }, $item->tags->all()),
                'removeImage' => array_map(function ($image) {
                    return $image->id;
                }, $item->images->all()),
            ],
        );
        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }

    /**
     * When validation passes, but something goes wrong during processing the request
     */
    public function test_update_server_error(): void
    {
        Storage::fake('public');
        $this->mock(GooglePlaces::class, function ($mock) {
            $mock
                ->shouldReceive('placeDetails')
                ->once()
                ->andThrow(new \Exception('Could not get place details'));
        });
        $image = UploadedFile::fake()->image("{$this->faker->word()}.jpg");
        $tag = Tag::inRandomOrder()->first();
        $item = Item::inRandomOrder()->with(['user'])->first();
        $this->actingAs($item->user);
        $response = $this->putJson(
            "/items/{$item->id}",
            [
                'description' => $this->faker->sentence(),
                'image' => [$image],
                'location' => strval($this->faker->randomNumber(4, true)),
                'name' => $this->faker->word(),
                'tag' => [$tag->id],
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
    public function test_update_success()
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
        $tag = Tag::inRandomOrder()->first();
        $values = [
            'description' => $this->faker->sentence(),
            'image' => [$image1, $image2],
            'location' => strval($this->faker->randomNumber(4, true)),
            'name' => $this->faker->word(),
            'tag' => [$tag->id],
        ];

        $item = Item::inRandomOrder()->with(['user'])->first();
        $user = $item->user;
        $this->actingAs($user);

        $response = $this->putJson("/items/{$item->id}", $values);
        $request = Request::create("/items/{$item->id}", 'PUT');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        $item = Item::with(['location', 'images', 'tags', 'user'])->find($item->id);
        $resource = new ItemResource($item);
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }
}
