
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Edit, Trash2 } from 'lucide-react';

interface Rute {
    id: number;
    kota_asal: string;
    kota_tujuan: string;
    harga_tiket: string;
    estimasi_waktu_jam: number;
}

export default function RuteShow({ rute }: { rute: Rute }) {
    const formatRupiah = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(price));
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus rute ini?')) {
            router.delete(`/admin/rute/${rute.id}`);
        }
    };

    return (
        <>
            <Head title={`Detail Rute ${rute.kota_asal} - ${rute.kota_tujuan}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/rute">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">Detail Rute</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/rute/${rute.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Rute</CardTitle>
                        <CardDescription>Detail rute perjalanan dari {rute.kota_asal} ke {rute.kota_tujuan}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Kota Asal</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <p className="text-lg font-semibold">{rute.kota_asal}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Kota Tujuan</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <p className="text-lg font-semibold">{rute.kota_tujuan}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Estimasi Waktu Tempuh</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <p className="text-lg font-semibold">{rute.estimasi_waktu_jam} Jam</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Harga Tiket</p>
                                <p className="text-lg font-semibold text-primary">{formatRupiah(rute.harga_tiket)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RuteShow.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Data Rute', href: '/admin/rute' },
        { title: 'Detail' },
    ],
};
