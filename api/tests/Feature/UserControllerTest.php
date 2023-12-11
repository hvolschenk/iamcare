<?php

namespace Tests\Feature;

use App\Http\Resources\UserResource;
use App\Mail\AccountCreated;
use Exception;
use App\Models\User as UserModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User;
use Tests\TestCase;

class UserControllerTest extends TestCase
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
     * Log in with an unsupported provider
     * The allowed providers are controlled through the route definition
     *
     * @return void
     */
    public function test_unsupported_provider()
    {
        $response = $this->postJson(
            '/users/authenticate/unsupported',
            ['accessToken' => 'ab702'],
            // This does not feel right.
            // If it is not here then the stateful middleware just falls over.
            ['origin' => 'http://localhost:7222'],
        );
        $response->assertStatus(404);
    }

    /**
     * Log in with Google
     * With a fresh account that is not in the database yet
     *
     * @return void
     */
    public function test_login_google()
    {
        Mail::fake();
        $user = new User();
        $user->map([
            'avatar' => $this->faker->imageUrl(),
            'email' => $this->faker->email(),
            'id' => $this->faker->unique()->numberBetween(1),
            'name' => $this->faker->name(),
        ]);
        Socialite::shouldReceive('driver->userFromToken')->andReturn($user);
        $response = $this->postJson(
            '/users/authenticate/google',
            ['accessToken' => 'ab702'],
            // This does not feel right.
            // If it is not here then the stateful middleware just falls over.
            ['origin' => 'http://localhost:7222'],
        );

        $this->assertDatabaseHas('users', [
            'email' => $user->email,
        ]);
        $this->assertDatabaseHas('authentication_methods', [
            'is_primary' => 1,
            'type' => 'google',
            'user_id' => $response->baseResponse->original->id
        ]);

        $response->assertStatus(200);
        Mail::assertSent(AccountCreated::class);
    }

    /**
     * Log in with Google
     * With an existing account with a pre-existing different login method
     *
     * @return void
     */
    public function test_login_google_secondary()
    {
        $user = new User();
        $user->map([
            'avatar' => $this->faker->imageUrl(),
            'email' => $this->faker->email(),
            'id' => $this->faker->unique()->numberBetween(1),
            'name' => $this->faker->name(),
        ]);

        $existingUser = UserModel::create([
            'avatar' => $user->avatar . 'ORIGINAL',
            'email' => $user->email,
            'name' => $user->name . 'ORIGINAL',
        ]);
        $existingUser->authenticationMethods()->create([
            'avatar' => $user->avatar,
            'email' => $user->email,
            'is_primary' => 1,
            'name' => $user->name,
            'provider_id' => $this->faker->unique()->numberBetween(1),
            'type' => 'github',
        ]);

        Socialite::shouldReceive('driver->userFromToken')->andReturn($user);
        $response = $this->postJson(
            '/users/authenticate/google',
            ['accessToken' => 'ab702'],
            // This does not feel right.
            // If it is not here then the stateful middleware just falls over.
            ['origin' => 'http://localhost:7222'],
        );

        $this->assertDatabaseHas('users', [
            'avatar' => $user->avatar . 'ORIGINAL',
            'email' => $user->email,
            'name' => $user->name . 'ORIGINAL',
        ]);
        $this->assertDatabaseHas(
            'authentication_methods',
            [
                'avatar' => $user->avatar,
                'is_primary' => 0,
                'name' => $user->name,
                'type' => 'google',
                'user_id' => $response->baseResponse->original->id
            ],
        );
        $response->assertStatus(200);
    }

    /**
     * Log in with Google
     * With an authentication method that is the current primary
     */
    public function test_login_google_primary_again()
    {
        $user = new User();
        $user->map([
            'avatar' => $this->faker->imageUrl(),
            'email' => $this->faker->email(),
            'id' => $this->faker->unique()->numberBetween(1),
            'name' => $this->faker->name(),
        ]);
        $existingUser = UserModel::create([
            'avatar' => $user->avatar . 'ORIGINAL',
            'email' => $user->email,
            'name' => $user->name . 'ORIGINAL',
        ]);
        $existingUser->authenticationMethods()->create([
            'avatar' => $user->avatar . 'ORIGINAL',
            'email' => $user->email,
            'is_primary' => 1,
            'name' => $user->name . 'ORIGINAL',
            'provider_id' => $this->faker->unique()->numberBetween(1),
            'type' => 'google',
        ]);

        Socialite::shouldReceive('driver->userFromToken')->andReturn($user);
        $response = $this->postJson(
            '/users/authenticate/google',
            ['accessToken' => 'ab702'],
            // This does not feel right.
            // If it is not here then the stateful middleware just falls over.
            ['origin' => 'http://localhost:7222'],
        );

        $this->assertDatabaseHas('users', [
            'avatar' => $user->avatar,
            'email' => $user->email,
            'name' => $user->name,
        ]);
        $this->assertDatabaseHas(
            'authentication_methods',
            [
                'avatar' => $user->avatar,
                'is_primary' => 1,
                'name' => $user->name,
                'type' => 'google',
                'user_id' => $response->baseResponse->original->id
            ],
        );
        $response->assertStatus(200);
    }

    /**
     * Log in with Google
     * With a failure in parsing/getting the token
     *
     * @return void
     */
    public function test_login_google_failure()
    {
        $exception = new Exception('Failed to get user from provider');
        Socialite::shouldReceive('driver->userFromToken')->andThrow($exception);
        $response = $this->postJson(
            '/users/authenticate/google',
            ['accessToken' => 'ab702'],
            // This does not feel right.
            // If it is not here then the stateful middleware just falls over.
            ['origin' => 'http://localhost:7222'],
        );
        $response->assertStatus(500);
    }

    /**
     * Get the current user when not logged-in.
     *
     * @return void
     */
    public function test_get_me_not_logged_in()
    {
        $response = $this->getJson('/users/me');
        $response->assertStatus(204);
    }

    /**
     * Get the current user when logged-in.
     *
     * @return void
     */
    public function test_get_me_logged_in()
    {
        $user = UserModel::inRandomOrder()->first();
        $this->actingAs($user);
        $resource = new UserResource($user);
        $response = $this->getJson('/users/me');
        $request = Request::create('/users/me', 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

    /**
     * Get a user profile when not logged in.
     *
     * @return void
     */
    public function test_get_user_profile_not_logged_in()
    {
        $user = UserModel::inRandomOrder()->first();
        $resource = new UserResource($user);
        $response = $this->getJson("/users/{$user->id}");
        $request = Request::create("/users/{$user->id}", 'GET');
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

    /**
     * Get a user profile when logged in as a different user.
     *
     * @return void
     */
    public function test_get_user_profile_logged_in_as_other()
    {
        $users = UserModel::inRandomOrder()->get();
        $user = $users[0];
        $loggedInUser = $users[1];
        $this->actingAs($loggedInUser);
        $resource = new UserResource($user);
        $response = $this->getJson("/users/{$user->id}");
        $request = Request::create("/users/{$user->id}", 'GET');
        $request->setUserResolver(function () use ($loggedInUser) {
            return $loggedInUser;
        });
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

    /**
     * Get a user profile when logged in as a different user.
     *
     * @return void
     */
    public function test_get_user_profile_logged_in_as_user()
    {
        $user = UserModel::inRandomOrder()->first();
        $this->actingAs($user);
        $resource = new UserResource($user);
        $response = $this->getJson("/users/{$user->id}");
        $request = Request::create("/users/{$user->id}", 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

    /**
     * Get the items for a specific user
     *
     * @return void
     */
    public function test_user_items()
    {
        $user = UserModel::inRandomOrder()->with(['items'])->first();
        $response = $this->getJson("/users/{$user->id}/items");
        $response->assertStatus(200);
        $response->assertJsonCount(count($user->items->toArray()), 'data');
    }
}
