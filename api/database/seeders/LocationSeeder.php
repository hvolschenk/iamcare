<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Services\GooglePlaces;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Location::truncate();

        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 10; $i++) {
            Location::create([
                'address' => $faker->streetName(),
                'googlePlaceID' => $faker->uuid(),
                'language' => $faker->randomElement(GooglePlaces::SUPPORTED_LANGUAGES),
                'latitude' => $faker->latitude(-90, 90),
                'longitude' => $faker->longitude(-90, 90),
                'name' => $faker->word(),
                'utcOffset' => strval($faker->numberBetween(0, 780)),
            ]);
        }
    }
}
