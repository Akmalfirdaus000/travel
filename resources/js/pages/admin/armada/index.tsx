import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface ArmadaIndexProps {
    armada: {
        data: Array<{
            id: number;
            plat_nomor: string;
            tipe_mobil: string;
            kapasitas_kursi: number;
            rute?: { kota_asal: string; kota_tujuan: string };
            supir?: { nama_supir: string };
        }>;
        links: any[];
    };
}

export default function ArmadaIndex({ armada }: ArmadaIndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus armada ini?')) {
            router.delete(`/admin/armada/${id}`);
        }
    };

    return (
        <>
            <Head title="Data Armada" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Armada</h1>
                        <p className="text-muted-foreground">Kelola daftar armada kendaraan travel.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/armada/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Armada
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Armada</CardTitle>
                        <CardDescription>Semua armada kendaraan yang terdaftar di sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plat Nomor</TableHead>
                                    <TableHead>Tipe Mobil</TableHead>
                                    <TableHead>Kapasitas Kursi</TableHead>
                                    <TableHead>Supir Tetap</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {armada.data.length > 0 ? (
                                    armada.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.plat_nomor}</TableCell>
                                            <TableCell>{item.tipe_mobil}</TableCell>
                                            <TableCell>{item.kapasitas_kursi} Kursi</TableCell>
                                            <TableCell>{item.supir ? item.supir.nama_supir : '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={`/admin/armada/${item.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Tidak ada data armada.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ArmadaIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Data Armada', href: '/admin/armada' },
    ],
};
