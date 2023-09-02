<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;

    /**
     * Fetches the list of categories from the databse
     */
    public function test_list_categories(): void
    {
        $resource = CategoryResource::collection(Category::all());
        $response = $this->get('/categories');
        $request = Request::create('/categories', 'GET');
        $response
            ->assertStatus(200)
            ->assertJson($resource->response($request)->getData(true));
    }
}
