
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';

interface Rute {
    id: number;
    kota_asal: string;
    kota_tujuan: string;
    harga_tiket: string;
    estimasi_waktu_jam: number;
}

interface PaginationData {
    data: Rute[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function RuteIndex({ rute }: { rute: PaginationData }) {
    const formatRupiah = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(price));
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus rute ini?')) {
            router.delete(`/admin/rute/${id}`);
        }
    };

    return (
        <>
            <Head title="Data Rute" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Rute</h1>
                        <p className="text-muted-foreground">Kelola rute perjalanan dan estimasi waktu tempuh.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/rute/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Rute
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Rute</CardTitle>
                        <CardDescription>Semua rute perjalanan yang tersedia di sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rute</TableHead>
                                        <TableHead>Estimasi Waktu</TableHead>
                                        <TableHead>Harga Tiket</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rute.data.length > 0 ? (
                                        rute.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{item.kota_asal}</span>
                                                        <span className="text-muted-foreground">→</span>
                                                        <span className="font-medium">{item.kota_tujuan}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{item.estimasi_waktu_jam} Jam</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatRupiah(item.harga_tiket)}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="icon" asChild>
                                                        <Link href={`/admin/rute/${item.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                Tidak ada data rute.
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

RuteIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Data Rute', href: '/admin/rute' },
    ],
};
