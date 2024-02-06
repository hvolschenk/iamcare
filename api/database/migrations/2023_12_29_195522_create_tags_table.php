<?php

use App\Models\Tag;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('title');
        });

        Schema::create('taggables', function (Blueprint $table) {
            $table->foreignIdFor(Tag::class);
            $table->morphs('taggable');
        });

        Tag::create(['title' => 'accessories']);
        Tag::create(['title' => 'appliances']);
        Tag::create(['title' => 'art']);
        Tag::create(['title' => 'beauty']);
        Tag::create(['title' => 'books']);
        Tag::create(['title' => 'camping']);
        Tag::create(['title' => 'collectibles']);
        Tag::create(['title' => 'decor']);
        Tag::create(['title' => 'diy']);
        Tag::create(['title' => 'electronics']);
        Tag::create(['title' => 'fashion']);
        Tag::create(['title' => 'fitness']);
        Tag::create(['title' => 'food']);
        Tag::create(['title' => 'gadgets']);
        Tag::create(['title' => 'gaming']);
        Tag::create(['title' => 'gifts']);
        Tag::create(['title' => 'handmade']);
        Tag::create(['title' => 'health']);
        Tag::create(['title' => 'hobbies']);
        Tag::create(['title' => 'jewelry']);
        Tag::create(['title' => 'kids']);
        Tag::create(['title' => 'kitchen']);
        Tag::create(['title' => 'learning']);
        Tag::create(['title' => 'movies']);
        Tag::create(['title' => 'music']);
        Tag::create(['title' => 'outdoor']);
        Tag::create(['title' => 'party']);
        Tag::create(['title' => 'pets']);
        Tag::create(['title' => 'photography']);
        Tag::create(['title' => 'plants']);
        Tag::create(['title' => 'smarthome']);
        Tag::create(['title' => 'sports']);
        Tag::create(['title' => 'stationery']);
        Tag::create(['title' => 'sustainable']);
        Tag::create(['title' => 'technology']);
        Tag::create(['title' => 'television']);
        Tag::create(['title' => 'travel']);
        Tag::create(['title' => 'vintage']);
        Tag::create(['title' => 'wellness']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
        Schema::dropIfExists('taggables');
    }
};
