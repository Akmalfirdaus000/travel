
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function RuteCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kota_asal: '',
        kota_tujuan: '',
        harga_tiket: '',
        estimasi_waktu_jam: '12',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/rute');
    };

    return (
        <>
            <Head title="Tambah Rute" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/rute">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Tambah Rute Baru</h1>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Rute</CardTitle>
                            <CardDescription>Masukkan detail rute perjalanan baru di sini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="kota_asal">Kota Asal</Label>
                                <Input
                                    id="kota_asal"
                                    value={data.kota_asal}
                                    onChange={(e) => setData('kota_asal', e.target.value)}
                                    placeholder="Contoh: Jakarta"
                                    required
                                />
                                {errors.kota_asal && <p className="text-sm text-destructive">{errors.kota_asal}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kota_tujuan">Kota Tujuan</Label>
                                <Input
                                    id="kota_tujuan"
                                    value={data.kota_tujuan}
                                    onChange={(e) => setData('kota_tujuan', e.target.value)}
                                    placeholder="Contoh: Bandung"
                                    required
                                />
                                {errors.kota_tujuan && <p className="text-sm text-destructive">{errors.kota_tujuan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimasi_waktu_jam">Estimasi Waktu Tempuh (Jam)</Label>
                                <Input
                                    id="estimasi_waktu_jam"
                                    type="number"
                                    min="1"
                                    max="72"
                                    value={data.estimasi_waktu_jam}
                                    onChange={(e) => setData('estimasi_waktu_jam', e.target.value)}
                                    placeholder="Contoh: 12"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Berapa jam perkiraan perjalanan dari kota asal ke kota tujuan?</p>
                                {errors.estimasi_waktu_jam && <p className="text-sm text-destructive">{errors.estimasi_waktu_jam}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="harga_tiket">Harga Tiket (Rp)</Label>
                                <Input
                                    id="harga_tiket"
                                    type="number"
                                    min="0"
                                    value={data.harga_tiket}
                                    onChange={(e) => setData('harga_tiket', e.target.value)}
                                    placeholder="Contoh: 150000"
                                    required
                                />
                                {errors.harga_tiket && <p className="text-sm text-destructive">{errors.harga_tiket}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 border-t pt-6">
                            <Button variant="outline" asChild>
                                <Link href="/admin/rute">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Simpan Rute
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </>
    );
}

RuteCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Data Rute', href: '/admin/rute' },
        { title: 'Tambah', href: '/admin/rute/create' },
    ],
};
