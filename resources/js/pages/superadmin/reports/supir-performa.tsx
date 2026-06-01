import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Search, UserCog, CheckCircle2, CircleDashed } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface SupirStats {
    nama_supir: string;
    total_jadwal: number;
    jadwal_selesai: number;
    persentase: number;
}

interface SupirPerformaProps {
    supirStats: SupirStats[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function LaporanSupirPerforma({ supirStats, filters }: SupirPerformaProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleFilter = () => {
        router.get('/admin/reports/supir-performa', {
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
        });
    };

    // Metrics
    const totalSupir = supirStats.length;
    const totalSemuaJadwal = supirStats.reduce((acc, curr) => acc + curr.total_jadwal, 0);
    const totalJadwalSelesai = supirStats.reduce((acc, curr) => acc + curr.jadwal_selesai, 0);
    const rataRataSelesai = totalSemuaJadwal > 0 ? (totalJadwalSelesai / totalSemuaJadwal) * 100 : 0;

    return (
        <>
            <Head title="Laporan Performa Supir" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Performa Supir</h1>
                        <p className="text-muted-foreground">Evaluasi tingkat penyelesaian tugas dan jadwal supir.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/reports/export?type=supir-performa&start_date=${startDate}&end_date=${endDate}`} target="_blank">
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
                            Filter Performa
                        </Button>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Supir Bertugas</CardTitle>
                            <UserCog className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalSupir}</div>
                            <p className="text-xs text-muted-foreground mt-1">Orang</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Penugasan</CardTitle>
                            <CircleDashed className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalSemuaJadwal}</div>
                            <p className="text-xs text-muted-foreground mt-1">Jadwal / Rute</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Jadwal Diselesaikan</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalJadwalSelesai}</div>
                            <p className="text-xs text-muted-foreground mt-1">Perjalanan sukses</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Sukses</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{rataRataSelesai.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Tingkat penyelesaian</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Performa Individu</CardTitle>
                        <CardDescription>Metrik pencapaian penyelesaian jadwal per masing-masing supir.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Supir</TableHead>
                                        <TableHead className="text-center">Total Ditugaskan</TableHead>
                                        <TableHead className="text-center">Selesai</TableHead>
                                        <TableHead className="text-center">Belum Selesai</TableHead>
                                        <TableHead className="w-[30%] text-center">Tingkat Penyelesaian (KPI)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {supirStats.length > 0 ? (
                                        supirStats.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium text-base">
                                                    {item.nama_supir}
                                                </TableCell>
                                                <TableCell className="text-center font-semibold">
                                                    {item.total_jadwal}
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-green-600">
                                                    {item.jadwal_selesai}
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-amber-500">
                                                    {item.total_jadwal - item.jadwal_selesai}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full transition-all duration-500 ${
                                                                    item.persentase >= 90 ? 'bg-green-500' :
                                                                    item.persentase >= 70 ? 'bg-primary' :
                                                                    item.persentase >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${item.persentase}%` }}
                                                            />
                                                        </div>
                                                        <Badge variant={
                                                            item.persentase >= 90 ? 'default' :
                                                            item.persentase >= 70 ? 'secondary' : 'destructive'
                                                        } className={`w-14 justify-center ${item.persentase >= 90 ? 'bg-green-600 hover:bg-green-600' : ''}`}>
                                                            {Math.round(item.persentase)}%
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                Tidak ada data performa supir pada periode ini.
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

LaporanSupirPerforma.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
        { title: 'Performa Supir', href: '#' },
    ],
};
