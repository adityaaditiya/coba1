import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    IconArrowLeft,
    IconCalendar,
    IconCalendarCheck,
    IconCheck,
    IconClock,
    IconCreditCard,
    IconSparkles,
    IconUser,
    IconUsers,
    IconWallet,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

const imageUrl = (folder, file) => (file ? `/storage/${folder}/${file}` : null);

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

const formatDate = (date) =>
    date
        ? new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
          }).format(new Date(date))
        : "-";

const formatTime = (date) =>
    date
        ? new Intl.DateTimeFormat("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
          }).format(new Date(date))
        : "-";

export default function WelcomeSchedulePayment({
    schedule,
    paymentGateways = [],
    customerCredit = 0,
    availableMemberships = [],
    remainingSlots = 0,
    alreadyBooked = false,
}) {
    const { flash } = usePage().props;
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookingError, setBookingError] = useState(
        alreadyBooked ? "Anda sudah melakukan booking untuk sesi ini." : "",
    );

    const allowDropIn = schedule.allow_drop_in && paymentGateways.length > 0;

    const bestMembership = useMemo(() => {
        if (!availableMemberships.length) return null;
        return [...availableMemberships].sort(
            (a, b) =>
                Number(b.credits_remaining || 0) -
                Number(a.credits_remaining || 0),
        )[0];
    }, [availableMemberships]);

    const { data, setData, post, processing, errors } = useForm({
        payment_type: "credit",
        payment_method: paymentGateways[0]?.value ?? "",
        membership_id: "",
        participants: 1,
    });

    const selectedMembership = useMemo(() => {
        if (!data.membership_id) return null;
        return (
            availableMemberships.find(
                (membership) =>
                    String(membership.id) === String(data.membership_id),
            ) ?? null
        );
    }, [availableMemberships, data.membership_id]);

    useEffect(() => {
        if (!availableMemberships.length) {
            if (data.membership_id) setData("membership_id", "");
            return;
        }

        if (!data.membership_id) {
            setData(
                "membership_id",
                String(bestMembership?.id ?? availableMemberships[0].id),
            );
        }
    }, [availableMemberships, bestMembership, data.membership_id, setData]);

    useEffect(() => {
        if (alreadyBooked) {
            setBookingError("Anda sudah melakukan booking untuk sesi ini.");
        }
    }, [alreadyBooked]);

    const availableMethods = [
        {
            key: "credit",
            title: "Credits Membership",
            description:
                "Gunakan credits membership aktif Anda untuk booking sesi kelas ini.",
            hint: `${Number(bestMembership?.credit_cost ?? schedule.credit_override ?? 0)} credits / sesi`,
            icon: IconWallet,
        },
        ...(allowDropIn
            ? [
                  {
                      key: "drop_in",
                      title: "Drop-In Payment",
                      description: (
                          <>
                              Bayar per sesi secara langsung dengan metode
                              pembayaran yang tersedia.
                              <span className="mt-1 block text-xs italic text-amber-700">
                                  *Pembayaran drop-in hanya bisa dilakukan selama jam operasional studio.
                              </span>
                          </>
                      ),
                      hint: formatRupiah(schedule.price_override),
                      icon: IconCreditCard,
                  },
              ]
            : []),
    ];

    const selectedMethodLabel = useMemo(() => {
        if (data.payment_type === "credit") return "Credits Membership";
        return (
            paymentGateways.find((g) => g.value === data.payment_method)?.label ??
            "Drop-In Payment"
        );
    }, [data.payment_method, data.payment_type, paymentGateways]);

    const showCashierOnlyNotice =
        data.payment_type === "drop_in" &&
        ["debit", "credit_card"].includes(data.payment_method);

    const showQrisNotice =
        data.payment_type === "drop_in" && data.payment_method === "qris";

    const submitBooking = (event) => {
        event.preventDefault();
        if (alreadyBooked) {
            setBookingError("Anda sudah melakukan booking untuk sesi ini.");
            return;
        }
        setBookingError("");
        setShowConfirmModal(true);
    };

    const confirmPayment = () => {
        post(route("welcome.schedule-payment.process", schedule.id), {
            preserveScroll: true,
            onSuccess: () => setShowConfirmModal(false),
        });
    };

    const [showMessage, setShowMessage] = useState(false);
    useEffect(() => {
        if (flash?.success) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <>
            <Head title="Pembayaran Schedule" />
            <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 md:py-12 text-stone-800">
                {/* Toast Notification */}
                {showMessage && (
                    <div className="fixed top-6 right-6 z-50 flex w-full max-w-sm items-center space-x-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl ring-1 ring-black/5">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <IconCheck size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Berhasil</p>
                            <p className="mt-0.5 text-sm text-stone-600">{flash.success}</p>
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-5xl">
                    {/* Back Link */}
                    <Link
                        href={route("welcome.schedule-detail", schedule.id)}
                        className="group mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-stone-500 transition hover:text-stone-900"
                    >
                        <IconArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Kembali ke Detail Schedule
                    </Link>

                    {/* Main Grid: Card 12 Kolom */}
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* KIRI: Class Showcase & Session Info (5 Kolom) */}
                        <div className="space-y-4 lg:col-span-5">
                            <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm">
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 sm:aspect-[16/10] lg:aspect-[4/3]">
                                    {schedule.pilates_class?.image ? (
                                        <img
                                            src={imageUrl("classes", schedule.pilates_class.image)}
                                            alt={schedule.pilates_class?.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-stone-400">
                                            No Image Available
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
                                            <IconSparkles size={12} /> Group Classes
                                        </span>
                                        <h3 className="mt-1 text-lg font-bold tracking-tight">
                                            {schedule.pilates_class?.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Detail Pelatih & Sesi */}
                                <div className="p-5">
                                    <div className="space-y-3 text-xs text-stone-600">
                                        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                            <span className="flex items-center gap-2 text-stone-500">
                                                <IconUser size={15} /> Instruktur
                                            </span>
                                            <span className="font-semibold text-stone-800">
                                                {schedule.trainer?.name || "Instruktur Studio"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                            <span className="flex items-center gap-2 text-stone-500">
                                                <IconUsers size={15} /> Kapasitas
                                            </span>
                                            <span className="font-semibold text-stone-800">
                                                {schedule.capacity || 0} Peserta
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                            <span className="flex items-center gap-2 text-stone-500">
                                                <IconCalendarCheck size={15} /> Sisa Slot
                                            </span>
                                            <span className={`font-bold ${remainingSlots <= 2 ? "text-amber-700" : "text-emerald-700"}`}>
                                                {remainingSlots} Slot Tersedia
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                                            <span className="flex items-center gap-2 text-stone-500">
                                                <IconCalendar size={15} /> Tanggal Sesi
                                            </span>
                                            <span className="font-semibold text-stone-800">
                                                {formatDate(schedule.start_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-stone-500">
                                                <IconClock size={15} /> Jam Sesi
                                            </span>
                                            <span className="font-semibold text-stone-800">
                                                Pukul {formatTime(schedule.start_at)} WIB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KANAN: Form Booking & Payment (7 Kolom) */}
                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm md:p-8">
                                <div className="border-b border-stone-100 pb-5">
                                    <h1 className="text-2xl font-bold tracking-tight text-primary-700 md:text-3xl">
                                        Pembayaran Booking Schedule
                                    </h1>
                                    <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                                        {schedule.pilates_class?.name}
                                    </p>
                                </div>

                                {/* Membership & Credit Info Bar */}
                                <div className="mt-6 rounded-2xl border border-stone-200/70 bg-[#FAF8F5] p-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                                                Pilih Membership
                                            </label>
                                            {availableMemberships.length ? (
                                                <select
                                                    value={data.membership_id}
                                                    onChange={(e) => setData("membership_id", e.target.value)}
                                                    disabled={data.payment_type !== "credit"}
                                                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-stone-100"
                                                >
                                                    {availableMemberships.map((membership) => (
                                                        <option key={membership.id} value={membership.id}>
                                                            {membership.plan_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="mt-1">
                                                    <Link
                                                        href={route("welcome.page", "pricing")}
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-stone-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-stone-700"
                                                    >
                                                        Beli Membership
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:items-end sm:border-l sm:border-stone-200 sm:pl-5">
                                            <span className="text-xs text-stone-500">Sisa Saldo Credit</span>
                                            <span className="text-base font-bold text-primary-700">
                                                {selectedMembership?.credits_remaining ?? customerCredit} Credit
                                            </span>
                                            {selectedMembership && (
                                                <span className="mt-0.5 text-[11px] text-stone-500">
                                                    Expired:{" "}
                                                    <span className="font-medium text-stone-700">
                                                        {selectedMembership.expires_at ? formatDate(selectedMembership.expires_at) : "Tanpa Batas Waktu"}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {errors.membership_id && (
                                        <p className="mt-2 text-xs text-red-500">{errors.membership_id}</p>
                                    )}
                                </div>

                                {/* Form Checkout */}
                                <form onSubmit={submitBooking} className="mt-6 space-y-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                                        Opsi Pembayaran
                                    </span>

                                    <div className="grid gap-3">
                                        {availableMethods.map((method) => {
                                            const Icon = method.icon;
                                            const isSelected = data.payment_type === method.key;

                                            return (
                                                <label
                                                    key={method.key}
                                                    className={`relative block cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                                                        isSelected
                                                            ? "border-primary-800 bg-primary-50/70 shadow-sm ring-1 ring-primary-100"
                                                            : "border-stone-200/80 bg-white hover:border-stone-300"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3.5">
                                                        <input
                                                            type="radio"
                                                            name="payment_type"
                                                            checked={isSelected}
                                                            onChange={() => setData("payment_type", method.key)}
                                                            className="mt-1 h-4 w-4 border-stone-300 text-primary-700 focus:ring-stone-400"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <p className="inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                                                                    <Icon size={17} className="text-primary-700" />
                                                                    {method.title}
                                                                </p>
                                                                <span className="text-xs font-semibold text-primary-700">
                                                                    {method.hint}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-stone-500">
                                                                {method.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* Drop-In Gateway Selector */}
                                    {data.payment_type === "drop_in" && allowDropIn && (
                                        <div className="rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-4 text-xs">
                                            <label className="font-semibold uppercase tracking-wider text-stone-700">
                                                Pilih Metode Pembayaran
                                            </label>
                                            <select
                                                value={data.payment_method}
                                                onChange={(e) => setData("payment_method", e.target.value)}
                                                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-stone-400 focus:outline-none focus:ring-0"
                                            >
                                                {paymentGateways.map((item) => (
                                                    <option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Warnings & Notices */}
                                    {!allowDropIn && (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
                                            Sesi ini hanya dapat dibayarkan menggunakan Credits Membership.
                                        </div>
                                    )}

                                    {showCashierOnlyNotice && (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
                                            Pembayaran menggunakan metode DEBIT & CREDIT CARD hanya bisa dilakukan saat berada di kasir.
                                        </div>
                                    )}

                                    {showQrisNotice && (
                                        <div className="rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-700">
                                            Pembayaran QRIS belum tersedia.
                                        </div>
                                    )}

                                    {(bookingError || errors.payment_type) && (
                                        <p className="text-xs font-medium text-red-500">
                                            {bookingError || errors.payment_type}
                                        </p>
                                    )}

                                    {/* Submit Action */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={
                                                showCashierOnlyNotice ||
                                                showQrisNotice ||
                                                processing ||
                                                remainingSlots < 1 ||
                                                alreadyBooked
                                            }
                                            className="w-full rounded-full bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
                                        >
                                            {processing ? "Memproses..." : "Selesaikan Pembayaran"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl md:p-8">
                        <h2 className="text-xl font-bold tracking-tight text-primary-700">
                            Konfirmasi Booking
                        </h2>
                        <div className="mt-4 space-y-2.5 rounded-2xl bg-stone-50 p-4 text-xs text-stone-600">
                            <div className="flex justify-between">
                                <span>Metode Pembayaran:</span>
                                <span className="font-semibold text-stone-900">{selectedMethodLabel}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tanggal Sesi:</span>
                                <span className="font-semibold text-stone-900">{formatDate(schedule.start_at)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Jam Sesi:</span>
                                <span className="font-semibold text-stone-900">Pukul {formatTime(schedule.start_at)} WIB</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span>Peserta:</span>
                                <span className="font-semibold text-stone-900">{data.participants} Orang</span>
                            </div> */}
                            {data.payment_type === "credit" && (
                                <div className="flex justify-between border-t border-stone-200/70 pt-2 font-bold text-stone-900">
                                    <span>Credits Dipotong:</span>
                                    <span>
                                        {(selectedMembership?.credit_cost ?? Number(schedule.credit_override ?? 0)) *
                                            Number(data.participants || 1)}{" "}
                                        Credits
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="rounded-full border border-stone-200 px-5 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmPayment}
                                className="rounded-full bg-primary-600 px-6 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-primary-700"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}