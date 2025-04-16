<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('authentication_methods', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('type');
            $table->string('provider_id')->index();
            $table->string('email');
            $table->string('name');
            $table->mediumText('avatar')->nullable();
            $table->foreignIdFor(User::class);
            $table->boolean('is_primary');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('authentication_methods');
    }
};
