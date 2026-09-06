<?php

namespace App\Http\Controllers;

use App\Models\BusinessProfileSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessProfileSettingController extends Controller
{
    public function edit()
    {
        $setting = BusinessProfileSetting::firstOrCreate([], BusinessProfileSetting::defaultAttributes());
        return Inertia::render('Dashboard/Settings/BusinessProfile', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'operational_hours' => 'nullable|string',
        ]);

        $setting = BusinessProfileSetting::firstOrCreate([], BusinessProfileSetting::defaultAttributes());
        $setting->update($validated);

        return back()->with('success', 'Profile bisnis berhasil diperbarui.');
    }
}
