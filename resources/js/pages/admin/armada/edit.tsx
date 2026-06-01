import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

interface ArmadaEditProps {
    armada: {
        id: number;
        rute_id: number | null;
        supir_id: number | null;
        plat_nomor: string;
        tipe_mobil: string;
        kapasitas_kursi: number;
    };
    supirs: Array<{ id: number; nama_supir: string }>;
}

export default function ArmadaEdit({ armada, supirs }: ArmadaEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        supir_id: armada.supir_id ? armada.supir_id.toString() : '',
        plat_nomor: armada.plat_nomor || '',
        tipe_mobil: armada.tipe_mobil || '',
        kapasitas_kursi: armada.kapasitas_kursi ? armada.kapasitas_kursi.toString() : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/armada/${armada.id}`);
    };

    return (
        <>
            <Head title={`Edit Armada ${armada.plat_nomor}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-2">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/admin/armada">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Armada</h1>
                        <p className="text-muted-foreground">Perbarui data armada, rute, atau supir.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Armada</CardTitle>
                            <CardDescription>Masukkan detail armada, rute yang dilayani, dan supir yang bertugas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="supir_id">Supir Tetap</Label>
                                <Select onValueChange={(value) => setData('supir_id', value)} value={data.supir_id}>
                                    <SelectTrigger id="supir_id">
                                        <SelectValue placeholder="Pilih Supir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supirs.map((supir) => (
                                            <SelectItem key={supir.id} value={supir.id.toString()}>
                                                {supir.nama_supir}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.supir_id && <p className="text-sm text-red-500">{errors.supir_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="plat_nomor">Plat Nomor</Label>
                                <Input
                                    id="plat_nomor"
                                    value={data.plat_nomor}
                                    onChange={(e) => setData('plat_nomor', e.target.value)}
                                />
                                {errors.plat_nomor && <p className="text-sm text-red-500">{errors.plat_nomor}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tipe_mobil">Tipe Mobil</Label>
                                <Input
                                    id="tipe_mobil"
                                    value={data.tipe_mobil}
                                    onChange={(e) => setData('tipe_mobil', e.target.value)}
                                />
                                {errors.tipe_mobil && <p className="text-sm text-red-500">{errors.tipe_mobil}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kapasitas_kursi">Kapasitas Kursi</Label>
                                <Input
                                    id="kapasitas_kursi"
                                    type="number"
                                    value={data.kapasitas_kursi}
                                    onChange={(e) => setData('kapasitas_kursi', e.target.value)}
                                />
                                {errors.kapasitas_kursi && <p className="text-sm text-red-500">{errors.kapasitas_kursi}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/armada">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </>
    );
}

ArmadaEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Data Armada', href: '/admin/armada' },
        { title: 'Edit' },
    ],
};
