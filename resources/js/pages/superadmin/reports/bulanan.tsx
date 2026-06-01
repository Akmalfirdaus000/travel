import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Search, CalendarDays, TrendingUp, ReceiptText } from 'lucide-react';
import { useState } from 'react';

interface MonthlyData {
    bulan: string;
    total_pemesanan: number;
    total_pendapatan: number;
}

interface BulananProps {
    monthlyData: MonthlyData[];
    year: number;
    totalPendapatanTahun: number;
}

export default function LaporanBulanan({ monthlyData, year, totalPendapatanTahun }: BulananProps) {
    const [selectedYear, setSelectedYear] = useState(year.toString());

    const handleFilter = () => {
        router.get('/admin/reports/bulanan', {
            year: selectedYear,
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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    const maxPendapatan = Math.max(...monthlyData.map(m => Number(m.total_pendapatan)), 1);
    const totalSemuaPemesanan = monthlyData.reduce((acc, curr) => acc + curr.total_pemesanan, 0);

    return (
        <>
            <Head title={`Laporan Bulanan Tahun ${year}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Laporan Rekapitulasi Bulanan</h1>
                        <p className="text-muted-foreground">Analisis performa bisnis per bulan pada tahun {year}.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/reports/export?type=bulanan&year=${selectedYear}`} target="_blank">
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
                        <div className="grid gap-2 w-full md:w-64">
                            <Label htmlFor="year">Pilih Tahun</Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger id="year">
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleFilter} className="gap-2">
                            <Search className="h-4 w-4" />
                            Tampilkan
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan Tahun {year}</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{formatRupiah(totalPendapatanTahun)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pemesanan Lunas Tahun {year}</CardTitle>
                            <ReceiptText className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalSemuaPemesanan}</div>
                            <p className="text-xs text-muted-foreground mt-1">Transaksi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Area */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grafik Pendapatan Bulanan ({year})</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-end gap-2 justify-between pt-6">
                        {monthlyData.map((item, i) => {
                            const count = Number(item.total_pendapatan);
                            const heightPercent = count === 0 ? 0 : Math.max(10, (count / maxPendapatan) * 100);
                            return (
                                <div key={item.bulan} className="flex flex-col items-center flex-1 h-full justify-end">
                                    <div className="group relative w-full px-1 sm:px-4 flex justify-center flex-col items-center">
                                        <div 
                                            className="w-full bg-primary/20 rounded-t-sm transition-all duration-300 relative group-hover:bg-primary"
                                            style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '20px' : '2px' }}
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 flex flex-col items-center">
                                                <span className="font-bold">{formatRupiah(count)}</span>
                                                <span className="text-[10px] text-muted-foreground">{item.total_pemesanan} Pesanan</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
                                            {item.bulan.substring(0, 3)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Table Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Data Per Bulan</CardTitle>
                        <CardDescription>Tabel rekapitulasi data pendapatan dan transaksi sepanjang tahun {year}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16 text-center">No</TableHead>
                                        <TableHead>Bulan</TableHead>
                                        <TableHead className="text-center">Total Pemesanan</TableHead>
                                        <TableHead className="w-[40%]">Proporsi Pendapatan</TableHead>
                                        <TableHead className="text-right">Total Pendapatan (Rp)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {monthlyData.map((item, index) => {
                                        const percent = maxPendapatan > 0 ? (Number(item.total_pendapatan) / maxPendapatan) * 100 : 0;
                                        return (
                                            <TableRow key={index} className={item.total_pendapatan > 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <TableCell className="text-center text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium text-base">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                                        {item.bulan}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    {item.total_pemesanan}
                                                </TableCell>
                                                <TableCell>
                                                    {item.total_pendapatan > 0 ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                                                                    style={{ width: `${percent}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">Tidak ada data</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className={`text-right font-bold text-lg ${item.total_pendapatan > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                    {formatRupiah(Number(item.total_pendapatan))}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow className="bg-slate-50 font-bold border-t-2">
                                        <TableCell colSpan={2} className="text-right">TOTAL KESELURUHAN:</TableCell>
                                        <TableCell className="text-center text-primary text-lg">{totalSemuaPemesanan}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-right text-green-700 text-xl">{formatRupiah(totalPendapatanTahun)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LaporanBulanan.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
        { title: 'Bulanan', href: '#' },
    ],
};
