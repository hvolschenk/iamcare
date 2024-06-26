<?php

namespace Tests\Feature;

use App\Http\Resources\ThreadResource;
use App\Mail\ThreadCreated;
use App\Mail\ThreadReplied;
use App\Models\Item;
use App\Models\Location;
use App\Models\Thread;
use App\Models\User;
use App\Services\GooglePlaces;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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
        $this->mock(GooglePlaces::class, function ($mock) {
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
            $mock
                ->shouldReceive('placeDetails')
                ->andReturn(['result' => $googlePlace]);
        });
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
        Mail::fake();
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $initialCount = Thread::where(['user_id_receiver' => $user->id])->count();
        $item = Item::inRandomOrder()->first();
        $location = Location::find($item->location_id);
        $response = $this->postJson(
            '/threads',
            ['item' => $item->id, 'message' => $this->faker->sentence()],
            ['Accept-Language' => $location->language],
        );
        $response->assertStatus(200);
        $afterCount = Thread::where(['user_id_receiver' => $user->id])->count();
        $this->assertEquals($initialCount + 1, $afterCount);
        Mail::assertSent(ThreadCreated::class);
    }

    /**
     * Reply to an existing thread
     */
    public function test_reply_to_thread(): void
    {
        Mail::fake();
        $thread = Thread::with(['item.images', 'item.location', 'messages.user', 'userGiver', 'userReceiver'])
            ->inRandomOrder()
            ->first();
        $user = $thread->userReceiver;
        $this->actingAs($user);
        $response = $this->postJson(
            "/threads/{$thread->id}/reply",
            ['message' => $this->faker->sentence()],
            ['Accept-Language' => $thread->item->location->language],
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

        Mail::assertSent(ThreadReplied::class);
    }

    /**
     * View a single thread
     */
    public function test_view_thread(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $thread = Thread::with(['item', 'item.location', 'messages.user', 'userGiver', 'userReceiver'])
            ->where(['user_id_giver' => $user->id])
            ->inRandomOrder()
            ->first();
        $resource = new ThreadResource($thread);
        $response = $this->getJson("/threads/{$thread->id}", ['Accept-Language' => $thread->item->location->language]);
        $request = Request::create("/threads/{$thread->id}", 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }

    /**
     * Mark a thread as read
     */
    public function test_mark_as_read(): void
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $thread = Thread::with(['messages'])
            ->where(['user_id_giver' => $user->id])
            ->inRandomOrder()
            ->first();
        $messagesUnread = $thread->messages->filter(function ($message) {
            return $message->is_read === false;
        })->all();
        $messagesCountBefore = count($messagesUnread);
        $response = $this->postJson("/threads/{$thread->id}/mark-as-read");
        $response->assertStatus(204);
        $threadUpdated = Thread::with(['messages'])->find($thread->id);
        $messagesRead = $threadUpdated->messages->filter(function ($message) {
            return $message->is_read === true;
        })->all();
        $messagesCountAfter = count($messagesRead);
        $this->assertEquals($messagesCountBefore, $messagesCountAfter);
    }

    /**
     * Shows the amount of threads with unread messages
     */
    public function test_unread_threads_count()
    {
        $user = User::inRandomOrder()->first();
        $this->actingAs($user);
        $unreadThreadCount = Thread::distinct('threads.id')
            ->join('messages', 'threads.id', '=', 'messages.thread_id')
            ->where(function (Builder $query) use ($user) {
                $query
                    ->where('user_id_giver', $user->id)
                    ->orWhere('user_id_receiver', $user->id);
            })
            ->where('messages.user_id', '<>', $user->id)
            ->where('messages.is_read', false)
            ->count('threads.id');
        $response = $this->getJson("/threads/unread");
        $response
            ->assertStatus(200)
            ->assertJson(['unreadThreads' => $unreadThreadCount]);
    }
}
