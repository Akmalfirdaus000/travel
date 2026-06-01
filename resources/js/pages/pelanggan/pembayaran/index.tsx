import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
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
    Upload,
} from 'lucide-react';

interface Pembayaran {
    id: number;
    bukti_transfer?: string;
    tanggal_transfer: string;
    created_at: string;
    pemesanan: {
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
            };
            armada: {
                plat_nomor: string;
                tipe_mobil: string;
            };
        };
    };
}

interface PembayaranIndexProps {
    pembayaran: {
        data: Pembayaran[];
        current_page: number;
        last_page: number;
        links: any[];
    };
}

export default function PembayaranIndex({ pembayaran }: PembayaranIndexProps) {
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
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
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

    const getVerificationStatus = (pembayaran: Pembayaran) => {
        const { status_bayar } = pembayaran.pemesanan;

        if (status_bayar === 'lunas') {
            return (
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Terverifikasi</span>
                </div>
            );
        } else if (status_bayar === 'pending') {
            return (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">Menunggu Verifikasi</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Ditolak</span>
                </div>
            );
        }
    };

    return (
        <>
            <Head title="Riwayat Pembayaran - CV Baruna Travel" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Pembayaran</h1>
                        <p className="text-gray-600">Daftar bukti pembayaran yang telah Anda upload</p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/pelanggan/pemesanan">
                            <Bus className="h-4 w-4" />
                            Pesan Tiket Baru
                        </Link>
                    </Button>
                </div>

                {/* Pembayaran List */}
                {pembayaran.data.length > 0 ? (
                    <div className="grid gap-4">
                        {pembayaran.data.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-4">
                                        <div className="bg-blue-50 p-4 md:col-span-1">
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500">Kode Booking</p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {item.pemesanan.kode_booking}
                                                </p>
                                            </div>
                                            <div className="mb-3">
                                                {getVerificationStatus(item)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Upload: {formatShortDate(item.tanggal_transfer)}
                                            </div>
                                        </div>
                                        <div className="p-4 md:col-span-2">
                                            <div className="mb-3 flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-blue-600" />
                                                <span className="font-semibold">
                                                    {item.pemesanan.jadwal.rute.kota_asal} →{' '}
                                                    {item.pemesanan.jadwal.rute.kota_tujuan}
                                                </span>
                                                {getStatusBadge(item.pemesanan.status_bayar)}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatShortDate(item.pemesanan.jadwal.tanggal_berangkat)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{item.pemesanan.jadwal.jam_berangkat}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bus className="h-4 w-4" />
                                                    <span>{item.pemesanan.jadwal.armada.tipe_mobil}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{item.pemesanan.jadwal.armada.plat_nomor}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-l bg-gray-50 p-4 md:col-span-1">
                                            <div className="mb-3 text-right">
                                                <p className="text-xs text-gray-500">Total Pembayaran</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {formatRupiah(item.pemesanan.total_bayar)}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                {item.bukti_transfer && item.bukti_transfer !== 'undefined' && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full justify-start gap-2"
                                                    >
                                                        <a
                                                            href={`/storage/${item.bukti_transfer}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            Lihat Bukti
                                                        </a>
                                                    </Button>
                                                )}
                                                {item.pemesanan.status_bayar === 'pending' && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full justify-start gap-2"
                                                    >
                                                        <Link
                                                            href={`/pelanggan/pembayaran/create/${item.pemesanan.id}`}
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                            Re-upload
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="w-full justify-start gap-2"
                                                >
                                                    <Link href={`/pelanggan/pemesanan/${item.pemesanan.id}`}>
                                                        <Receipt className="h-4 w-4" />
                                                        Detail Pesanan
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Belum ada riwayat pembayaran
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Anda belum mengupload bukti pembayaran manapun
                            </p>
                            <Button asChild>
                                <Link href="/pelanggan/pemesanan">
                                    <Bus className="h-4 w-4" />
                                    Cari Jadwal
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {pembayaran.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {pembayaran.links.map((link, index) => (
                            <Button
                                key={index}
                                asChild={link.url !== null}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) window.location.href = link.url;
                                }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

PembayaranIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/pelanggan/dashboard',
        },
        {
            title: 'Upload Bukti Bayar',
            href: '/pelanggan/pembayaran',
        },
    ],
};
