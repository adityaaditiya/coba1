import { Head, Link, router } from "@inertiajs/react";
import Navbar from "@/Components/Landing/Navbar";
import {
    IconCalendarEvent,
    IconClockHour4,
    IconCreditCard,
    IconReceipt2,
    IconSparkles,
} from "@tabler/icons-react";

const formatDate = (date) =>
    date
        ? new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          }).format(new Date(date))
        : "-";

const statusClass = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "active") return "bg-emerald-50 text-emerald-700";
    if (value === "expired") return "bg-slate-100 text-slate-700";
    if (value === "pending_payment") return "bg-blue-50 text-blue-700";
    if (value === "pending") return "bg-amber-50 text-amber-700";
    if (value === "cancelled") return "bg-rose-50 text-rose-700";

    return "bg-amber-50 text-amber-700";
};

const applyFilters = (filters) => {
    router.get(route("user.my-memberships"), filters, {
        preserveState: true,
        replace: true,
    });
};

export default function MyMemberships({ memberships = [], filters = {} }) {
    const handleFilterChange = (key, value) => {
        applyFilters({
            ...filters,
            [key]: value,
        });
    };

    const resetFilters = () => {
        applyFilters({
            start_date: "",
            end_date: "",
            status: "",
        });
    };

    const cancelTransaction = (membershipId) => {
        if (!window.confirm("Batalkan transaksi membership ini?")) return;

        router.delete(route("welcome.membership-checkout.cancel-transaction", membershipId), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="My Memberships" />

            <div className="min-h-screen bg-[#f5f2eb] text-slate-800">
                <Navbar currentKey={null} />

                <section className="mx-auto max-w-6xl px-4 py-10">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-3xl font-bold text-[#4a3b32] md:text-4xl">My Memberships</h1>
                            <p className="mt-2 text-sm text-slate-500">Riwayat langganan membership Anda.</p>
                        </div>

                        <Link href={route("welcome.page", "pricing")} className="inline-flex rounded-full bg-[#8c6b4a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#73553a]">
                            Lihat Paket Membership
                        </Link>
                    </div>

                    <div className="mb-6 rounded-3xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur-md">
                        <div className="grid gap-4 md:grid-cols-4">
                            <label className="text-sm text-slate-600">
                                <span className="mb-1 block font-medium text-slate-700">Tanggal Mulai</span>
                                <input
                                    type="date"
                                    value={filters.start_date || ""}
                                    onChange={(event) => handleFilterChange("start_date", event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 focus:border-[#8c6b4a] focus:ring-[#8c6b4a]"
                                />
                            </label>
                            <label className="text-sm text-slate-600">
                                <span className="mb-1 block font-medium text-slate-700">Tanggal Akhir</span>
                                <input
                                    type="date"
                                    value={filters.end_date || ""}
                                    onChange={(event) => handleFilterChange("end_date", event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 focus:border-[#8c6b4a] focus:ring-[#8c6b4a]"
                                />
                            </label>
                            <label className="text-sm text-slate-600">
                                <span className="mb-1 block font-medium text-slate-700">Status</span>
                                <select
                                    value={filters.status || ""}
                                    onChange={(event) => handleFilterChange("status", event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 focus:border-[#8c6b4a] focus:ring-[#8c6b4a]"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="pending_payment">Pending Payment</option>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </label>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {memberships.length === 0 ? (
                        <div className="rounded-3xl border border-white bg-white p-8 text-center shadow-sm">
                            <p className="font-semibold text-slate-700">Belum ada membership aktif/riwayat.</p>
                            <p className="mt-2 text-sm text-slate-500">Silakan pilih paket membership yang sesuai kebutuhan Anda.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {memberships.map((item) => (
                                <article key={item.id} className="rounded-3xl border border-white bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8">
                                    
                                    {/* Bagian Kiri: Circular Progress Bar (Diperbesar & Tengah di Mobile) */}
                                    {(() => {
                                        const isActivePaid = ['active', 'paid'].includes((item.status || "").toLowerCase());
                                        const isNotCanceled = (item.status || "").toLowerCase() !== 'cancelled';
                                        
                                        if (isActivePaid && isNotCanceled) {
                                            const total = item.credits_total || 1;
                                            const remaining = item.credits_remaining || 0;
                                            const percentage = Math.round((remaining / total) * 100);
                                            
                                            const dashArray = 125.66;
                                            const dashOffset = dashArray - (percentage / 100) * dashArray;

                                            return (
                                                <div className="shrink-0 flex flex-col items-center justify-center w-full md:w-64 xl:w-[280px] border-b md:border-b-0 md:border-r border-slate-100 pb-6 mb-2 md:mb-0 md:pb-0 md:pr-8">
                                                    <div className="relative w-40 h-20 md:w-48 md:h-24 flex justify-center">
                                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                                                            <path
                                                                d="M 10 50 A 40 40 0 0 1 90 50"
                                                                fill="none"
                                                                stroke="#f1e9df"
                                                                strokeWidth="12"
                                                                strokeLinecap="round"
                                                            />
                                                            <path
                                                                d="M 10 50 A 40 40 0 0 1 90 50"
                                                                fill="none"
                                                                stroke="#b69566"
                                                                strokeWidth="12"
                                                                strokeLinecap="round"
                                                                strokeDasharray={dashArray}
                                                                strokeDashoffset={dashOffset}
                                                                className="transition-all duration-1000 ease-out"
                                                            />
                                                        </svg>
                                                        <div className="absolute bottom-0 left-0 w-full text-center flex flex-col items-center justify-end leading-none">
                                                            <span className="text-3xl md:text-4xl font-bold text-[#5c4738]">{percentage}%</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] md:text-xs uppercase font-bold text-[#8c6b4a] mt-3 md:mt-4 tracking-widest">Remaining</span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {/* Bagian Kanan: Informasi Card (Lebih Mendorong ke Kanan) */}
                                    <div className="flex-1 min-w-0 md:pl-2">
                                        
                                        {/* Badge Status */}
                                        <div className="mb-4 flex flex-wrap items-center gap-2 w-full">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f6f0] px-3 py-1.5 text-xs font-semibold text-[#8c6b4a] border border-[#e8dfcf]">
                                                <IconSparkles size={14} /> Membership #{item.id}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200">
                                                <IconReceipt2 size={14} /> {item.invoice || "-"}
                                            </span>
                                            <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize border ${statusClass(item.status)} border-current/20`}>
                                                {item.status || "pending"}
                                            </span>
                                        </div>

                                        {/* Judul Plan */}
                                        <h2 className="text-xl md:text-2xl font-bold text-[#4a3b32] uppercase tracking-wide mb-6">
                                            {item.plan_name || "Membership Plan"}
                                        </h2>

                                        {/* Detail Info Grid */}
                                        <div className="grid gap-y-5 gap-x-6 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                                            <div>
                                                <span className="block text-xs text-slate-400 mb-1">Credits</span>
                                                <p className="font-medium text-slate-700">
                                                    <span className="font-bold text-xl text-[#8c6b4a]">{item.credits_remaining}</span> / {item.credits_total}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400 mb-1">Payment Method</span>
                                                <p className="inline-flex items-center gap-1.5 font-medium">
                                                    <IconCreditCard size={18} className="text-slate-400" />
                                                    <span className="truncate">{item.payment_method || "-"}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400 mb-1">Start From</span>
                                                <p className="inline-flex items-start gap-1.5 font-medium line-clamp-2">
                                                    <IconCalendarEvent size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                                    <span>{formatDate(item.starts_at)}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-slate-400 mb-1">Membership Aktif Hingga</span>
                                                <p className="inline-flex items-start gap-1.5 font-medium line-clamp-2">
                                                    <IconClockHour4 size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                                    <span>{item.activated_at && item.expires_at ? formatDate(item.expires_at) : "Belum Teraktivasi"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                                            {item.payment_due_at &&
                                                !item.payment_proof_image_url &&
                                                ["pending", "pending_payment"].includes(item.status) && (
                                                    <p className="w-full text-sm text-rose-600 mb-2">
                                                        Batas upload bukti pembayaran:{" "}
                                                        <span className="font-bold">{formatDate(item.payment_due_at)}</span>
                                                    </p>
                                            )}

                                            {["pending", "pending_payment"].includes(item.status) && item.membership_plan_id && !item.payment_proof_image_url && (
                                                <Link
                                                    href={route("welcome.membership-checkout", {
                                                        membershipPlan: item.membership_plan_id,
                                                        membership_id: item.id,
                                                    })}
                                                    className="rounded-full bg-[#8c6b4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#73553a]"
                                                >
                                                    Upload Bukti Pembayaran
                                                </Link>
                                            )}
                                            {item.payment_proof_image_url && (
                                                <a
                                                    href={item.payment_proof_image_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full border border-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                                                >
                                                    Lihat Foto Bukti Pembayaran
                                                </a>
                                            )}
                                            {["pending", "pending_payment"].includes(item.status) && (
                                                <button
                                                    type="button"
                                                    onClick={() => cancelTransaction(item.id)}
                                                    className="rounded-full border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                                                >
                                                    Batalkan Transaksi
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}