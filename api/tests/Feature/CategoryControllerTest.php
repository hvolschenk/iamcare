<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
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
        $response = $this->get('/categories');

        $response->assertStatus(200);

        $response->assertJson(fn (AssertableJson $json) =>
            $json
                ->has(10)
                ->first(fn (AssertableJson $firstJson) =>
                    $firstJson
                        ->hasAll('name')
                        ->etc()
                )
        );
    }
}
