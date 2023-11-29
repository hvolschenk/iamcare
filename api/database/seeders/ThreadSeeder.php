<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class ThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Thread::truncate();

        $faker = \Faker\Factory::create();
        $items = Item::with(['user'])->get();

        foreach ($items as $item) {
            $userGiver = $item->user;
            $userReceiver = User::inRandomOrder()->whereNot(function (Builder $query) use ($item) {
                $query->where('id', $item->user_id);
            })->first();

            $thread = new Thread();
            $thread->item()->associate($item);
            $thread->userGiver()->associate($userGiver);
            $thread->userReceiver()->associate($userReceiver);
            $thread->save();

            for ($j = 0; $j < $faker->numberBetween(1, 5); $j++) {
                $message = new Message([
                    'is_read' => false,
                    'message' => $faker->sentences($faker->numberBetween(1, 3), true),
                ]);
                $message->user()->associate($faker->randomElement([$userGiver, $userReceiver]));
                $message->save();
                $thread->messages()->save($message);
            }
        }
    }
}
