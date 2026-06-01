import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Bus,
    Calendar,
    Receipt,
    ArrowRight,
    Clock,
    Users,
    CheckCircle,
    AlertCircle,
    Ticket,
    MapPin,
} from 'lucide-react';

interface Pemesanan {
    id: number;
    kode_booking: string;
    status_bayar: 'pending' | 'lunas' | 'batal';
    tanggal_pesan: string;
    jadwal: {
        id: number;
        tanggal_berangkat: string;
        jam_berangkat: string;
        rute: {
            kota_asal: string;
            kota_tujuan: string;
        };
        armada: {
            plat_nomor: string;
            tipe_mobil: string;
        };
        supir: {
            nama_supir: string;
        };
    };
    detail_pemesanan: Array<{
        nomor_kursi: number;
    }>;
}

interface DashboardProps {
    user?: {
        name: string;
        email: string;
        role: string;
    };
    pemesananAktif: Pemesanan[];
    totalPemesanan: number;
    pemesananPending: number;
    pemesananLunas: number;
    jadwalTersedia: number;
    totalPerjalanan: number;
    perjalananAkanDatang: number;
    perjalananSelesai: Pemesanan[];
}

export default function Dashboard({
    user,
    pemesananAktif,
    totalPemesanan,
    pemesananPending,
    pemesananLunas,
    jadwalTersedia,
    totalPerjalanan,
    perjalananAkanDatang,
    perjalananSelesai,
}: DashboardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'lunas':
                return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">Lunas</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs">Menunggu Pembayaran</Badge>;
            case 'batal':
                return <Badge variant="destructive" className="text-xs">Batal</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">{status}</Badge>;
        }
    };

    const sortedKursi = (detail?: Array<{ nomor_kursi: number }>) => {
        if (!detail || !Array.isArray(detail)) return '-';
        return detail.map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ');
    };

    return (
        <>
            <Head title="Dashboard Pelanggan" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Welcome Section */}
                <div className="flex flex-col gap-1 mt-2">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">
                        Halo, {user?.name || 'Pelanggan'}! 👋
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Pantau jadwal perjalanan dan kelola tiket Anda dari sini.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <Card className="border-primary/20 bg-primary/5 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-primary">Tiket Aktif</CardTitle>
                            <Ticket className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">{perjalananAkanDatang}</div>
                            <p className="text-xs text-primary/70 mt-1 font-medium">
                                Jadwal akan datang
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tagihan</CardTitle>
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{pemesananPending}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Perlu segera dibayar
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalPerjalanan}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Perjalanan rampung
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
                            <Bus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{jadwalTersedia}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Jadwal rute aktif
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-7">
                    {/* Main Content Area - Active Bookings */}
                    <div className="xl:col-span-4 space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 mt-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Pemesanan Aktif
                        </h2>
                        
                        {pemesananAktif.length > 0 ? (
                            <div className="space-y-4">
                                {pemesananAktif.map((pemesanan) => (
                                    <Card key={pemesanan.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-muted group relative">
                                        {/* Status Accent Bar */}
                                        <div className={`absolute top-0 left-0 w-1 h-full ${pemesanan.status_bayar === 'lunas' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row items-stretch">
                                                {/* Route & Time */}
                                                <div className="flex-1 p-5 sm:p-6 pl-6 sm:pl-7">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-mono text-xs font-bold text-muted-foreground">{pemesanan.kode_booking}</span>
                                                        {getStatusBadge(pemesanan.status_bayar)}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <MapPin className="h-5 w-5 text-primary shrink-0" />
                                                        <span className="font-black text-xl tracking-tight">
                                                            {pemesanan.jadwal.rute.kota_asal} <ArrowRight className="inline h-5 w-5 mx-1 text-muted-foreground" /> {pemesanan.jadwal.rute.kota_tujuan}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                                        <div className="flex items-center gap-2 font-medium">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {formatDate(pemesanan.jadwal.tanggal_berangkat)}
                                                        </div>
                                                        <div className="flex items-center gap-2 font-bold text-primary">
                                                            <Clock className="h-4 w-4" />
                                                            {pemesanan.jadwal.jam_berangkat.substring(0, 5)} WIB
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                            <Ticket className="h-4 w-4" />
                                                            Kursi: <span className="text-foreground">{sortedKursi(pemesanan.detail_pemesanan)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Button Area */}
                                                <div className="bg-muted/10 border-t sm:border-t-0 sm:border-l border-muted p-5 flex items-center justify-center sm:w-40">
                                                    <Button asChild className="w-full h-12 shadow-sm group-hover:bg-primary/90">
                                                        <Link href={`/pelanggan/pemesanan/${pemesanan.id}`}>
                                                            Detail
                                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                
                                {totalPemesanan > pemesananAktif.length && (
                                    <Button asChild variant="ghost" className="w-full text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10">
                                        <Link href="/pelanggan/pemesanan?tab=pesanan">
                                            Lihat Semua Pemesanan Aktif
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Card className="border-dashed border-2 bg-muted/5">
                                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                                        <Ticket className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Belum ada tiket aktif</h3>
                                    <p className="text-muted-foreground mb-6 max-w-sm">
                                        Jadwal perjalanan Anda yang belum berangkat akan muncul di sini.
                                    </p>
                                    <Button asChild size="lg" className="shadow-sm">
                                        <Link href="/pelanggan/jadwal">
                                            Cari Tiket Sekarang
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Area - Quick Actions & History */}
                    <div className="xl:col-span-3 space-y-6 mt-2 xl:mt-0">
                        {/* Quick Actions */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b border-muted bg-muted/5">
                                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Button asChild className="w-full justify-start h-14 bg-primary hover:bg-primary/90" size="lg">
                                    <Link href="/pelanggan/jadwal">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="bg-white/20 p-2 rounded-md">
                                                <Bus className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="flex-1 text-left font-semibold">Pesan Tiket Baru</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start h-14 border-muted hover:bg-muted/10" size="lg">
                                    <Link href="/pelanggan/pemesanan?tab=riwayat">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="bg-muted p-2 rounded-md">
                                                <Receipt className="h-5 w-5 text-foreground" />
                                            </div>
                                            <span className="flex-1 text-left font-semibold">Riwayat Lengkap</span>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Completed Trips */}
                        {perjalananSelesai.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader className="pb-4 border-b border-muted">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Perjalanan Terakhir
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-muted">
                                        {perjalananSelesai.map((pemesanan) => (
                                            <div
                                                key={pemesanan.id}
                                                className="flex flex-col gap-2 p-5 hover:bg-muted/5 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-base">
                                                        {pemesanan.jadwal.rute.kota_asal} →{' '}
                                                        {pemesanan.jadwal.rute.kota_tujuan}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                                        Selesai
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground flex justify-between items-center mt-1">
                                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(pemesanan.jadwal.tanggal_berangkat)}</span>
                                                    <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded">{pemesanan.kode_booking}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {totalPerjalanan > perjalananSelesai.length && (
                                        <div className="p-4 border-t border-muted bg-muted/5">
                                            <Button asChild variant="outline" className="w-full bg-white">
                                                <Link href="/pelanggan/pemesanan?tab=riwayat">
                                                    Lihat Semua Riwayat
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/pelanggan/dashboard',
        },
    ],
};
