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
        Schema::table('landing_page_settings', function (Blueprint $table) {
            $table->string('whatsapp_number')->nullable();
            $table->text('embed_maps')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('landing_page_settings', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_number', 'embed_maps', 'instagram_url', 'tiktok_url']);
        });
    }
};
