import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search, Car, CalendarDays, BarChart4 } from 'lucide-react';
import { useState } from 'react';

interface ArmadaStats {
    plat_nomor: string;
    tipe_mobil: string;
    total_jadwal: number;
    total_hari: number;
}

interface ArmadaUtilisasiProps {
    armadaStats: ArmadaStats[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function LaporanArmadaUtilisasi({ armadaStats, filters }: ArmadaUtilisasiProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get('/admin/reports/armada-utilisasi', {
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
        });
    };

    // Metrics
    const totalArmada = armadaStats.length;
    const totalPenggunaan = armadaStats.reduce((acc, curr) => acc + curr.total_jadwal, 0);
    const totalHariOperasi = armadaStats.reduce((acc, curr) => acc + curr.total_hari, 0);

    return (
        <>
            <Head title="Laporan Utilisasi Armada" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Utilisasi Armada</h1>
                        <p className="text-muted-foreground">Monitoring tingkat frekuensi penggunaan unit armada (mobil).</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/reports/export?type=armada-utilisasi&start_date=${startDate}&end_date=${endDate}`} target="_blank">
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
                            Filter Data
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Armada Aktif/Digunakan</CardTitle>
                            <Car className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalArmada}</div>
                            <p className="text-xs text-muted-foreground mt-1">Unit kendaraan</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Trip (Jadwal)</CardTitle>
                            <BarChart4 className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalPenggunaan}</div>
                            <p className="text-xs text-muted-foreground mt-1">Kali perjalanan diselesaikan</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Hari Operasi</CardTitle>
                            <CalendarDays className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalHariOperasi}</div>
                            <p className="text-xs text-muted-foreground mt-1">Akumulasi hari aktif</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Penggunaan Unit Kendaraan</CardTitle>
                        <CardDescription>Menampilkan seberapa sering masing-masing armada beroperasi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plat Nomor</TableHead>
                                        <TableHead>Tipe Mobil</TableHead>
                                        <TableHead className="text-center">Total Hari Beroperasi</TableHead>
                                        <TableHead className="text-center">Total Trip (Perjalanan)</TableHead>
                                        <TableHead className="text-right">Rata-rata Trip/Hari</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {armadaStats.length > 0 ? (
                                        armadaStats.map((item, index) => {
                                            const avg = item.total_hari > 0 ? (item.total_jadwal / item.total_hari).toFixed(1) : '0.0';
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-bold text-base">
                                                        <div className="border border-slate-300 bg-slate-100 rounded-sm inline-block px-3 py-1 font-mono">
                                                            {item.plat_nomor}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-muted-foreground">
                                                        {item.tipe_mobil}
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">
                                                        {item.total_hari} Hari
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-primary text-lg">
                                                        {item.total_jadwal}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {avg}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                Tidak ada data penggunaan armada pada periode ini.
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

LaporanArmadaUtilisasi.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
        { title: 'Utilisasi Armada', href: '#' },
    ],
};
