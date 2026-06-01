import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function SupirCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_supir: '',
        no_telp_supir: '',
        status: 'tersedia',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/supir');
    };

    return (
        <>
            <Head title="Tambah Supir" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/supir">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Supir</h1>
                        <p className="text-muted-foreground">Tambahkan data supir baru ke dalam sistem.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Supir</CardTitle>
                                <CardDescription>Isi detail informasi supir dengan lengkap.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="nama_supir">Nama Supir</Label>
                                    <Input
                                        id="nama_supir"
                                        value={data.nama_supir}
                                        onChange={(e) => setData('nama_supir', e.target.value)}
                                        placeholder="Masukkan nama lengkap supir"
                                    />
                                    {errors.nama_supir && <p className="text-sm text-red-500">{errors.nama_supir}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="no_telp_supir">Nomor Telepon</Label>
                                    <Input
                                        id="no_telp_supir"
                                        value={data.no_telp_supir}
                                        onChange={(e) => setData('no_telp_supir', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                    />
                                    {errors.no_telp_supir && <p className="text-sm text-red-500">{errors.no_telp_supir}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select onValueChange={(value) => setData('status', value)} defaultValue={data.status}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tersedia">Tersedia</SelectItem>
                                            <SelectItem value="bertugas">Bertugas</SelectItem>
                                            <SelectItem value="izin">Izin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>

                                <Button type="submit" disabled={processing} className="w-full mt-4">
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Data Supir
                                </Button>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}

SupirCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Supir', href: '/admin/supir' },
        { title: 'Tambah Supir', href: '/admin/supir/create' },
    ],
};
