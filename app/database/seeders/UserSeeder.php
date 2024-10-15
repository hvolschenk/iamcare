<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();

        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 3; $i++) {
            User::create([
                'avatar' => $faker->imageUrl(),
                'email' => $faker->email(),
                'name' => $faker->name(),
            ]);
        }
    }
}
