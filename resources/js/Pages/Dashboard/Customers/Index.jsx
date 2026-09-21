import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import axios from "axios";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconLayoutGrid,
    IconList,
    IconUser,
    IconPhone,
    IconMapPin,
    IconMail,
    IconClipboardText,
    IconUserStar,
    IconFileTypePdf,
    IconX,
    IconLoader2,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Swal from "sweetalert2";

// Customer Card for Grid View
function CustomerCard({ customer, onOpenQuestionnaire }) {
    const isTrainer = customer.user?.roles?.some(r => r.name === 'trainer');

    const handleAssignTrainer = () => {
        const actionTitle = isTrainer ? "Cabut Hak Akses?" : "Jadikan Trainer?";
        const actionText = isTrainer 
            ? `Cabut hak akses Trainer dari ${customer.name}?` 
            : `Berikan hak akses Trainer kepada ${customer.name}?`;
        const confirmText = isTrainer ? "Ya, Cabut!" : "Ya, Berikan!";
        const confirmColor = isTrainer ? "#d33" : "#3085d6";

        Swal.fire({
            title: actionTitle,
            text: actionText,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: confirmColor,
            cancelButtonColor: isTrainer ? "#64748b" : "#d33",
            confirmButtonText: confirmText,
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route("customers.assign-trainer", customer.id), {}, {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col h-full">
            {/* Avatar & Name */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {customer.name}
                        </h3>
                    </div>
                </div>
                
                <button
                    onClick={handleAssignTrainer}
                    title={isTrainer ? "Cabut hak akses Trainer" : "Jadikan Trainer"}
                    className={`p-1.5 rounded-full flex-shrink-0 transition-colors ${
                        isTrainer
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-danger-100 hover:text-danger-600 dark:hover:bg-danger-900/30 dark:hover:text-danger-400"
                            : "border border-slate-200 text-slate-400 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500 dark:border-slate-700 dark:hover:border-amber-800 dark:hover:bg-amber-900/20"
                    }`}
                >
                    <IconUserStar size={18} />
                </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-6 flex-grow">
                {customer.no_telp && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <IconPhone size={16} />
                        <span>{customer.no_telp}</span>
                    </div>
                )}
                {customer.user?.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <IconMail size={16} />
                        <span>{customer.user.email}</span>
                    </div>
                )}
                {customer.address && (
                    <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <IconMapPin
                            size={16}
                            className="flex-shrink-0 mt-0.5"
                        />
                        <span className="line-clamp-2">{customer.address}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <button
                    type="button"
                    onClick={() => onOpenQuestionnaire(customer)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-400 text-sm font-medium transition-colors"
                    title="Kuesioner"
                >
                    <IconClipboardText size={18} />
                </button>
                <Link
                    href={route("customers.edit", customer.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-warning-50 text-warning-600 hover:bg-warning-500 hover:text-white border border-warning-100 transition-all"
                    title="Edit"
                >
                    <IconPencilCog size={18} />
                </Link>
                
                {/* <Button
                    type={"delete"}
                    icon={<IconTrash size={16} />}
                    className={
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-danger-100 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:text-danger-400 text-sm font-medium"
                    }
                    url={route("customers.destroy", customer.id)}
                    label=""
                /> */}
                <Button
                    type={"delete"}
                    icon={<IconTrash size={18} />}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-danger-100 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:text-danger-400 text-sm font-medium"
                    url={route("customers.destroy", customer.id)}
                    title="Delete"
                />
            </div>
        </div>
    );
}

export default function Index({ customers }) {
    const { roles, permissions, errors } = usePage().props;
    const [viewMode, setViewMode] = useState("grid");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [questionnaireData, setQuestionnaireData] = useState(null);
    const [isLoadingQuestionnaire, setIsLoadingQuestionnaire] = useState(false);

    const handleOpenQuestionnaire = async (customer) => {
        setSelectedCustomer(customer);
        setQuestionnaireData(null);
        setIsLoadingQuestionnaire(true);

        try {
            const response = await axios.get(route("customers.questionnaire.show", customer.id));
            setQuestionnaireData(response.data);
        } catch (error) {
            console.error("Gagal memuat data kuesioner:", error);
        } finally {
            setIsLoadingQuestionnaire(false);
        }
    };

    const handleCloseQuestionnaire = () => {
        setSelectedCustomer(null);
        setQuestionnaireData(null);
    };

    return (
        <>
            <Head title="Pelanggan" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Pelanggan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {customers.total || customers.data?.length || 0}{" "}
                            pelanggan terdaftar
                        </p>
                    </div>
                    <Button
                        type={"link"}
                        icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        }
                        label={"Tambah Pelanggan"}
                        href={route("customers.create")}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("customers.index")}
                        placeholder="Cari pelanggan..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "grid"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Grid View"
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "list"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="List View"
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {customers.data.length > 0 ? (
                viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {customers.data.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onOpenQuestionnaire={handleOpenQuestionnaire}
                            />
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <Table.Card title={"Data Pelanggan"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Pelanggan</Table.Th>
                                    <Table.Th>No. Telepon</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Alamat</Table.Th>
                                    <Table.Th>Credit</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {customers.data.map((customer, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={customer.id}
                                    >
                                        <Table.Td className="text-center">
                                            {++i +
                                                (customers.current_page - 1) *
                                                    customers.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                    {customer.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {customer.name}
                                                </p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {customer.no_telp || "-"}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {customer.user?.email || "-"}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                                {customer.address || "-"}
                                            </p>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                {customer.credit || "0"}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
                                                <Button
                                                    type={"edit"}
                                                    icon={
                                                        <IconPencilCog
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    }
                                                    href={route(
                                                        "customers.edit",
                                                        customer.id
                                                    )}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenQuestionnaire(customer)}
                                                    className="p-2 border rounded-xl bg-primary-100 border-primary-200 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-400 transition-colors"
                                                    title="Kuesioner"
                                                >
                                                    <IconClipboardText
                                                        size={16}
                                                        strokeWidth={1.5}
                                                    />
                                                </button>
                                                <Button
                                                    type={"delete"}
                                                    icon={
                                                        <IconTrash
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                    }
                                                    url={route(
                                                        "customers.destroy",
                                                        customer.id
                                                    )}
                                                />
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                )
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Pelanggan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan pelanggan pertama Anda.
                    </p>
                    <Button
                        type={"link"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white"
                        }
                        label={"Tambah Pelanggan"}
                        href={route("customers.create")}
                    />
                </div>
            )}

            {customers.last_page !== 1 && (
                <Pagination links={customers.links} />
            )}

            {/* Pop-up Modal Kuesioner Pelanggan */}
            {selectedCustomer && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
                    onClick={handleCloseQuestionnaire}
                >
                    <div 
                        className="flex flex-col max-h-[90vh] w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Kuesioner - {selectedCustomer.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {selectedCustomer.no_telp ? `${selectedCustomer.no_telp} • ` : ""}
                                    {selectedCustomer.user?.email || "Tidak ada email"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseQuestionnaire}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                                title="Tutup"
                            >
                                <IconX size={20} />
                            </button>
                        </div>

                        {/* Konten Kuesioner */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {isLoadingQuestionnaire ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                    <IconLoader2 size={32} className="animate-spin text-primary-500 mb-2" />
                                    <p className="text-sm">Memuat data kuesioner...</p>
                                </div>
                            ) : questionnaireData?.questions && questionnaireData.questions.length > 0 ? (
                                <div className="space-y-3">
                                    {questionnaireData.questions.map((q, idx) => {
                                        const isAnswered = q.input_type === "checkbox" 
                                            ? Array.isArray(q.answer) && q.answer.length > 0
                                            : q.answer !== null && q.answer !== "" && q.answer !== undefined;

                                        return (
                                            <div
                                                key={q.id || idx}
                                                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                        {idx + 1}. {q.question_text}
                                                        {q.is_required && <span className="text-rose-500 ml-1">*</span>}
                                                    </p>
                                                    {/* <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-shrink-0">
                                                        {{
                                                            text: "Teks",
                                                            number: "Nomor",
                                                            multiple_choice: "Pilihan Ganda",
                                                            checkbox: "Checkbox",
                                                        }[q.input_type] || q.input_type}
                                                    </span> */}
                                                </div>
                                                <div className="text-sm">
                                                    {isAnswered ? (
                                                        q.input_type === "checkbox" && Array.isArray(q.answer) ? (
                                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                                {q.answer.map((val) => (
                                                                    <span
                                                                        key={val}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/50"
                                                                    >
                                                                        {val}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-medium">
                                                                {String(q.answer)}
                                                            </p>
                                                        )
                                                    ) : (
                                                        <p className="text-slate-400 dark:text-slate-500 italic text-xs">
                                                            Belum diisi
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                    <p className="text-sm">Belum ada data pertanyaan kuesioner.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal: Tombol Export PDF di pojok kiri bawah, Tombol Edit & Tutup di sebelah kanan */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            {/* Tombol Export PDF di ujung pojok bawah sebelah kiri form */}
                            <a
                                href={route("customers.questionnaire.export-pdf", selectedCustomer.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                            >
                                <IconFileTypePdf size={18} />
                                Export PDF
                            </a>

                            {/* Tombol Edit Kuesioner dan Tutup di sebelah kanan */}
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("customers.questionnaire.edit", selectedCustomer.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                                >
                                    <IconPencilCog size={18} />
                                    Edit Kuesioner
                                </Link>
                                {/* <button
                                    type="button"
                                    onClick={handleCloseQuestionnaire}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium transition-colors"
                                >
                                    Tutup
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
