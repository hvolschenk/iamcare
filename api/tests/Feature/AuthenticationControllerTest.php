<?php

namespace Tests\Feature;

use Exception;
use App\Models\User as UserModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User;
use Tests\TestCase;

class AuthenticationControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * Log in with an unsupported provider
     * The allowed providers are controlled through the route definition
     *
     * @return void
     */
    public function test_unsupported_provider()
    {
        $response = $this->postJson(
            '/authenticate/unsupported',
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
        $user = new User();
        $user->map([
            'avatar' => $this->faker->imageUrl(),
            'email' => $this->faker->email(),
            'id' => $this->faker->unique()->numberBetween(1),
            'name' => $this->faker->name(),
        ]);
        Socialite::shouldReceive('driver->userFromToken')->andReturn($user);
        $response = $this->postJson(
            '/authenticate/google',
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
            '/authenticate/google',
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
            '/authenticate/google',
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
            '/authenticate/google',
            ['accessToken' => 'ab702'],
            // This does not feel right.
            // If it is not here then the stateful middleware just falls over.
            ['origin' => 'http://localhost:7222'],
        );
        $response->assertStatus(500);
    }
}
