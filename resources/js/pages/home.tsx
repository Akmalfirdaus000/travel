import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Bus,
    MapPin,
    Clock,
    Users,
    Shield,
    CreditCard,
    CheckCircle,
    Phone,
    Mail,
    MapPin as MapPinIcon,
    Calendar,
    ArrowRight,
    Megaphone,
} from 'lucide-react';

interface HomePageProps {
    promo?: {
        title: string;
        description: string;
        active: boolean;
    } | null;
}

export default function HomePage({ promo }: HomePageProps) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: Bus,
            title: 'Armada Eksekutif',
            description: 'Avanza & Innova terbaru dengan AC dan kursi ergonomis',
        },
        {
            icon: MapPin,
            title: 'Rute Lengkap',
            description: 'Rao → Padang, Rao → Bukittinggi, dan banyak lagi',
        },
        {
            icon: Shield,
            title: 'Aman & Terpercaya',
            description: 'Supir berpengalaman dan asuransi perjalanan',
        },
        {
            icon: Clock,
            title: 'Tepat Waktu',
            description: 'Jadwal keberangkatan terjamin: 10.00 & 22.00 WIB',
        },
        {
            icon: Users,
            title: 'Layanan Prima',
            description: 'Customer service siap membantu 24/7',
        },
        {
            icon: CreditCard,
            title: 'Pembayaran Mudah',
            description: 'Transfer bank & konfirmasi otomatis',
        },
    ];

    const bookingSteps = [
        {
            step: 1,
            title: 'Pilih Rute & Tanggal',
            description: 'Cari jadwal perjalanan sesuai kebutuhan Anda',
            icon: Calendar,
        },
        {
            step: 2,
            title: 'Pilih Kursi',
            description: 'Pilih kursi yang tersedia secara interaktif',
            icon: Users,
        },
        {
            step: 3,
            title: 'Isi Data Penumpang',
            description: 'Lengkapi data diri atau data penumpang',
            icon: CheckCircle,
        },
        {
            step: 4,
            title: 'Bayar & Dapat Tiket',
            description: 'Transfer dan unduh tiket digital Anda',
            icon: CreditCard,
        },
    ];

    const routes = [
        { from: 'Rao', to: 'Padang', price: 150000, duration: '4-5 jam' },
        { from: 'Rao', to: 'Bukittinggi', price: 200000, duration: '5-6 jam' },
        { from: 'Rao', to: 'Pekanbaru', price: 250000, duration: '8-10 jam' },
        { from: 'Padang', to: 'Bukittinggi', price: 100000, duration: '2-3 jam' },
    ];

    const formatRupiah = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <Head title="CV Baruna Travel - Angkutan Sewa Eksekutif" />
            <div className="flex flex-col">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
                    <div className="absolute inset-0 bg-[url('/images/travel-bg.jpg')] bg-cover bg-center opacity-10" />
                    <div className="container relative mx-auto px-4 py-16 md:py-24">
                        <div className="max-w-3xl">
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                                CV Baruna Travel
                            </h1>
                            <p className="mb-6 text-xl text-blue-100 md:text-2xl">
                                Angkutan Sewa Eksekutif Terpercaya
                            </p>
                            <p className="mb-8 text-lg text-blue-200">
                                Nikmati perjalanan nyaman dan aman dengan armada terbaru. Melayani rute
                                Rao, Padang, Bukittinggi, dan kota-kota lain di Sumatera Barat.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {auth.user ? (
                                    <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                        <Link href="/pelanggan/jadwal">
                                            Pesan Tiket Sekarang
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                            <Link href="/register">
                                                Daftar Sekarang
                                            </Link>
                                        </Button>
                                        <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                            <Link href="/login">
                                                Masuk
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promo/Pengumuman Section */}
                {promo?.active && (
                    <section className="bg-amber-50 border-y border-amber-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center gap-4">
                                <Megaphone className="h-6 w-6 text-amber-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-amber-900">{promo.title}</h3>
                                    <p className="text-sm text-amber-700">{promo.description}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Features Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                Kenapa Memilih Kami?
                            </h2>
                            <p className="text-lg text-gray-600">
                                Keunggulan yang membuat perjalanan Anda lebih nyaman
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card key={index} className="border-none shadow-md">
                                    <CardHeader>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <feature.icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <CardDescription className="text-base">
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Routes & Pricing Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                Rute & Tarif
                            </h2>
                            <p className="text-lg text-gray-600">
                                Daftar rute aktif dengan harga transparan
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {routes.map((route, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex items-center justify-between p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                                    <Bus className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {route.from} → {route.to}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{route.duration}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {formatRupiah(route.price)}
                                                </p>
                                                <p className="text-sm text-gray-500">per orang</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button asChild size="lg">
                                <Link href="/pelanggan/jadwal">
                                    Lihat Semua Jadwal
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Booking Steps Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                Cara Pemesanan Tiket
                            </h2>
                            <p className="text-lg text-gray-600">
                                4 langkah mudah untuk mendapatkan tiket perjalanan Anda
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {bookingSteps.map((step, index) => (
                                <div key={index} className="relative text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mx-auto">
                                        {step.step}
                                    </div>
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mx-auto">
                                        <step.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900">{step.title}</h3>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                    {index < bookingSteps.length - 1 && (
                                        <div className="absolute top-8 right-0 hidden h-0.5 w-1/2 bg-blue-200 lg:block" style={{ right: '-50%', transform: 'translateX(50%)' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-16 bg-blue-900 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div>
                                <h3 className="mb-4 text-xl font-bold">Loket Rao</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <p>
                                            Jl. Raya Rao-Padang, Pasar Baru, Kec. Rao, Kab. Pasaman
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 flex-shrink-0" />
                                        <p>+62 812-3456-7890</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 flex-shrink-0" />
                                        <p>info@barunatravel.com</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-4 text-xl font-bold">Jam Operasional</h3>
                                <div className="space-y-2 text-blue-200">
                                    <p>Senin - Minggu: 08.00 - 22.00 WIB</p>
                                    <p>Keberangkatan Pagi: 10.00 WIB</p>
                                    <p>Keberangkatan Malam: 22.00 WIB</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-4 text-xl font-bold">Quick Links</h3>
                                <div className="space-y-2">
                                    <p>
                                        <Link href="/pelanggan/jadwal" className="text-blue-200 hover:text-white">
                                            Cek Jadwal
                                        </Link>
                                    </p>
                                    <p>
                                        <Link href="/pelanggan/pemesanan" className="text-blue-200 hover:text-white">
                                            Pesan Tiket
                                        </Link>
                                    </p>
                                    <p>
                                        <Link href="/login" className="text-blue-200 hover:text-white">
                                            Login / Daftar
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 py-6 text-center text-gray-400">
                    <p>&copy; 2026 CV Baruna Travel. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
