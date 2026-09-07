<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandingPageSetting extends Model
{
    use HasFactory;

    public const DEFAULT_HERO_BACKGROUND = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80';
    public const DEFAULT_SCHEDULE_BACKGROUND = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80';
    public const DEFAULT_CLASSES_BACKGROUND = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80';
    public const DEFAULT_STUDIO_LOGO = null;

    protected $fillable = [
        'studio_name',
        'hero_background_image',
        'schedule_background_image',
        'classes_background_image',
        'studio_logo_image',
        'email',
        'phone',
        'address',
        'operational_hours',
        'whatsapp_number',
        'embed_maps',
        'instagram_url',
        'tiktok_url',
    ];

    public static function defaultAttributes(): array
    {
        return [
            'studio_name' => 'ORO Pilates Studio',
            'hero_background_image' => self::DEFAULT_HERO_BACKGROUND,
            'schedule_background_image' => self::DEFAULT_SCHEDULE_BACKGROUND,
            'classes_background_image' => self::DEFAULT_CLASSES_BACKGROUND,
            'studio_logo_image' => self::DEFAULT_STUDIO_LOGO,
            'email' => 'oropadeltegal@gmail.com',
            'phone' => '628213003567',
            'address' => 'Jl. Layur No. 08, Tegalsari, Kec. Tegal Barat, Kota Tegal, Jawa Tengah 52111',
            'operational_hours' => 'Senin - Sabtu, 07:00 - 19:00 WIB (Public Holiday Closed)',
            'whatsapp_number' => '628213003567',
            'embed_maps' => 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d247.57918158921566!2d109.1340997!3d-6.8585801!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb7beb29c510d%3A0x668f24c80b9bc7fc!2sORO%20Pilates%20Studio!5e0!3m2!1sid!2ssg!4v1778299454810!5m2!1sid!2ssg',
            'instagram_url' => 'https://www.instagram.com/orostudio.tegal/',
            'tiktok_url' => 'https://www.tiktok.com/@oropilatesstudio',
        ];
    }
}
