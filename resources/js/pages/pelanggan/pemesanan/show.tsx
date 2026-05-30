import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    Users,
    XCircle,
    Download,
    Phone,
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
            kapasitas_kursi: number;
        };
        supir: {
            nama_supir: string;
            no_telp_supir: string;
        };
    };
    user: {
        name: string;
        email: string;
        pelanggan?: {
            no_telp: string;
        };
    };
    detailPemesanan: Array<{
        nomor_kursi: number;
    }>;
    pembayaran?: {
        id: number;
        bukti_transfer?: string;
        tanggal_transfer?: string;
        status_verifikasi?: 'pending' | 'approved' | 'rejected';
    };
}

interface PemesananShowProps {
    pemesanan: Pemesanan;
}

export default function PemesananShow({ pemesanan }: PemesananShowProps) {
    const { auth } = usePage().props;

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

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'lunas':
                return <Badge className="bg-green-100 text-green-700">Lunas</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
            case 'batal':
                return <Badge className="bg-red-100 text-red-700">Batal</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getVerificationBadge = () => {
        if (!pemesanan.pembayaran) return null;

        switch (pemesanan.pembayaran.status_verifikasi) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-700">Terverifikasi</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-700">Ditolak</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700">Menunggu Verifikasi</Badge>;
        }
    };

    return (
        <>
            <Head title={`Detail Pemesanan - ${pemesanan.kode_booking}`} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2">
                    <Link href="/pelanggan/pemesanan">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Riwayat
                    </Link>
                </Button>

                {/* Booking Code Card */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Kode Booking</p>
                                <p className="text-3xl font-bold text-blue-600">{pemesanan.kode_booking}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                    {getStatusBadge(pemesanan.status_bayar)}
                                </div>
                                {pemesanan.pembayaran && (
                                    <div className="flex items-center gap-2">
                                        {getVerificationBadge()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Trip Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bus className="h-5 w-5 text-blue-600" />
                            Detail Perjalanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Rute Perjalanan</p>
                                        <p className="font-semibold text-lg">
                                            {pemesanan.jadwal.rute.kota_asal} → {pemesanan.jadwal.rute.kota_tujuan}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Keberangkatan</p>
                                        <p className="font-semibold">{formatDate(pemesanan.jadwal.tanggal_berangkat)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Jam Keberangkatan</p>
                                        <p className="font-semibold">{pemesanan.jadwal.jam_berangkat}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Bus className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Armada</p>
                                        <p className="font-semibold">{pemesanan.jadwal.armada.tipe_mobil}</p>
                                        <p className="text-sm text-gray-400">{pemesanan.jadwal.armada.plat_nomor}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Supir</p>
                                        <p className="font-semibold">{pemesanan.jadwal.supir.nama_supir}</p>
                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                            <Phone className="h-3 w-3" />
                                            {pemesanan.jadwal.supir.no_telp_supir}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nomor Kursi</p>
                                        <p className="font-semibold">
                                            {pemesanan.detailPemesanan.map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ')}
                                        </p>
                                        <p className="text-sm text-gray-400">{pemesanan.detailPemesanan.length} kursi</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Passenger Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Data Penumpang
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Nama Penumpang</p>
                                <p className="font-semibold">{pemesanan.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{pemesanan.user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">No. Telepon</p>
                                <p className="font-semibold">{pemesanan.user.pelanggan?.no_telp || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Waktu Pemesanan</p>
                                <p className="font-semibold">{formatDateTime(pemesanan.tanggal_pesan)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Details */}
                {pemesanan.pembayaran && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Detail Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500">Status Pembayaran</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getStatusBadge(pemesanan.status_bayar)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status Verifikasi</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getVerificationBadge()}
                                    </div>
                                </div>
                                {pemesanan.pembayaran.tanggal_transfer && (
                                    <div>
                                        <p className="text-sm text-gray-500">Waktu Upload</p>
                                        <p className="font-semibold">{formatDateTime(pemesanan.pembayaran.tanggal_transfer)}</p>
                                    </div>
                                )}
                                {pemesanan.pembayaran.bukti_transfer && (
                                    <div>
                                        <p className="text-sm text-gray-500">Bukti Transfer</p>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="mt-1"
                                        >
                                            <a
                                                href={`/storage/${pemesanan.pembayaran.bukti_transfer}`}
                                                target="_blank"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Lihat Bukti
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Total & Actions */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Biaya Pemesanan</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {formatRupiah(pemesanan.total_bayar)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {pemesanan.status_bayar === 'pending' && (
                                    <>
                                        {pemesanan.pembayaran ? (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                            >
                                                <Link href={`/pelanggan/pembayaran/create/${pemesanan.id}`}>
                                                    <Receipt className="h-4 w-4" />
                                                    Re-upload Bukti
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                asChild
                                                size="lg"
                                            >
                                                <Link href={`/pelanggan/pembayaran/create/${pemesanan.id}`}>
                                                    <Receipt className="h-4 w-4" />
                                                    Upload Bukti Bayar
                                                </Link>
                                            </Button>
                                        )}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="lg"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Link
                                                href={`/pelanggan/pemesanan/${pemesanan.id}/cancel`}
                                                method="post"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Batalkan
                                            </Link>
                                        </Button>
                                    </>
                                )}
                                {pemesanan.status_bayar === 'lunas' && (
                                    <Button asChild size="lg" className="gap-2">
                                        <Link href={`/pelanggan/pemesanan/${pemesanan.id}/eticket`}>
                                            <Download className="h-4 w-4" />
                                            Cetak Tiket
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
