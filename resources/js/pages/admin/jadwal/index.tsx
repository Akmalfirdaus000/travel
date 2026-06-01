
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin, Calendar, Clock, Car, User } from 'lucide-react';

interface Jadwal {
    id: number;
    tanggal_berangkat: string;
    jam_berangkat: string;
    rute: {
        kota_asal: string;
        kota_tujuan: string;
        estimasi_waktu_jam: number;
    };
    armada: {
        plat_nomor: string;
        tipe_mobil: string;
    };
    supir: {
        nama_supir: string;
    };
}

interface PaginationData {
    data: Jadwal[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function JadwalIndex({ jadwal }: { jadwal: PaginationData }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(`/admin/jadwal/${id}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatus = (item: Jadwal) => {
        const now = new Date();
        
        // Pastikan tanggal_berangkat dikonversi ke zona waktu lokal pengguna sebelum diambil string YYYY-MM-DD nya
        const dateObj = new Date(item.tanggal_berangkat);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const departureDateStr = `${yyyy}-${mm}-${dd}`;
        
        const departureDateTime = new Date(`${departureDateStr}T${item.jam_berangkat}`);
        
        // Menghitung waktu tiba berdasarkan estimasi (fallback ke 2 jam jika tidak ada)
        const estimasi = item.rute?.estimasi_waktu_jam || 2;
        const arrivalDateTime = new Date(departureDateTime);
        arrivalDateTime.setHours(arrivalDateTime.getHours() + estimasi);

        if (now < departureDateTime) {
            return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Menunggu Keberangkatan</Badge>;
        } else if (now >= departureDateTime && now < arrivalDateTime) {
            return <Badge className="bg-blue-500 hover:bg-blue-600">Dalam Perjalanan</Badge>;
        } else {
            return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
        }
    };

    return (
        <>
            <Head title="Jadwal Keberangkatan" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Jadwal Keberangkatan</h1>
                        <p className="text-muted-foreground">Pantau dan kelola jadwal perjalanan travel.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/jadwal/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Jadwal
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Jadwal</CardTitle>
                        <CardDescription>Semua jadwal keberangkatan yang terdaftar di sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rute</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Armada & Supir</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jadwal.data.length > 0 ? (
                                        jadwal.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{item.rute.kota_asal}</span>
                                                        <span className="text-muted-foreground">→</span>
                                                        <span className="font-medium">{item.rute.kota_tujuan}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                            {formatDate(item.tanggal_berangkat)}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <Clock className="h-3.5 w-3.5 text-primary" />
                                                            {item.jam_berangkat.substring(0, 5)} WIB
                                                        </div>
                                                        <div className="text-xs text-muted-foreground ml-5">
                                                            Est. Tiba: +{item.rute?.estimasi_waktu_jam || 2} Jam
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Car className="h-3.5 w-3.5 text-muted-foreground" />
                                                            {item.armada.tipe_mobil} ({item.armada.plat_nomor})
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <User className="h-3.5 w-3.5" />
                                                            {item.supir.nama_supir}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatus(item)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild variant="outline" size="icon">
                                                            <Link href={`/admin/jadwal/${item.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Tidak ada data jadwal.
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

JadwalIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Jadwal Keberangkatan', href: '/admin/jadwal' },
    ],
};
