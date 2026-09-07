<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\LandingPageSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessProfileController extends Controller
{
    public function edit()
    {
        $setting = LandingPageSetting::firstOrCreate([], LandingPageSetting::defaultAttributes());

        return Inertia::render('Dashboard/Settings/BusinessProfile', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'studio_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'operational_hours' => 'nullable|string',
            'whatsapp_number' => 'nullable|string|max:50',
            'embed_maps' => 'nullable|string',
            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
        ]);

        $setting = LandingPageSetting::firstOrCreate([], LandingPageSetting::defaultAttributes());
        
        $embedMaps = $request->embed_maps;
        if (str_contains($embedMaps, '<iframe')) {
            if (preg_match('/src="([^"]+)"/', $embedMaps, $matches)) {
                $embedMaps = $matches[1];
            }
        }

        $setting->update([
            'studio_name' => $request->studio_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'operational_hours' => $request->operational_hours,
            'whatsapp_number' => $request->whatsapp_number,
            'embed_maps' => $embedMaps,
            'instagram_url' => $request->instagram_url,
            'tiktok_url' => $request->tiktok_url,
        ]);

        return back()->with('success', 'Profile Bisnis berhasil diperbarui.');
    }
}
