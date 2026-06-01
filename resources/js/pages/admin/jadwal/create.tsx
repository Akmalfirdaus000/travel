import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface JadwalCreateProps {
    rutes: Array<{
        id: number;
        kota_asal: string;
        kota_tujuan: string;
    }>;
    armada: Array<{
        id: number;
        plat_nomor: string;
        tipe_mobil: string;
        kapasitas_kursi: number;
        supir?: { nama_supir: string };
    }>;
}

export default function JadwalCreate({ rutes, armada }: JadwalCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        rute_id: '',
        armada_id: '',
        tanggal_berangkat: '',
        jam_berangkat: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/jadwal');
    };

    return (
        <>
            <Head title="Tambah Jadwal" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/admin/jadwal">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Jadwal</h1>
                        <p className="text-muted-foreground">Buat jadwal keberangkatan armada travel baru.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Keberangkatan</CardTitle>
                            <CardDescription>Pilih armada dan tentukan waktu keberangkatannya.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="rute_id">Pilih Rute</Label>
                                <Select onValueChange={(value) => setData('rute_id', value)} value={data.rute_id}>
                                    <SelectTrigger id="rute_id">
                                        <SelectValue placeholder="Pilih Rute" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rutes.map((rute) => (
                                            <SelectItem key={rute.id} value={rute.id.toString()}>
                                                {rute.kota_asal} - {rute.kota_tujuan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.rute_id && <p className="text-sm text-red-500">{errors.rute_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="armada_id">Pilih Armada (Otomatis Termasuk Supir)</Label>
                                <Select onValueChange={(value) => setData('armada_id', value)} value={data.armada_id}>
                                    <SelectTrigger id="armada_id">
                                        <SelectValue placeholder="Pilih Armada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {armada.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.plat_nomor} - {item.tipe_mobil} 
                                                {item.supir ? ` [Supir: ${item.supir.nama_supir}]` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.armada_id && <p className="text-sm text-red-500">{errors.armada_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tanggal_berangkat">Tanggal Berangkat</Label>
                                    <Input
                                        id="tanggal_berangkat"
                                        type="date"
                                        value={data.tanggal_berangkat}
                                        onChange={(e) => setData('tanggal_berangkat', e.target.value)}
                                    />
                                    {errors.tanggal_berangkat && <p className="text-sm text-red-500">{errors.tanggal_berangkat}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="jam_berangkat">Jam Berangkat</Label>
                                    <Input
                                        id="jam_berangkat"
                                        type="time"
                                        step="1"
                                        value={data.jam_berangkat}
                                        onChange={(e) => setData('jam_berangkat', e.target.value)}
                                    />
                                    {errors.jam_berangkat && <p className="text-sm text-red-500">{errors.jam_berangkat}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/jadwal">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Jadwal
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </>
    );
}

JadwalCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Jadwal Keberangkatan', href: '/admin/jadwal' },
        { title: 'Tambah' },
    ],
};
