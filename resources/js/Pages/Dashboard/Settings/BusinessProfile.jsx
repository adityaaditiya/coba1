import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Input from "@/Components/Dashboard/Input";
import { IconDeviceFloppy, IconBuildingStore } from "@tabler/icons-react";

export default function BusinessProfile({ setting }) {

    const { data, setData, post, processing, errors } = useForm({
        studio_name: setting?.studio_name || "",
        email: setting?.email || "",
        phone: setting?.phone || "",
        address: setting?.address || "",
        operational_hours: setting?.operational_hours || "",
        whatsapp_number: setting?.whatsapp_number || "",
        embed_maps: setting?.embed_maps || "",
        instagram_url: setting?.instagram_url || "",
        tiktok_url: setting?.tiktok_url || "",
        _method: "PUT",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("settings.business-profile.update"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Kelola Profile Bisnis" />

            <div className="mb-6">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                    <IconBuildingStore size={28} className="text-primary-500" />
                    Profile Bisnis
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                    Atur nama profile bisnis atau studio Anda beserta kontak, alamat, sosial media, dan jam operasional.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="grid gap-6">
                        <div>
                            <Input
                                type="text"
                                label="Nama Studio / Bisnis"
                                value={data.studio_name}
                                onChange={(event) => setData("studio_name", event.target.value)}
                                errors={errors?.studio_name}
                                placeholder="Masukkan nama bisnis..."
                            />
                        </div>
                        <div>
                            <Input
                                type="email"
                                label="Email"
                                value={data.email}
                                onChange={(event) => setData("email", event.target.value)}
                                errors={errors?.email}
                                placeholder="nama@email.com"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                label="Nomor Telepon"
                                value={data.phone}
                                onChange={(event) => setData("phone", event.target.value)}
                                errors={errors?.phone}
                                placeholder="Contoh: 628213003567"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                label="Alamat / Lokasi"
                                value={data.address}
                                onChange={(event) => setData("address", event.target.value)}
                                errors={errors?.address}
                                placeholder="Masukkan alamat lengkap..."
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                label="Jam Operasional"
                                value={data.operational_hours}
                                onChange={(event) => setData("operational_hours", event.target.value)}
                                errors={errors?.operational_hours}
                                placeholder="Contoh: Senin - Sabtu, 07:00 - 19:00 WIB"
                            />
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-2">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Kontak Ekstra & Sosial Media</h3>
                        </div>
                        <div>
                            <Input
                                type="text"
                                label="Nomor WhatsApp"
                                value={data.whatsapp_number}
                                onChange={(event) => setData("whatsapp_number", event.target.value)}
                                errors={errors?.whatsapp_number}
                                placeholder="Contoh: 08213003567 (hanya angka)"
                            />
                        </div>
                        <div>
                            <Input
                                type="url"
                                label="Link Instagram"
                                value={data.instagram_url}
                                onChange={(event) => setData("instagram_url", event.target.value)}
                                errors={errors?.instagram_url}
                                placeholder="https://www.instagram.com/..."
                            />
                        </div>
                        <div>
                            <Input
                                type="url"
                                label="Link TikTok"
                                value={data.tiktok_url}
                                onChange={(event) => setData("tiktok_url", event.target.value)}
                                errors={errors?.tiktok_url}
                                placeholder="https://www.tiktok.com/@..."
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Embed Google Maps (URL / Iframe)</label>
                            <textarea
                                className={`w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 min-h-[120px] ${errors?.embed_maps ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : ""}`}
                                value={data.embed_maps}
                                onChange={(event) => setData("embed_maps", event.target.value)}
                                placeholder='Masukkan Link Google Maps atau tag <iframe src="..."></iframe>'
                            />
                            {errors?.embed_maps && (
                                <small className="text-xs text-danger-500 dark:text-danger-400 block mt-2">
                                    {errors.embed_maps}
                                </small>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-start">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <IconDeviceFloppy size={18} />
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </>
    );
}

BusinessProfile.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
