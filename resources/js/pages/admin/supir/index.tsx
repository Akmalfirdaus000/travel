import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, User, Phone } from 'lucide-react';

interface Supir {
    id: number;
    nama_supir: string;
    no_telp_supir: string;
    status: string;
}

interface PaginationData {
    data: Supir[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function SupirIndex({ supir }: { supir: PaginationData }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus supir ini?')) {
            router.delete(`/admin/supir/${id}`);
        }
    };

    return (
        <>
            <Head title="Supir" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Supir</h1>
                        <p className="text-muted-foreground">Kelola daftar supir yang bertugas.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/supir/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Supir
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Supir</CardTitle>
                        <CardDescription>Semua supir yang terdaftar dalam sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Supir</TableHead>
                                        <TableHead>No. Telepon</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {supir.data.length > 0 ? (
                                        supir.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        {item.nama_supir}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        {item.no_telp_supir}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {item.status === 'aktif' ? (
                                                        <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">Tidak Aktif</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild variant="outline" size="icon">
                                                            <Link href={`/admin/supir/${item.id}/edit`}>
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
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                Tidak ada data supir.
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

SupirIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Supir', href: '/admin/supir' },
    ],
};
