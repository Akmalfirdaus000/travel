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
    MapPin,
    User,
    Phone,
    Users,
    Receipt,
    AlertCircle,
    Building2,
    Ticket,
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
            <Head title="Konfirmasi Pemesanan Tiket" />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2 -ml-3 text-muted-foreground hover:text-foreground">
                    <Link href={`/pelanggan/jadwal/${jadwal.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Pilihan Kursi
                    </Link>
                </Button>

                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Konfirmasi Pemesanan</h1>
                    <p className="text-muted-foreground mt-1">Lengkapi data penumpang untuk mengamankan kursi Anda.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Trip Details & Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trip Details */}
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="bg-muted/10 border-b border-muted">
                                <CardTitle className="flex items-center gap-2">
                                    <Bus className="h-5 w-5 text-primary" />
                                    Detail Perjalanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-muted rounded-md mt-0.5">
                                                <MapPin className="h-4 w-4 text-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Rute</p>
                                                <p className="font-semibold text-lg text-foreground mt-0.5">
                                                    {jadwal.rute.kota_asal} → {jadwal.rute.kota_tujuan}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-muted rounded-md mt-0.5">
                                                <Calendar className="h-4 w-4 text-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Waktu Keberangkatan</p>
                                                <p className="font-semibold text-foreground mt-0.5">{formatDate(jadwal.tanggal_berangkat)}</p>
                                                <p className="text-sm text-muted-foreground mt-0.5">{jadwal.jam_berangkat.substring(0, 5)} WIB</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-muted rounded-md mt-0.5">
                                                <Bus className="h-4 w-4 text-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Armada</p>
                                                <p className="font-semibold text-foreground mt-0.5">{jadwal.armada.tipe_mobil}</p>
                                                <Badge variant="outline" className="mt-1 font-mono text-xs">{jadwal.armada.plat_nomor}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-primary/10 rounded-md mt-0.5">
                                                <Ticket className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Kursi Dipilih</p>
                                                <p className="font-semibold text-foreground mt-0.5">{kursiTerpilih.sort((a, b) => a - b).join(', ')}</p>
                                                <p className="text-sm text-muted-foreground mt-0.5">{kursiTerpilih.length} kursi</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passenger Manifest Form */}
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="bg-muted/10 border-b border-muted">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Data Penumpang
                                </CardTitle>
                                <CardDescription>
                                    {user
                                        ? 'Data Anda digunakan sebagai pemesan utama. Sesuaikan jika memesan untuk orang lain.'
                                        : 'Lengkapi data penumpang untuk keperluan tiket.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form id="pemesanan-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_penumpang" className="font-semibold">Nama Lengkap <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="nama_penumpang"
                                                value={data.nama_penumpang}
                                                onChange={(e) => setData('nama_penumpang', e.target.value)}
                                                className={errors.nama_penumpang ? 'border-destructive focus-visible:ring-destructive' : ''}
                                                placeholder="Sesuai KTP/Identitas"
                                            />
                                            {errors.nama_penumpang && (
                                                <p className="text-sm font-medium text-destructive">{errors.nama_penumpang}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email_penumpang" className="font-semibold">Email <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="email_penumpang"
                                                type="email"
                                                value={data.email_penumpang}
                                                onChange={(e) => setData('email_penumpang', e.target.value)}
                                                className={errors.email_penumpang ? 'border-destructive focus-visible:ring-destructive' : ''}
                                                placeholder="Untuk pengiriman e-ticket"
                                            />
                                            {errors.email_penumpang && (
                                                <p className="text-sm font-medium text-destructive">{errors.email_penumpang}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="no_telp_penumpang" className="font-semibold">No. Whatsapp <span className="text-destructive">*</span></Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="no_telp_penumpang"
                                                    value={data.no_telp_penumpang}
                                                    onChange={(e) => setData('no_telp_penumpang', e.target.value)}
                                                    className={`pl-9 ${errors.no_telp_penumpang ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                    placeholder="08xxxxxxxxxx"
                                                />
                                            </div>
                                            {errors.no_telp_penumpang && (
                                                <p className="text-sm font-medium text-destructive">{errors.no_telp_penumpang}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="alamat_penumpang" className="font-semibold">Alamat Lengkap</Label>
                                            <Input
                                                id="alamat_penumpang"
                                                value={data.alamat_penumpang}
                                                onChange={(e) => setData('alamat_penumpang', e.target.value)}
                                                className={errors.alamat_penumpang ? 'border-destructive focus-visible:ring-destructive' : ''}
                                                placeholder="Alamat domisili atau penjemputan"
                                            />
                                            {errors.alamat_penumpang && (
                                                <p className="text-sm font-medium text-destructive">{errors.alamat_penumpang}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="catatan" className="font-semibold">Catatan Tambahan (Opsional)</Label>
                                        <textarea
                                            id="catatan"
                                            value={data.catatan}
                                            onChange={(e) => setData('catatan', e.target.value)}
                                            placeholder="Contoh: Bawa barang banyak, titik penjemputan spesifik, dll"
                                            rows={3}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        />
                                        {errors.catatan && (
                                            <p className="text-sm font-medium text-destructive">{errors.catatan}</p>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        <Card className="shadow-md border-primary/20">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                                <CardTitle className="text-lg">Ringkasan Biaya</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Harga per kursi</span>
                                        <span className="font-medium">{formatRupiah(jadwal.rute.harga_tiket)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Jumlah kursi</span>
                                        <span className="font-medium">x {kursiTerpilih.length}</span>
                                    </div>
                                    <div className="pt-4 border-t border-muted flex flex-col gap-1">
                                        <p className="text-sm font-medium text-muted-foreground">Total yang harus dibayar</p>
                                        <p className="text-3xl font-black text-primary">{formatRupiah(totalBayar)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-muted">
                                    <Button type="submit" form="pemesanan-form" size="lg" className="w-full gap-2 shadow-md" disabled={processing}>
                                        {processing ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                                        {!processing && <ArrowRight className="h-4 w-4" />}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-3">
                                        Dengan menekan tombol di atas, Anda menyetujui syarat & ketentuan kami.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-muted">
                            <CardHeader className="bg-muted/10 border-b border-muted pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Receipt className="h-4 w-4" />
                                    Cara Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4 text-sm text-muted-foreground">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                                    <p className="mt-0.5">Klik "Lanjut ke Pembayaran"</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                                    <p className="mt-0.5">Transfer sesuai total biaya ke salah satu rekening Bank kami.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                                    <p className="mt-0.5">Upload struk / bukti transfer.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">4</div>
                                    <p className="mt-0.5">Admin akan memverifikasi dan E-Ticket siap dicetak.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-destructive/5 border-destructive/20 shadow-none">
                            <CardContent className="p-4 text-sm text-destructive/80">
                                <div className="flex gap-2 font-semibold mb-2 items-center">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>Penting</p>
                                </div>
                                <ul className="space-y-1.5 pl-6 list-disc">
                                    <li>Pembayaran maksimal 2x24 jam.</li>
                                    <li>Kursi akan dikunci setelah Anda membuat pesanan.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
