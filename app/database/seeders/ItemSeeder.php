<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\Item;
use App\Models\Location;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Item::truncate();

        $faker = \Faker\Factory::create();
        $users = User::inRandomOrder()->get();

        for ($i = 0; $i < 10; $i++) {
            $images = [];
            for ($j = 0; $j < $faker->numberBetween(1, 10); $j++) {
                $image = new Image([
                    'mimeType' => $faker->mimeType(),
                    'name' => $faker->word(),
                    'sizeBytes' => $faker->numberBetween(),
                    'url' => $faker->imageUrl(),
                ]);
                array_push($images, $image);
            }
            $location = Location::inRandomOrder()->first();
            $tags = Tag::inRandomOrder()->limit(2)->get();
            $user = $users[2 - ($i % 3)];
            $item = Item::create([
                'name' => $faker->words($faker->numberBetween(1, 5), true),
                'description' => $faker->paragraph(2),
            ]);
            $item->location()->associate($location);
            $item->images()->saveMany($images);
            $item->tags()->attach($tags);
            $item->user()->associate($user);
            $item->save();
        }
    }
}
