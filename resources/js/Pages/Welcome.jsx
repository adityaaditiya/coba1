import { Head, Link, usePage } from "@inertiajs/react";
import {
    IconAward,
    IconCheck,
    IconClock,
    IconFlower,
    IconHeartHandshake,
    IconBrandInstagram,
    IconMapPin,
    IconPhone,
    IconShieldCheck,
    IconSparkles,
    IconStretching,
    IconYoga,
    IconBrandTiktok,
} from "@tabler/icons-react";
import Button from "@/Components/Landing/Button";
import Card from "@/Components/Landing/Card";
import SectionTitle from "@/Components/Landing/SectionTitle";
import Navbar from "@/Components/Landing/Navbar";
import { getImageUrl } from "@/Utils/imageUrl";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Welcome() {
    const { auth, flash, trainers = [], membershipPlans = [], landingPageSetting = {} } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const contactInfo = {
        instagramUrl: landingPageSetting?.instagram_url || "https://www.instagram.com/orostudio.tegal/",
        tiktokUrl: landingPageSetting?.tiktok_url || "https://www.tiktok.com/@oropilatesstudio",
        whatsappUrl: `https://wa.me/${landingPageSetting?.whatsapp_number || '628213003567'}`,
        mapsEmbedUrl: landingPageSetting?.embed_maps || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d247.57918158921566!2d109.1340997!3d-6.8585801!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb7beb29c510d%3A0x668f24c80b9bc7fc!2sORO%20Pilates%20Studio!5e0!3m2!1sid!2ssg!4v1778299454810!5m2!1sid!2ssg",
    };

    const trustBadges = ["Certified Trainers", "Small Group", "Beginner Friendly"];

    const navItems = [
        { name: "Home", key: "home" },
        { name: "Classes", key: "classes" },
        { name: "Schedule", key: "schedule" },
        { name: "Pricing", key: "pricing" },
        { name: "Trainer", key: "trainer" },
        { name: "Appointment", key: "appointment" },
        { name: "Contact", key: "contact" },
    ];

    const benefits = [
        {
            icon: IconSparkles,
            title: "Postur Lebih Seimbang",
            desc: "Latihan terarah membantu alignment tubuh agar lebih tegap dan nyaman sepanjang hari.",
        },
        {
            icon: IconShieldCheck,
            title: "Core Lebih Kuat",
            desc: "Program kami menargetkan otot inti untuk mendukung stabilitas, keseimbangan, dan performa.",
        },
        {
            icon: IconStretching,
            title: "Fleksibilitas Meningkat",
            desc: "Gerakan mindful untuk membuka rentang gerak dengan aman, lembut, dan progresif.",
        },
        {
            icon: IconFlower,
            title: "Stress Relief",
            desc: "Rasakan sesi yang menenangkan dengan ritme napas, fokus, dan suasana studio yang hangat.",
        },
    ];

    const classTypes = [
        {
            title: "Reformer Pilates",
            desc: "Latihan dengan reformer machine untuk membangun kekuatan dan kontrol gerakan presisi.",
            duration: "55 menit",
            level: "All Levels",
        },
        {
            title: "Mat Pilates",
            desc: "Kelas dasar hingga intermediate yang berfokus pada teknik inti dan mobilitas tubuh.",
            duration: "50 menit",
            level: "Beginner - Intermediate",
        },
        {
            title: "Private Session",
            desc: "Pendampingan 1-on-1 dengan program personal sesuai tujuan kebugaran Anda.",
            duration: "60 menit",
            level: "Personalized",
        },
        {
            title: "Recovery & Stretch",
            desc: "Sesi pemulihan untuk melepas ketegangan otot dan memperbaiki kualitas gerak.",
            duration: "45 menit",
            level: "Beginner Friendly",
        },
    ];

    const scheduleRows = [
        { day: "Senin", morning: "07:00 Reformer", evening: "18:30 Mat Flow" },
        { day: "Selasa", morning: "08:00 Private", evening: "19:00 Recovery" },
        { day: "Rabu", morning: "07:30 Mat Core", evening: "18:30 Reformer" },
        { day: "Kamis", morning: "08:00 Recovery", evening: "19:00 Private" },
        { day: "Jumat", morning: "07:00 Reformer", evening: "18:00 Mat Basics" },
        { day: "Sabtu", morning: "09:00 Signature Class", evening: "16:30 Recovery" },
    ];
    const testimonials = [
        {
            quote: "Suasana studionya begitu tenang dan estetik. Arahan instruktur yang sangat personal membuat sesi pertama saya terasa begitu berkesan.",
            name: "Denia, 32",
        },
        {
            quote: "Sebagai pemula, aku merasa disambut banget di kelas pertama tadi. Suasananya nyaman, tempatnya bersih dan bikin betah! bikin percaya diri buat mulai hidup sehat.",
            name: "Vina, 28",
        },
        {
            quote: "Pengalaman pertama yang luar biasa bagi seorang pemula. Tim dan atmosfer studio yang hangat memberikan rasa nyaman untuk memulai perjalanan baru saya di sini.",
            name: "Monica, 37",
        },
        
    ];


    const heroBackgroundImage = getImageUrl(
        landingPageSetting?.hero_background_image,
        "landing-page",
    );
    const scheduleBackgroundImage = getImageUrl(
        landingPageSetting?.schedule_background_image,
        "landing-page",
    );
    const classesBackgroundImage = getImageUrl(
        landingPageSetting?.classes_background_image,
        "landing-page",
    );

    const faqs = [
        {
            q: "Apakah cocok untuk pemula?",
            a: "Ya. Kami menyediakan kelas beginner friendly dengan instruktur bersertifikasi yang membimbing teknik dari dasar.",
        },
        {
            q: "Apa yang perlu dibawa saat kelas?",
            a: "Kenakan pakaian olahraga nyaman, kaus kaki grip, dan bawa botol minum. Mat disediakan oleh studio.",
        },
        {
            q: "Bagaimana kebijakan cancel atau refund?",
            a: "Pembatalan dapat dilakukan maksimal 1 Hari sebelum kelas. Lebih dari itu tidak dapat refund, paket lain mengikuti syarat member.",
        },
        {
            q: "Apakah ada kelas private?",
            a: "Tersedia private session 1-on-1 dengan program personal sesuai kebutuhan kebugaran atau pemulihan Anda.",
        },
    ];

    return (
        <>
            <Head title="Pilates Studio | Move Better. Feel Stronger." />
            <Toaster position="top-center" />

            <div className="min-h-screen bg-wellness-beige text-wellness-text">

                <Navbar navItems={navItems} currentKey="home" />

                <section className="bg-gradient-to-br from-wellness-beige via-wellness-soft to-wellness-greige px-4 pb-20 pt-11 md:px-6 md:pt-18">
                <div className="mx-auto flex flex-col-reverse lg:grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600">Premium Pilates Studio</p>
                        <h1 className="mt-2 font-serif text-5xl font-medium leading-tight text-gray-800 md:text-7xl">
                            Move Better. <span className="text-amber-800 font-serif">Feel Stronger.</span>
                        </h1>            
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-wellness-muted md:text-lg">
                            Tingkatkan postur, kekuatan core, dan mobilitas melalui kelas pilates yang personal, elegan, dan menenangkan.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Button as={Link} href={route("welcome.page", "classes")}>Book A Class</Button>
                            <Button as={Link} href={route("welcome.page", "pricing")} variant="secondary">Join Membership</Button>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            {trustBadges.map((badge) => (
                                <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm text-wellness-muted">
                                    <IconCheck size={14} className="text-primary-600" />
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="w-full overflow-hidden backdrop-blur-sm">
                        <img
                            src={heroBackgroundImage}
                            alt={(landingPageSetting?.studio_name || "ORO Pilates Studio") + " Building"}
                            className="h-auto w-full rounded-[24px] object-cover"
                        />
                    </div>
                </div>
                </section>

                <section className="px-4 py-20 md:px-6">
                    <div className="mx-auto max-w-7xl">
                        <SectionTitle
                            eyebrow="Benefits"
                            title="Rasakan manfaat nyata di setiap sesi"
                            description="Program pilates kami dirancang untuk mendukung kualitas hidup yang lebih seimbang, kuat, dan mindful."
                        />
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {benefits.map(({ icon: Icon, title, desc }) => (
                                <Card key={title} className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-100">
                                    <div className="mb-5 inline-flex rounded-2xl bg-primary-100 p-3 text-primary-600 transition-transform duration-500 group-hover:scale-110">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-wellness-muted">{desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-10"> 
                    <div className="w-full">
                        <SectionTitle
                            eyebrow="Classes"
                            title="Pilihan kelas sesuai ritme Anda"
                            description="Mulai dari basic hingga sesi personal, semua kelas dipandu instruktur profesional bersertifikat."
                        />
                        <br />
                        <div className="relative h-[520px] md:h-[80vh] lg:h-screen w-full overflow-hidden">
                            <img 
                                src={classesBackgroundImage} 
                                alt="Pilates class" 
                                className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-center" 
                            />
                        
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-16">
                                <div className="container mx-auto px-2 md:px-6">
                                    <div className="max-w-xl text-left">
                                        <h1 className="text-white text-2xl md:text-4xl font-semibold leading-tight">
                                            Latihan Pilates yang Menenangkan
                                        </h1>
                                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                            <Button as={Link} href={route("welcome.page", "classes")}>
                                                Find Your Class
                                            </Button>
                                            <Link 
                                                href={route("welcome.page", "appointment")} 
                                                className="flex items-center justify-center border border-white text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition text-center"
                                            >
                                                Book An Appointment
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-10 mt-10 md:mt-20">
                    <div className="w-full">
                        <SectionTitle
                            eyebrow="Schedule"
                            title="Preview jadwal mingguan"
                            description="Atur waktu latihan Anda dengan jadwal yang fleksibel untuk pagi dan malam."
                        />
                        
                        <div className="mt-10 relative h-[480px] md:h-[75vh] lg:h-screen w-full overflow-hidden bg-wellness-soft"> 
                            <img 
                                src={scheduleBackgroundImage} 
                                alt="Pilates class schedule" 
                                className="absolute inset-0 h-full w-full object-cover object-[65%_center] md:object-center" 
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 md:p-16">
                                <div className="container mx-auto px-2 md:px-6">
                                    <div className="max-w-xl text-left">
                                        <h1 className="text-white text-xl md:text-3xl font-semibold leading-snug">
                                            Jadwal mingguan yang fleksibel Selaras dengan Agenda Personal Anda.
                                        </h1>
                                        
                                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                            <Link 
                                                href={route("welcome.page", "schedule")} 
                                                className="inline-block border border-white text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition text-center"
                                            >
                                                View More
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-18 bg-wellness-soft px-4 py-20 md:px-6">
                    <div className="mx-auto max-w-7xl">
                        <SectionTitle
                            eyebrow="Pricing"
                            title="Paket membership sederhana & transparan"
                            description="Pilih paket yang paling sesuai dengan gaya hidup dan target kebugaran Anda."
                        />
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {membershipPlans.slice(0, 4).map((item) => {
                                const isMostPopular = item.tag === "Most Popular";

                                return (
                                <Card
                                    key={item.id}
                                    className={`group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                        isMostPopular 
                                        ? "border-2 border-primary-600 ring-2 ring-primary-500/20" 
                                        : "border border-primary-100 hover:border-primary-300"
                                    }`}
                                >
                                    <div>
                                        {item.tag && (
                                            <span className="inline-block rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                                                {item.tag}
                                            </span>
                                        )}
                                        
                                        <div className="min-h-[60px] flex items-center">
                                            <h3 className="mt-2 text-xl font-semibold leading-tight">{item.name}</h3>
                                        </div>

                                        <p className="mt-1 text-3xl font-semibold text-primary-600">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.price || 0))}
                                        </p>
                                    </div>

                                    <div className="flex-1 mt-2">
                                        <p className="text-sm text-wellness-muted whitespace-pre-line">
                                            {item.description || "Benefit membership akan tampil di sini."}
                                        </p>
                                    </div>

                                    <div className="mt-3">
                                        <Button
                                            as={Link}
                                            href={auth?.user ? route("welcome.membership-detail", item.id) : route("login", { redirect: route("welcome.membership-detail", item.id, false) })}
                                            variant={isMostPopular ? "primary" : "secondary"}
                                            className={`${
                                                isMostPopular 
                                                ? "w-full bg-primary-600 hover:bg-primary-700 text-white" 
                                                : "w-full border-primary-600 text-primary-700 hover:bg-primary-50"
                                            } py-2.5 text-sm font-semibold`} 
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="px-4 py-20 md:px-6">
                    <div className="mx-auto max-w-7xl">
                        <SectionTitle
                            eyebrow="Trainers"
                            title="Dipandu instruktur berpengalaman"
                            description="Tim kami menghadirkan pendekatan personal agar setiap gerakan terasa aman, efektif, dan menyenangkan."
                        />
                        
                        <div className="mt-12 flex flex-wrap justify-center gap-6">
                            {trainers.map((trainer) => (
                                <Card 
                                    key={trainer.name} 
                                    className="group w-full sm:w-72 md:w-94 text-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-100"
                                >
                                    <div className="relative overflow-hidden rounded-2xl">
                                        <img
                                            src={trainer.photo ? `/storage/customers/${trainer.photo}` : "https://images.unsplash.com/photo-1595079835353-fb3cf0f83f20?auto=format&fit=crop&w=500&q=80"}
                                            alt={trainer.name}
                                            className="mx-auto h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = "https://ui-avatars.com/api/?name=" + trainer.name;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply pointer-events-none" />
                                    </div>

                                    <h3 className="mt-5 text-xl font-semibold">{trainer.name}</h3>
                                    <p className="mt-2 text-sm text-wellness-muted">{trainer.expertise || "Spesialisasi trainer belum diisi."}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-wellness-soft px-4 py-20 md:px-6">
                    <div className="mx-auto max-w-7xl">
                        <SectionTitle
                            eyebrow="Testimonials"
                            title="Apa kata member kami"
                            description="Cerita pengalaman dari member yang merasakan perubahan tubuh dan kualitas hidup."
                        />
                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {testimonials.map((item) => (
                                <Card key={item.name} className="group flex flex-col h-full p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-100">
                                    <div className="flex-grow">
                                        <p className="italic text-base leading-relaxed text-wellness-muted transition-colors duration-300 group-hover:text-gray-700">
                                            “{item.quote}”
                                        </p>
                                    </div>

                                    <div className="mt-8">
                                        <p className="font-bold text-gray-900">{item.name}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="faq" className="px-4 py-20 md:px-6">
                    <div className="mx-auto max-w-5xl">
                        <SectionTitle
                            eyebrow="FAQ"
                            title="Pertanyaan yang sering diajukan"
                            description="Jika Anda masih ragu memulai, temukan jawaban singkatnya di sini."
                        />
                        <div className="mt-10 space-y-4">
                            {faqs.map((item) => (
                                <details key={item.q} className="rounded-3xl border border-primary-100 bg-white p-6">
                                    <summary className="cursor-pointer list-none text-base font-semibold text-wellness-text">
                                        {item.q}
                                    </summary>
                                    <p className="mt-3 text-sm leading-relaxed text-wellness-muted">{item.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="bg-primary-600 px-4 py-14 text-primary-50 md:px-6">
                    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <p className="text-xl font-semibold text-white">{(landingPageSetting?.studio_name || "ORO Pilates Studio")}</p>
                            <p className="mt-4 max-w-md text-sm text-primary-100">
                                Studio pilates modern untuk Anda yang ingin bergerak lebih baik, merasa lebih kuat, dan hidup lebih mindful.
                            </p>
                            <div className="mt-5 space-y-2 text-sm text-primary-100">
                                <p className="flex items-center gap-2"><IconMapPin size={16} /> {landingPageSetting?.address || "Jl. Layur No. 08, Kota Tegal"}</p>
                                <p className="flex items-center gap-2"><IconClock size={16} /> {landingPageSetting?.operational_hours || "Senin - Sabtu, 07:00 - 19:00 WIB"}</p>
                                <p className="flex items-center gap-2"><IconPhone size={16} /> {landingPageSetting?.phone || "+62 821-3003-567"}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold text-white">Quick Links</p>
                            <ul className="mt-4 space-y-2 text-sm text-primary-100">
                                {navItems.map((item) => (
                                    <li key={item.key}>
                                        <Link href={item.key === "home" ? route("welcome") : route("welcome.page", item.key)} className="hover:text-white">{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold text-white">Follow Us</p>
                            <div className="mt-4 flex items-center gap-3">
                                <a href={contactInfo.instagramUrl} className="rounded-xl border border-primary-400 p-2 hover:bg-primary-500">
                                    <IconBrandInstagram size={18} />
                                </a>
                                <a href={contactInfo.tiktokUrl} className="rounded-xl border border-primary-400 p-2 hover:bg-primary-500">
                                    <IconBrandTiktok size={18} />
                                </a>
                            </div>
                            <Button as={Link} href={route("welcome.page", "classes")} className="mt-6 w-full bg-primary-500 text-white hover:bg-primary-700">
                                Book A Class
                            </Button>
                        </div>
                    </div>
                    <div className="mx-auto mt-10 max-w-7xl border-t border-primary-500 pt-6 text-center text-sm text-primary-100">
                        © {new Date().getFullYear()} {(landingPageSetting?.studio_name || "ORO Pilates Studio")}. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}