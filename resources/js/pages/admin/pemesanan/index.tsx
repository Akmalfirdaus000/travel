
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, MapPin, Calendar, Clock, User, CreditCard } from 'lucide-react';

interface Pemesanan {
    id: number;
    kode_booking: string;
    total_bayar: number;
    status_bayar: string;
    tanggal_pesan: string;
    user: { name: string; email: string };
    jadwal: {
        tanggal_berangkat: string;
        jam_berangkat: string;
        rute: {
            kota_asal: string;
            kota_tujuan: string;
            estimasi_waktu_jam: number;
        };
        armada: { tipe_mobil: string };
    };
    detail_pemesanan: { nomor_kursi: number }[];
}

interface PaginationData {
    data: Pemesanan[];
    links: any[];
}

export default function PemesananIndex({
    pesanan_aktif,
    riwayat_pesanan,
}: {
    pesanan_aktif: PaginationData;
    riwayat_pesanan: PaginationData;
}) {
    const formatRupiah = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusPerjalanan = (item: Pemesanan) => {
        if (item.status_bayar !== 'lunas') return null;

        const now = new Date();
        const departureDateTime = new Date(`${item.jadwal.tanggal_berangkat.split('T')[0]}T${item.jadwal.jam_berangkat}`);
        
        const arrivalDateTime = new Date(departureDateTime);
        arrivalDateTime.setHours(arrivalDateTime.getHours() + item.jadwal.rute.estimasi_waktu_jam);

        if (now < departureDateTime) {
            return <Badge variant="secondary" className="ml-2">Menunggu Keberangkatan</Badge>;
        } else if (now >= departureDateTime && now < arrivalDateTime) {
            return <Badge className="bg-blue-500 hover:bg-blue-600 ml-2">Dalam Perjalanan</Badge>;
        } else {
            return <Badge className="bg-green-500 hover:bg-green-600 ml-2">Perjalanan Selesai</Badge>;
        }
    };

    const renderTable = (data: Pemesanan[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Kode & Penumpang</TableHead>
                    <TableHead>Rute & Jadwal</TableHead>
                    <TableHead>Total & Kursi</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length > 0 ? (
                    data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="font-semibold">{item.kode_booking}</div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                    <User className="h-3.5 w-3.5" />
                                    {item.user.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 font-medium">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {item.jadwal.rute.kota_asal} → {item.jadwal.rute.kota_tujuan}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(item.jadwal.tanggal_berangkat)}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.jadwal.jam_berangkat.substring(0, 5)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold">{formatRupiah(item.total_bayar)}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {item.detail_pemesanan?.length || 0} Kursi ({item.jadwal.armada.tipe_mobil})
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-2 items-start">
                                    {item.status_bayar === 'pending' && <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>}
                                    {item.status_bayar === 'lunas' && <Badge variant="default" className="bg-green-600">Lunas</Badge>}
                                    {item.status_bayar === 'batal' && <Badge variant="destructive">Batal</Badge>}
                                    {getStatusPerjalanan(item)}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/pemesanan/${item.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Detail
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            Tidak ada data pemesanan.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <>
            <Head title="Manajemen Pemesanan" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manajemen Pemesanan</h1>
                        <p className="text-muted-foreground">Kelola semua pesanan tiket masuk dan riwayatnya.</p>
                    </div>
                </div>

                <Tabs defaultValue="aktif" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="aktif">Pesanan Aktif ({pesanan_aktif.data.length})</TabsTrigger>
                        <TabsTrigger value="riwayat">Riwayat Perjalanan</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="aktif">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pesanan Aktif</CardTitle>
                                <CardDescription>Daftar pesanan tiket yang perjalanannya belum selesai.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    {renderTable(pesanan_aktif.data)}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="riwayat">
                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat Pemesanan</CardTitle>
                                <CardDescription>Daftar pesanan tiket yang perjalanannya telah selesai.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    {renderTable(riwayat_pesanan.data)}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

PemesananIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Manajemen Pemesanan', href: '/admin/pemesanan' },
    ],
};
