import { Head, Link, useForm } from '@inertiajs/react';
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
    CheckCircle,
    Clock,
    FileText,
    IndianRupee,
    MapPin,
    Receipt,
    Upload,
    Users,
    XCircle,
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
    detailPemesanan: Array<{
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
        const formData = new FormData();
        formData.append('pemesanan_id', String(data.pemesanan_id));
        if (data.pembayaran_id) {
            formData.append('pembayaran_id', String(data.pembayaran_id));
        }
        if (data.bukti_transfer) {
            formData.append('bukti_transfer', data.bukti_transfer);
        }

        post('/pelanggan/pembayaran', {
            forceFormData: true,
            data: formData,
        });
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
            <Head title={`Upload Bukti Pembayaran - ${pemesanan.kode_booking}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2">
                    <Link href={`/pelanggan/pemesanan/${pemesanan.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Detail
                    </Link>
                </Button>

                <h1 className="text-2xl font-bold text-gray-900">Upload Bukti Pembayaran</h1>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Upload Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    {existingPayment ? 'Update Bukti Transfer' : 'Upload Bukti Transfer'}
                                </CardTitle>
                                <CardDescription>
                                    {existingPayment
                                        ? 'Upload ulang bukti transfer jika ada kesalahan.'
                                        : 'Upload bukti transfer setelah melakukan pembayaran.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="bukti_transfer">
                                            Bukti Transfer *{' '}
                                            {existingPayment && (
                                                <span className="text-sm text-gray-500">(kosongkan jika tidak ingin mengubah)</span>
                                            )}
                                        </Label>
                                        <div className="mt-2">
                                            <Input
                                                id="bukti_transfer"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                error={errors.bukti_transfer}
                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            {errors.bukti_transfer && (
                                                <p className="mt-1 text-sm text-red-600">{errors.bukti_transfer}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                Format: JPG, PNG, JPEG. Maksimal 2MB.
                                            </p>
                                        </div>
                                    </div>

                                    {data.bukti_transfer && (
                                        <Card className="border-dashed">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-8 w-8 text-blue-600" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{data.bukti_transfer.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(data.bukti_transfer.size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setData('bukti_transfer', null)}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {existingPayment && pemesanan.pembayaran?.bukti_transfer && (
                                        <Card className="border-dashed bg-gray-50">
                                            <CardContent className="p-4">
                                                <p className="text-sm text-gray-500 mb-2">Bukti Transfer saat ini:</p>
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <a
                                                        href={`/storage/${pemesanan.pembayaran.bukti_transfer}`}
                                                        target="_blank"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        Lihat Bukti
                                                    </a>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" className="flex-1" asChild>
                                            <Link href={`/pelanggan/pemesanan/${pemesanan.id}`}>Batal</Link>
                                        </Button>
                                        <Button type="submit" className="flex-1 gap-2" disabled={processing}>
                                            {processing ? (
                                                'Memproses...'
                                            ) : existingPayment ? (
                                                'Update Bukti'
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4" />
                                                    Upload Bukti
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-4">
                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Kode Booking</span>
                                    <span className="font-semibold">{pemesanan.kode_booking}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Rute</span>
                                    <span className="font-semibold">
                                        {pemesanan.jadwal.rute.kota_asal} → {pemesanan.jadwal.rute.kota_tujuan}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tanggal</span>
                                    <span className="font-semibold">{formatDate(pemesanan.jadwal.tanggal_berangkat)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Jam</span>
                                    <span className="font-semibold">{pemesanan.jadwal.jam_berangkat}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Kursi</span>
                                    <span className="font-semibold">
                                        {pemesanan.detailPemesanan.map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ')}
                                    </span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-blue-600">
                                        {formatRupiah(pemesanan.total_bayar)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bank Info */}
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

                        {/* Note */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 text-sm text-blue-800">
                                <p className="font-semibold mb-2">ℹ️ Catatan:</p>
                                <ul className="space-y-1">
                                    <li>• Pastukkan nama & nominal transfer sesuai</li>
                                    <li>• Upload struk transfer yang jelas</li>
                                    <li>• Verifikasi membutuhkan 1-24 jam</li>
                                    <li>• Tiket dapat dicetak setelah lunas</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
