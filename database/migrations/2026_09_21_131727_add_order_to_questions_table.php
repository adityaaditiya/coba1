<?php

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
        Schema::table('questions', function (Blueprint $table) {
            $table->unsignedInteger('order')->default(0)->after('options');
        });

        $questions = \Illuminate\Support\Facades\DB::table('questions')->orderBy('id')->get();
        foreach ($questions as $index => $q) {
            \Illuminate\Support\Facades\DB::table('questions')
                ->where('id', $q->id)
                ->update(['order' => $index + 1]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('order');
        });
    }
};
