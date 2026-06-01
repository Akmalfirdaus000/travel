import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Download, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PemesananData {
    id: number;
    kode_booking: string;
    total_bayar: number;
    status_bayar: 'pending' | 'lunas' | 'batal';
    tanggal_pesan: string;
    user: {
        name: string;
    };
    jadwal: {
        tanggal_berangkat: string;
        jam_berangkat: string;
        rute: {
            kota_asal: string;
            kota_tujuan: string;
        }
    };
}

interface PemesananProps {
    pemesanan: {
        data: PemesananData[];
        links: PaginationLink[];
    };
    totalPending: number;
    totalLunas: number;
    totalBatal: number;
    filters: {
        start_date: string;
        end_date: string;
        status: string;
    };
}

export default function LaporanPemesanan({
    pemesanan,
    totalPending,
    totalLunas,
    totalBatal,
    filters,
}: PemesananProps) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [status, setStatus] = useState(filters.status);

    const handleFilter = () => {
        router.get('/admin/reports/pemesanan', {
            start_date: startDate,
            end_date: endDate,
            status: status,
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

    return (
        <>
            <Head title="Laporan Pemesanan" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Laporan Pemesanan</h1>
                        <p className="text-muted-foreground">Detail transaksi pemesanan tiket travel.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href={`/admin/reports/export?type=pemesanan&start_date=${startDate}&end_date=${endDate}&status=${status}`} target="_blank">
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
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="status">Status Pembayaran</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu (Pending)</SelectItem>
                                    <SelectItem value="lunas">Lunas</SelectItem>
                                    <SelectItem value="batal">Batal</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <CardTitle className="text-sm font-medium">Total Pesanan Lunas</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalLunas}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pesanan Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalPending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pesanan Batal</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalBatal}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Riwayat Pemesanan</CardTitle>
                        <CardDescription>Menampilkan daftar pemesanan berdasarkan filter.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode Booking</TableHead>
                                        <TableHead>Waktu Pemesanan</TableHead>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Rute & Jadwal</TableHead>
                                        <TableHead>Nominal (Rp)</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pemesanan.data.length > 0 ? (
                                        pemesanan.data.map((item) => (
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
                                                    <div>{item.jadwal.rute.kota_asal} - {item.jadwal.rute.kota_tujuan}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Brkt: {new Date(item.jadwal.tanggal_berangkat).toLocaleDateString('id-ID')} {item.jadwal.jam_berangkat}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    {formatRupiah(item.total_bayar)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.status_bayar === 'pending' && <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>}
                                                    {item.status_bayar === 'lunas' && <Badge className="bg-green-600">Lunas</Badge>}
                                                    {item.status_bayar === 'batal' && <Badge variant="destructive">Batal</Badge>}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                Tidak ada data pemesanan yang cocok.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination */}
                        {pemesanan.links.length > 3 && (
                            <div className="flex items-center justify-center mt-6 space-x-1">
                                {pemesanan.links.map((link, idx) => {
                                    if (link.url === null) {
                                        return (
                                            <div
                                                key={idx}
                                                className="px-4 py-2 text-sm border rounded text-muted-foreground bg-slate-50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-4 py-2 text-sm border rounded hover:bg-primary/10 transition-colors ${
                                                link.active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LaporanPemesanan.layout = {
    breadcrumbs: [
        { title: 'Super Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/reports' },
        { title: 'Pemesanan', href: '#' },
    ],
};
