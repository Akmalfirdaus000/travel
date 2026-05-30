import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ArrowRight,
    Bus,
    Calendar,
    Clock,
    IndianRupee,
    MapPin,
    User,
    Phone,
    Users,
} from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Jadwal {
    id: number;
    tanggal_berangkat: string;
    jam_berangkat: string;
    rute: {
        kota_asal: string;
        kota_tujuan: string;
        harga_tiket: number;
    };
    armada: {
        plat_nomor: string;
        tipe_mobil: string;
    };
}

interface PemesananCreateProps {
    jadwal: Jadwal;
    kursiTerpilih: number[];
    totalBayar: number;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            pelanggan?: {
                no_telp: string;
                alamat: string;
            };
        };
    };
}

export default function PemesananCreate({ jadwal, kursiTerpilih, totalBayar, auth }: PemesananCreateProps) {
    const user = auth?.user;

    const { data, setData, post, processing, errors } = useForm({
        jadwal_id: jadwal.id,
        nomor_kursi: kursiTerpilih,
        nama_penumpang: user?.name || '',
        email_penumpang: user?.email || '',
        no_telp_penumpang: user?.pelanggan?.no_telp || '',
        alamat_penumpang: user?.pelanggan?.alamat || '',
        catatan: '',
    });

    const formatRupiah = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pelanggan/pemesanan');
    };

    return (
        <>
            <Head title="Konfirmasi Pemesanan - CV Baruna Travel" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2">
                    <Link href={`/pelanggan/jadwal/${jadwal.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Pilihan Kursi
                    </Link>
                </Button>

                <h1 className="text-2xl font-bold text-gray-900">Konfirmasi Pemesanan Tiket</h1>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Trip Details */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bus className="h-5 w-5 text-blue-600" />
                                    Detail Perjalanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Rute</p>
                                                <p className="font-semibold">
                                                    {jadwal.rute.kota_asal} → {jadwal.rute.kota_tujuan}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Tanggal</p>
                                                <p className="font-semibold">{formatDate(jadwal.tanggal_berangkat)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Jam</p>
                                                <p className="font-semibold">{jadwal.jam_berangkat}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Bus className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Armada</p>
                                                <p className="font-semibold">{jadwal.armada.tipe_mobil}</p>
                                                <p className="text-xs text-gray-400">{jadwal.armada.plat_nomor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Kursi</p>
                                                <p className="font-semibold">{kursiTerpilih.sort((a, b) => a - b).join(', ')}</p>
                                                <p className="text-xs text-gray-400">{kursiTerpilih.length} kursi</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <IndianRupee className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Total</p>
                                                <p className="text-2xl font-bold text-blue-600">{formatRupiah(totalBayar)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passenger Manifest Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Data Penumpang
                                </CardTitle>
                                <CardDescription>
                                    {user
                                        ? 'Data Anda akan digunakan sebagai penumpang. Ubah jika memesan untuk orang lain.'
                                        : 'Silakan lengkapi data penumpang untuk melanjutkan pemesanan.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="nama_penumpang">Nama Lengkap *</Label>
                                            <Input
                                                id="nama_penumpang"
                                                value={data.nama_penumpang}
                                                onChange={(e) => setData('nama_penumpang', e.target.value)}
                                                error={errors.nama_penumpang}
                                                placeholder="Sesuai KTP/Paspor"
                                            />
                                            {errors.nama_penumpang && (
                                                <p className="mt-1 text-sm text-red-600">{errors.nama_penumpang}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="email_penumpang">Email *</Label>
                                            <Input
                                                id="email_penumpang"
                                                type="email"
                                                value={data.email_penumpang}
                                                onChange={(e) => setData('email_penumpang', e.target.value)}
                                                error={errors.email_penumpang}
                                                placeholder="Untuk kirim tiket"
                                            />
                                            {errors.email_penumpang && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email_penumpang}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="no_telp_penumpang">No. Telepon *</Label>
                                            <Input
                                                id="no_telp_penumpang"
                                                value={data.no_telp_penumpang}
                                                onChange={(e) => setData('no_telp_penumpang', e.target.value)}
                                                error={errors.no_telp_penumpang}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            {errors.no_telp_penumpang && (
                                                <p className="mt-1 text-sm text-red-600">{errors.no_telp_penumpang}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="alamat_penumpang">Alamat Lengkap</Label>
                                            <Input
                                                id="alamat_penumpang"
                                                value={data.alamat_penumpang}
                                                onChange={(e) => setData('alamat_penumpang', e.target.value)}
                                                error={errors.alamat_penumpang}
                                                placeholder="Alamat penjemputan (opsional)"
                                            />
                                            {errors.alamat_penumpang && (
                                                <p className="mt-1 text-sm text-red-600">{errors.alamat_penumpang}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="catatan">Catatan Tambahan</Label>
                                        <textarea
                                            id="catatan"
                                            value={data.catatan}
                                            onChange={(e) => setData('catatan', e.target.value)}
                                            placeholder="Contoh: Barang bawaan, titip jemput, dll (opsional)"
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        {errors.catatan && (
                                            <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">Total Pembayaran</p>
                                            <p className="text-sm text-gray-600">Transfer ke rekening CV Baruna Travel</p>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-600">{formatRupiah(totalBayar)}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            asChild
                                        >
                                            <Link href={`/pelanggan/jadwal/${jadwal.id}`}>Batal</Link>
                                        </Button>
                                        <Button type="submit" className="flex-1 gap-2" disabled={processing}>
                                            {processing ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                            {!processing && <ArrowRight className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Cara Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex gap-3">
                                    <Badge className="mt-0.5">1</Badge>
                                    <p>Klik "Konfirmasi Pesanan"</p>
                                </div>
                                <div className="flex gap-3">
                                    <Badge className="mt-0.5">2</Badge>
                                    <p>Catat kode booking</p>
                                </div>
                                <div className="flex gap-3">
                                    <Badge className="mt-0.5">3</Badge>
                                    <p>Transfer sesuai total</p>
                                </div>
                                <div className="flex gap-3">
                                    <Badge className="mt-0.5">4</Badge>
                                    <p>Upload bukti transfer</p>
                                </div>
                                <div className="flex gap-3">
                                    <Badge className="mt-0.5">5</Badge>
                                    <p>Tunggu verifikasi admin</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Rekening Tujuan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold">Bank BRI</p>
                                    <p className="text-gray-600">1234-5678-9000</p>
                                    <p className="text-gray-600">a.n CV Baruna Travel</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Bank Mandiri</p>
                                    <p className="text-gray-600">0987-6543-2100</p>
                                    <p className="text-gray-600">a.n CV Baruna Travel</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4 text-sm text-amber-800">
                                <p className="font-semibold mb-2">⚠️ Catatan Penting:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Pembayaran harus dilakukan dalam 2x24 jam</li>
                                    <li>• Kursi akan dikunci setelah pesanan dikonfirmasi</li>
                                    <li>• Batalkan pesanan jika tidak jadi melakukan pembayaran</li>
                                    <li>• Tiket dapat dicetak setelah pembayaran diverifikasi</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
