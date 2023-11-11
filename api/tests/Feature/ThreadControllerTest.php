<?php

namespace Tests\Feature;

use App\Http\Resources\ThreadResource;
use App\Models\Item;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Request;
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
     * Get all threads for a specific user
     */
    public function test_all_threads(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $response = $this->getJson('/threads');
        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(1, count($response->json('data')));
    }

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

    /**
     * Reply to an existing thread
     */
    public function test_reply_to_thread(): void
    {
        $thread = Thread::with(['item.images', 'messages.user', 'userGiver', 'userReceiver'])
            ->inRandomOrder()
            ->first();
        $user = $thread->userReceiver;
        $this->actingAs($user);
        $response = $this->postJson(
            "/threads/{$thread->id}/reply",
            ['message' => $this->faker->sentence()],
        );
        $updatedThread = Thread::with(['item.images', 'messages.user', 'userGiver', 'userReceiver'])
            ->find($thread->id);
        $resource = new ThreadResource($updatedThread);
        $request = Request::create("/threads/{$thread->id}/reply", 'POST');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

}
