import { Head, Link, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    FileText,
    Receipt,
    Upload,
    XCircle,
    Building2,
    Info,
    CheckCircle2
} from 'lucide-react';

interface Pemesanan {
    id: number;
    kode_booking: string;
    total_bayar: number;
    status_bayar: 'pending' | 'lunas' | 'batal';
    tanggal_pesan: string;
    jadwal: {
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
        supir: {
            nama_supir: string;
        };
    };
    detailPemesanan?: Array<{
        nomor_kursi: number;
    }>;
    pembayaran?: {
        id: number;
        bukti_transfer?: string;
        tanggal_transfer?: string;
    };
}

interface PembayaranCreateProps {
    pemesanan: Pemesanan;
    existingPayment?: boolean;
}

export default function PembayaranCreate({ pemesanan, existingPayment = false }: PembayaranCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        pemesanan_id: pemesanan.id,
        pembayaran_id: pemesanan.pembayaran?.id,
        bukti_transfer: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('bukti_transfer', e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If updating existing payment, use PUT method
        if (data.pembayaran_id) {
            const formData = new FormData();
            if (data.bukti_transfer) {
                formData.append('bukti_transfer', data.bukti_transfer);
            }

            router.put(`/pelanggan/pembayaran/${data.pembayaran_id}`, {
                forceFormData: true,
                data: formData,
            });
        } else {
            // New payment, use POST method
            const formData = new FormData();
            formData.append('pemesanan_id', String(data.pemesanan_id));
            if (data.bukti_transfer) {
                formData.append('bukti_transfer', data.bukti_transfer);
            }

            post('/pelanggan/pembayaran', {
                forceFormData: true,
                data: formData,
            });
        }
    };

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

    return (
        <>
            <Head title={`Pembayaran - ${pemesanan.kode_booking}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2 -ml-3 text-muted-foreground hover:text-foreground">
                    <Link href={`/pelanggan/pemesanan/${pemesanan.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Detail
                    </Link>
                </Button>

                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Konfirmasi Pembayaran</h1>
                    <p className="text-muted-foreground mt-1">Selesaikan pembayaran untuk mengamankan tiket perjalanan Anda.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Upload Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="bg-muted/10 border-b border-muted">
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-primary" />
                                    {existingPayment ? 'Update Bukti Transfer' : 'Upload Bukti Transfer'}
                                </CardTitle>
                                <CardDescription>
                                    {existingPayment
                                        ? 'Perbarui bukti transfer Anda jika sebelumnya ditolak atau terdapat kesalahan.'
                                        : 'Mohon upload struk bukti transfer setelah Anda melakukan pembayaran ke rekening kami.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="bukti_transfer" className="text-sm font-semibold">
                                            File Bukti Transfer <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="rounded-xl border-2 border-dashed border-muted p-8 text-center bg-muted/5 hover:bg-muted/10 transition-colors">
                                            <Input
                                                id="bukti_transfer"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <Label htmlFor="bukti_transfer" className="cursor-pointer flex flex-col items-center">
                                                <div className="rounded-full bg-primary/10 p-4 mb-4">
                                                    <Upload className="h-6 w-6 text-primary" />
                                                </div>
                                                <span className="font-semibold text-foreground">Klik untuk mengunggah file</span>
                                                <span className="text-sm text-muted-foreground mt-1">atau seret file ke area ini</span>
                                                <span className="text-xs text-muted-foreground/70 mt-4">Format: JPG, PNG, JPEG. Maksimal 2MB.</span>
                                            </Label>
                                        </div>
                                        {errors.bukti_transfer && (
                                            <p className="mt-2 text-sm font-medium text-destructive">{errors.bukti_transfer}</p>
                                        )}
                                    </div>

                                    {data.bukti_transfer && (
                                        <Card className="border-primary/20 bg-primary/5 shadow-none">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="bg-primary/20 p-2 rounded text-primary">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="font-medium text-sm text-foreground truncate">{data.bukti_transfer.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(data.bukti_transfer.size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setData('bukti_transfer', null)}
                                                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {existingPayment && pemesanan.pembayaran?.bukti_transfer && pemesanan.pembayaran?.bukti_transfer !== 'undefined' && !data.bukti_transfer && (
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium text-muted-foreground">Bukti transfer saat ini:</p>
                                            <div className="rounded-xl border border-muted overflow-hidden bg-muted/10 p-2 max-w-sm">
                                                <img
                                                    src={`/storage/${pemesanan.pembayaran.bukti_transfer}`}
                                                    alt="Bukti Transfer"
                                                    className="w-full h-auto rounded"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4 border-t border-muted">
                                        <Button type="button" variant="outline" className="flex-1" asChild>
                                            <Link href={`/pelanggan/pemesanan/${pemesanan.id}`}>Batal</Link>
                                        </Button>
                                        <Button type="submit" className="flex-1 gap-2" disabled={processing || (!data.bukti_transfer && !existingPayment)}>
                                            {processing ? (
                                                'Memproses...'
                                            ) : existingPayment ? (
                                                'Simpan Perubahan'
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4" />
                                                    Kirim Bukti Pembayaran
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="bg-muted/10 border-b border-muted pb-4">
                                <CardTitle className="text-base flex items-center justify-between">
                                    Ringkasan Pesanan
                                    <span className="text-xs font-mono bg-background px-2 py-1 rounded border border-border text-muted-foreground">{pemesanan.kode_booking}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Rute</p>
                                    <p className="font-semibold text-sm">
                                        {pemesanan.jadwal.rute.kota_asal} → {pemesanan.jadwal.rute.kota_tujuan}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Tanggal</p>
                                        <p className="font-semibold text-sm">{formatDate(pemesanan.jadwal.tanggal_berangkat)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Jam</p>
                                        <p className="font-semibold text-sm">{pemesanan.jadwal.jam_berangkat.substring(0,5)} WIB</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Kursi ({pemesanan.detailPemesanan?.length || 0})</p>
                                    <p className="font-semibold text-sm">
                                        {(pemesanan.detailPemesanan || []).map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ')}
                                    </p>
                                </div>
                                <div className="border-t border-muted pt-4 flex flex-col gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Total yang harus dibayar</p>
                                    <p className="text-2xl font-black text-primary">
                                        {formatRupiah(pemesanan.total_bayar)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bank Info */}
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="bg-muted/10 border-b border-muted pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Rekening Tujuan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                                    <div className="bg-blue-100 text-blue-700 font-bold p-2 rounded text-xs w-12 text-center shrink-0">BRI</div>
                                    <div>
                                        <p className="font-mono font-bold tracking-wider">1234-5678-9000</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">a.n CV Baruna Travel</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                                    <div className="bg-yellow-100 text-yellow-700 font-bold p-2 rounded text-xs w-12 text-center shrink-0">BCA</div>
                                    <div>
                                        <p className="font-mono font-bold tracking-wider">0987-6543-2100</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">a.n CV Baruna Travel</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Note */}
                        <Card className="bg-primary/5 border-primary/20 shadow-none">
                            <CardContent className="p-5 text-sm">
                                <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                                    <Info className="h-4 w-4" />
                                    <p>Panduan Pembayaran</p>
                                </div>
                                <ul className="space-y-2.5 text-muted-foreground">
                                    <li className="flex gap-2 items-start">
                                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span>Transfer sesuai dengan <strong>Total Bayar</strong> hingga 3 digit terakhir.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span>Pastikan nama pengirim dan nominal terlihat jelas di struk.</span>
                                    </li>
                                    <li className="flex gap-2 items-start">
                                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span>Proses verifikasi memakan waktu 5-30 menit pada jam kerja.</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
