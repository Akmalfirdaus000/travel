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
    user?: {
        name: string;
        role: string;
    };
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
    user,
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
                                    <CardTitle className="text-sm font-medium">
                                        Total Pendapatan
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatRupiah(totalPendapatan)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total pendapatan dari pemesanan
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Pendapatan Bulan Ini
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatRupiah(pendapatanBulanIni)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Pendapatan bulan ini
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Pemesanan Lunas
                                    </CardTitle>
                                    <Receipt className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{pemesananLunas}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Pemesanan yang sudah lunas
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Menunggu Pembayaran
                                    </CardTitle>
                                    <Package className="h-4 w-4 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{pemesananPending}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Pemesanan menunggu pembayaran
                                    </p>
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
                        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Laporan & Statistik
                                    </CardTitle>
                                    <CardDescription>
                                        Akses laporan lengkap untuk analisis bisnis
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild className="w-full">
                                        <Link href="/admin/reports">
                                            Lihat Laporan
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Route className="h-5 w-5" />
                                        Rute Terpopuler
                                    </CardTitle>
                                    <CardDescription>
                                        Lihat rute yang paling banyak dipesan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/admin/reports/rute-terpopuler">
                                            Lihat Rute
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
                                    <div className="text-2xl font-bold">-</div>
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
