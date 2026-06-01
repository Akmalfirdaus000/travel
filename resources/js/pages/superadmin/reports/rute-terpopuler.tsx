import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search, MapPin, Map, Navigation } from 'lucide-react';
import { useState } from 'react';

interface RuteStats {
    jadwal_id: number;
    total_pemesanan: number;
    total_pendapatan: number;
    jadwal: {
        rute: {
            kota_asal: string;
            kota_tujuan: string;
        }
    };
}

interface RuteTerpopulerProps {
    ruteStats: RuteStats[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function LaporanRuteTerpopuler({ ruteStats, filters }: RuteTerpopulerProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get('/admin/reports/rute-terpopuler', {
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

    // Calculate maximums for simple progress bars
    const maxPemesanan = Math.max(...ruteStats.map(r => r.total_pemesanan), 1);
    
    // Total calculations
    const sumPemesanan = ruteStats.reduce((acc, curr) => acc + curr.total_pemesanan, 0);
    const sumPendapatan = ruteStats.reduce((acc, curr) => acc + Number(curr.total_pendapatan), 0);

    return (
        <>
            <Head title="Laporan Rute Terpopuler" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Rute Terpopuler</h1>
                        <p className="text-muted-foreground">Analisis tren pemesanan berdasarkan rute perjalanan.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/reports/export?type=rute-terpopuler&start_date=${startDate}&end_date=${endDate}`} target="_blank">
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
                            Filter Rute
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Rute Aktif</CardTitle>
                            <Map className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{ruteStats.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pemesanan Filter</CardTitle>
                            <Navigation className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{sumPemesanan}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan Filter</CardTitle>
                            <MapPin className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatRupiah(sumPendapatan)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Peringkat Rute Berdasarkan Popularitas</CardTitle>
                        <CardDescription>Menampilkan daftar rute dari yang paling banyak dipesan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16 text-center">Peringkat</TableHead>
                                        <TableHead>Rute Perjalanan</TableHead>
                                        <TableHead>Popularitas</TableHead>
                                        <TableHead className="text-center">Total Pesanan</TableHead>
                                        <TableHead className="text-right">Total Pendapatan (Rp)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ruteStats.length > 0 ? (
                                        ruteStats.map((item, index) => {
                                            const percent = (item.total_pemesanan / maxPemesanan) * 100;
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center font-bold">
                                                        <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-white ${
                                                            index === 0 ? 'bg-yellow-500' : 
                                                            index === 1 ? 'bg-slate-400' : 
                                                            index === 2 ? 'bg-amber-600' : 'bg-primary'
                                                        }`}>
                                                            {index + 1}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-lg">
                                                        {item.jadwal?.rute ? `${item.jadwal.rute.kota_asal} - ${item.jadwal.rute.kota_tujuan}` : 'Rute Dihapus'}
                                                    </TableCell>
                                                    <TableCell className="w-[30%]">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                                                    style={{ width: `${percent}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium w-10 text-right">{Math.round(percent)}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-primary text-lg">
                                                        {item.total_pemesanan}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-green-600">
                                                        {formatRupiah(item.total_pendapatan)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                Tidak ada data pemesanan pada periode ini.
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

LaporanRuteTerpopuler.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
        { title: 'Rute Terpopuler', href: '#' },
    ],
};
