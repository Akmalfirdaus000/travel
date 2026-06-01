import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Calendar as CalendarIcon, Download, Search, Receipt } from 'lucide-react';
import { useState } from 'react';

interface PendapatanData {
    id: number;
    kode_booking: string;
    total_bayar: number;
    tanggal_pesan: string;
    user: {
        name: string;
    };
    jadwal: {
        tanggal_berangkat: string;
        rute: {
            kota_asal: string;
            kota_tujuan: string;
        }
    };
}

interface PendapatanProps {
    pendapatan: PendapatanData[];
    totalPendapatan: number;
    totalTransaksi: number;
    pendapatanPerHari: Record<string, number>;
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function LaporanPendapatan({
    pendapatan,
    totalPendapatan,
    totalTransaksi,
    pendapatanPerHari,
    filters,
}: PendapatanProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get('/admin/reports/pendapatan', {
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
        });
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Prepare chart data
    const chartLabels = Object.keys(pendapatanPerHari).map(date => {
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    });
    const chartValues = Object.values(pendapatanPerHari);
    const maxChartValue = Math.max(...chartValues, 1);

    return (
        <>
            <Head title="Laporan Pendapatan" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Laporan Pendapatan</h1>
                        <p className="text-muted-foreground">Detail pendapatan dari transaksi pemesanan lunas.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/reports/export?type=pendapatan&start_date=${startDate}&end_date=${endDate}`} target="_blank">
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export HTML
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="start_date">Tanggal Mulai</Label>
                            <Input 
                                id="start_date" 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="end_date">Tanggal Akhir</Label>
                            <Input 
                                id="end_date" 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleFilter} className="gap-2">
                            <Search className="h-4 w-4" />
                            Tampilkan Data
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan (Periode Ini)</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatRupiah(totalPendapatan)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Transaksi Lunas</CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalTransaksi}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Area */}
                {chartValues.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Grafik Pendapatan Harian</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[250px] flex items-end gap-2 justify-between pt-6">
                            {chartLabels.map((label, i) => {
                                const count = chartValues[i];
                                const heightPercent = count === 0 ? 0 : Math.max(10, (count / maxChartValue) * 100);
                                return (
                                    <div key={label} className="flex flex-col items-center flex-1 h-full justify-end">
                                        <div className="group relative w-full px-1 sm:px-4 flex justify-center flex-col items-center">
                                            <div 
                                                className="w-full bg-green-500/20 rounded-t-sm transition-all duration-300 relative group-hover:bg-green-500"
                                                style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '20px' : '2px' }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {formatRupiah(count)}
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
                )}

                {/* Table Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Transaksi Pendapatan</CardTitle>
                        <CardDescription>Menampilkan daftar pemesanan dengan status Lunas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode Booking</TableHead>
                                        <TableHead>Tanggal Pemesanan</TableHead>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Rute</TableHead>
                                        <TableHead className="text-right">Nominal (Rp)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendapatan.length > 0 ? (
                                        pendapatan.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium text-primary">
                                                    {item.kode_booking}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        {formatDate(item.tanggal_pesan)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.user.name}</TableCell>
                                                <TableCell>
                                                    {item.jadwal.rute.kota_asal} - {item.jadwal.rute.kota_tujuan}
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {formatRupiah(item.total_bayar)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                Tidak ada data pendapatan untuk periode ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LaporanPendapatan.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
        { title: 'Pendapatan', href: '#' },
    ],
};
