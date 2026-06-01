import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Route,
    Calendar,
    Receipt,
    Package,
    TrendingUp,
    BarChart3,
    ArrowRight,
    MapPin,
    AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TopRute {
    rute: string;
    total: number;
}

interface ReportsIndexProps {
    totalPelanggan: number;
    totalSupir: number;
    totalRute: number;
    totalJadwal: number;
    totalPemesanan: number;
    pemesananPending: number;
    pemesananLunas: number;
    pemesananBatal: number;
    totalPendapatan: number;
    pendapatanBulanIni: number;
    jadwalAkanDatang: number;
    jadwalSelesai: number;
    last7DaysLabels: string[];
    last7DaysData: number[];
    topRutes: TopRute[];
}

export default function ReportsIndex({
    totalPelanggan,
    totalSupir,
    totalRute,
    totalJadwal,
    totalPemesanan,
    pemesananPending,
    pemesananLunas,
    pemesananBatal,
    totalPendapatan,
    pendapatanBulanIni,
    jadwalAkanDatang,
    jadwalSelesai,
    last7DaysLabels,
    last7DaysData,
    topRutes,
}: ReportsIndexProps) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate max value for the simple bar chart visualization
    const maxOrders = Math.max(...last7DaysData, 1);

    return (
        <>
            <Head title="Ringkasan Laporan Super Admin" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ringkasan Laporan</h1>
                    <p className="text-muted-foreground">Pantau statistik dan performa sistem secara keseluruhan.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(totalPendapatan)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Keseluruhan pendapatan lunas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(pendapatanBulanIni)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total pendapatan lunas bulan ini</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Pembayaran</CardTitle>
                            <Package className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pemesananPending}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pesanan perlu diverifikasi</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPemesanan}</div>
                            <p className="text-xs text-muted-foreground mt-1">Keseluruhan transaksi diproses</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Pesanan 7 Hari Terakhir</CardTitle>
                            <CardDescription>Grafik sederhana tren pemesanan mingguan</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[250px] flex items-end gap-2 justify-between pt-6">
                            {last7DaysLabels.map((label, i) => {
                                const count = last7DaysData[i];
                                const heightPercent = count === 0 ? 0 : Math.max(10, (count / maxOrders) * 100);
                                return (
                                    <div key={label} className="flex flex-col items-center flex-1 h-full justify-end">
                                        <div className="group relative w-full px-1 sm:px-4 flex justify-center flex-col items-center">
                                            <div 
                                                className="w-full bg-primary/20 rounded-t-sm transition-all duration-300 relative group-hover:bg-primary"
                                                style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '20px' : '2px' }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {count} Pesanan
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
                                                {label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Rute Terpopuler</CardTitle>
                            <CardDescription>Top 5 rute perjalanan paling banyak dipesan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {topRutes.length > 0 ? (
                                    topRutes.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{item.rute}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Rute reguler</p>
                                                </div>
                                            </div>
                                            <div className="font-medium text-sm">
                                                <Badge variant="secondary">{item.total} Pesanan</Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8 text-sm">
                                        Belum ada data rute yang dipesan.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPelanggan}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Supir</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalSupir}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Rute Tersedia</CardTitle>
                            <Route className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRute}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Jadwal</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalJadwal}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
    ],
};
