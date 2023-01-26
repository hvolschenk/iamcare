<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Indicates whether the default seeder should run before each test.
     *
     * @var bool
     */
    protected $seed = true;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->getJson('/articles');

        $response->assertStatus(200);

        $response->assertJson(fn (AssertableJson $json) =>
            $json
                ->has(50)
                ->first(fn (AssertableJson $firstJson) =>
                    $firstJson
                        ->hasAll(['body', 'title'])
                        ->whereType('body', 'string')
                        ->whereType('title', 'string')
                        ->etc()
                )
        );
    }
}
