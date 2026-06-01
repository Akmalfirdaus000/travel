import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Car,
    Route,
    Calendar,
    Bus,
    Receipt,
    Package,
    TrendingUp,
    BarChart3,
    ArrowRight,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface DashboardProps {
    totalPelanggan?: number;
    totalSupir?: number;
    totalRute?: number;
    totalJadwal?: number;
    totalPemesanan?: number;
    pemesananPending?: number;
    pemesananLunas?: number;
    pemesananBatal?: number;
    totalPendapatan?: number;
    pendapatanBulanIni?: number;
    revenueData?: any[];
    popularRoutes?: any[];
    user?: {
        name: string;
        role: string;
    };
    stats?: any;
}

export default function Dashboard({
    totalPelanggan = 0,
    totalSupir = 0,
    totalRute = 0,
    totalJadwal = 0,
    totalPemesanan = 0,
    pemesananPending = 0,
    pemesananLunas = 0,
    pemesananBatal = 0,
    totalPendapatan = 0,
    pendapatanBulanIni = 0,
    revenueData = [],
    popularRoutes = [],
    user,
    stats,
}: DashboardProps) {
    const isSuperAdmin = user?.role === 'super_admin';

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title={isSuperAdmin ? 'Dashboard Super Admin' : 'Dashboard Admin'} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {isSuperAdmin ? (
                    <>
                        {/* Super Admin Dashboard */}
                        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{formatRupiah(totalPendapatan)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Akumulasi keseluruhan pendapatan</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatRupiah(pendapatanBulanIni)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Bulan berjalan</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pemesanan Lunas</CardTitle>
                                    <Receipt className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{pemesananLunas}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Transaksi sukses</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                                    <Package className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalPemesanan}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Keseluruhan tiket</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Grafik dan Analitik */}
                        <div className="grid gap-4 md:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Tren Pendapatan Harian (7 Hari Terakhir)</CardTitle>
                                    <CardDescription>Visualisasi pendapatan tiket yang lunas</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp${(val/1000).toFixed(0)}K`} />
                                            <Tooltip formatter={(value: number) => [formatRupiah(value), "Pendapatan"]} />
                                            <Line type="monotone" dataKey="pendapatan" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Rute Paling Populer</CardTitle>
                                    <CardDescription>Top 5 rute perjalanan</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={popularRoutes} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" width={100} fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip formatter={(value: number) => [value, "Pesanan"]} />
                                            <Bar dataKey="total" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalPelanggan}</div>
                                    <p className="text-xs text-muted-foreground">Pelanggan terdaftar</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Supir</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalSupir}</div>
                                    <p className="text-xs text-muted-foreground">Supir terdaftar</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Rute</CardTitle>
                                    <Route className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalRute}</div>
                                    <p className="text-xs text-muted-foreground">Rute tersedia</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Jadwal Aktif</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalJadwal}</div>
                                    <p className="text-xs text-muted-foreground">Jadwal keberangkatan</p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-1">
                            <Card className="bg-primary text-primary-foreground border-none">
                                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold">Laporan & Analitik Super Admin</h3>
                                        <p className="text-primary-foreground/80 mt-1">Akses semua fitur pelaporan lengkap, cetak data pendapatan bulanan, dan evaluasi performa bisnis travel Anda.</p>
                                    </div>
                                    <Button asChild variant="secondary" size="lg" className="shrink-0 w-full md:w-auto font-semibold">
                                        <Link href="/admin/reports">
                                            Buka Semua Laporan
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Admin Dashboard */}
                        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Supir</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalSupir}</div>
                                    <p className="text-xs text-muted-foreground">Supir terdaftar</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Armada</CardTitle>
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats?.total_armada || 0}</div>
                                    <p className="text-xs text-muted-foreground">Unit armada tersedia</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Rute</CardTitle>
                                    <Route className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalRute}</div>
                                    <p className="text-xs text-muted-foreground">Rute tersedia</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Jadwal Aktif</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalJadwal}</div>
                                    <p className="text-xs text-muted-foreground">Jadwal keberangkatan</p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="min-h-[300px] flex-1 rounded-xl border bg-card p-6">
                            <h3 className="text-lg font-semibold mb-2">Selamat Datang, Admin!</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Kelola data travel termasuk supir, armada, rute, dan jadwal keberangkatan.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/supir">Kelola Supir</Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/armada">Kelola Armada</Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/rute">Kelola Rute</Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/jadwal">Kelola Jadwal</Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/pelanggan">Kelola Pelanggan</Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/pemesanan">Kelola Pemesanan</Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/admin/pembayaran">Kelola Pembayaran</Link>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
