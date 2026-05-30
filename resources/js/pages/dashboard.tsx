import { Head, usePage, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Bus,
    Calendar,
    MapPin,
    Users,
    Car,
    Route,
    Package,
    Receipt,
    TrendingUp,
    BarChart3,
    ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
    const { props } = usePage();
    const user = props.auth?.user;

    // Dashboard Pelanggan
    if (user?.role === 'pelanggan') {
        return (
            <>
                <Head title="Dashboard Pelanggan" />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pemesanan Aktif
                                </CardTitle>
                                <Receipt className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Pemesanan yang sedang berlangsung
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Jadwal Tersedia
                                </CardTitle>
                                <Bus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">
                                    Jadwal keberangkatan tersedia
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Perjalanan
                                </CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Total perjalanan Anda
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="min-h-[400px] flex-1 rounded-xl border bg-card p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Selamat Datang!</h3>
                            <p className="text-sm text-muted-foreground">
                                Cari jadwal travel dan pesan tiket perjalanan Anda.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="border-dashed">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bus className="h-5 w-5" />
                                        Cari Jadwal
                                    </CardTitle>
                                    <CardDescription>
                                        Lihat jadwal keberangkatan travel yang tersedia
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild className="w-full">
                                        <Link href="/pelanggan/jadwal">
                                            Lihat Jadwal
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="border-dashed">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5" />
                                        Pemesanan Saya
                                    </CardTitle>
                                    <CardDescription>
                                        Kelola dan lihat pemesanan tiket Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/pelanggan/pemesanan">
                                            Lihat Pemesanan
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Dashboard Super Admin
    if (user?.role === 'super_admin') {
        return (
            <>
                <Head title="Dashboard Super Admin" />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Pendapatan
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Rp 0</div>
                                <p className="text-xs text-muted-foreground">
                                    Total pendapatan dari pemesanan
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
                                <div className="text-2xl font-bold">0</div>
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
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Pemesanan menunggu pembayaran
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Pelanggan
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">13</div>
                                <p className="text-xs text-muted-foreground">
                                    Total pelanggan terdaftar
                                </p>
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
                </div>
            </>
        );
    }

    // Dashboard Admin
    return (
        <>
            <Head title="Dashboard Admin" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Supir</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">Supir terdaftar</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Armada</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">Unit armada tersedia</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Rute</CardTitle>
                            <Route className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">10</div>
                            <p className="text-xs text-muted-foreground">Rute tersedia</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jadwal Aktif</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
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
                            <Link href="/supir">Kelola Supir</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                            <Link href="/armada">Kelola Armada</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                            <Link href="/jadwal">Kelola Jadwal</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                            <Link href="/pemesanan">Kelola Pemesanan</Link>
                        </Button>
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
            href: dashboard(),
        },
    ],
};
