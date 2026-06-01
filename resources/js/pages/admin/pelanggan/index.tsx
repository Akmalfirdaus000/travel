import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, User, Phone, MapPin } from 'lucide-react';

interface Pelanggan {
    id: number;
    no_telp: string;
    alamat: string;
    jenis_kelamin: string;
    user: {
        name: string;
        email: string;
    };
}

interface PaginationData {
    data: Pelanggan[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function PelangganIndex({ pelanggan }: { pelanggan: PaginationData }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini? Semua data terkait (pemesanan, dll) mungkin akan terhapus juga.')) {
            router.delete(`/admin/pelanggan/${id}`);
        }
    };

    return (
        <>
            <Head title="Pelanggan" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pelanggan</h1>
                        <p className="text-muted-foreground">Kelola data pelanggan yang terdaftar di sistem.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pelanggan</CardTitle>
                        <CardDescription>Semua pelanggan yang dapat melakukan pemesanan tiket.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama & Email</TableHead>
                                        <TableHead>No. Telepon</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Jenis Kelamin</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pelanggan.data.length > 0 ? (
                                        pelanggan.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{item.user?.name || 'User Terhapus'}</span>
                                                        <span className="text-sm text-muted-foreground">{item.user?.email || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {item.no_telp}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="truncate max-w-[200px]">{item.alamat}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.jenis_kelamin === 'L' ? (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Laki-laki</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-pink-50 text-pink-700 hover:bg-pink-50">Perempuan</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
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
                                                Tidak ada data pelanggan.
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

PelangganIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Pelanggan', href: '/admin/pelanggan' },
    ],
};
