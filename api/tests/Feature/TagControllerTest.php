<?php

namespace Tests\Feature;

use App\Models\Tag;
use App\Http\Resources\TagResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class TagControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;

    /**
     * Fetches the list of tags from the databse
     */
    public function test_list_tags(): void
    {
        $resource = TagResource::collection(Tag::all());
        $response = $this->get('/tags');
        $request = Request::create('/tags', 'GET');
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }
}
