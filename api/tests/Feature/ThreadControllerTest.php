<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ThreadControllerTest extends TestCase
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
     * Create a thread with invalid data
     */
    public function test_thread_create_invalid_data(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $response = $this->postJson('/threads');
        $response->assertStatus(422);
    }

    /**
     * Create a thread
     */
    public function test_thread_create(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $initialCount = Thread::where(['user_id_receiver' => $user->id])->count();
        $item = Item::inRandomOrder()->first();
        $response = $this->postJson('/threads', ['item' => $item->id, 'message' => $this->faker->sentence()]);
        $response->assertStatus(200);
        $afterCount = Thread::where(['user_id_receiver' => $user->id])->count();
        $this->assertEquals($initialCount + 1, $afterCount);
    }
}
