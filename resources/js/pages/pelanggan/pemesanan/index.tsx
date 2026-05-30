import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    ArrowRight,
    Bus,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    IndianRupee,
    MapPin,
    Search,
    XCircle,
    Download,
    Receipt,
    Users,
} from 'lucide-react';
import { useState } from 'react';

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
        status_verifikasi?: 'pending' | 'approved' | 'rejected';
    };
}

interface PemesananIndexProps {
    pemesanan: {
        data: Pemesanan[];
        current_page: number;
        last_page: number;
        links: any[];
    };
}

export default function PemesananIndex({ pemesanan }: PemesananIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'lunas':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'batal':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return null;
        }
    };

    const filteredPemesanan = pemesanan.data.filter((item) => {
        const matchesSearch =
            searchQuery === '' ||
            item.kode_booking.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.jadwal.rute.kota_asal.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.jadwal.rute.kota_tujuan.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.status_bayar === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head title="Riwayat Pemesanan - CV Baruna Travel" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Pemesanan</h1>
                        <p className="text-gray-600">Kelola dan lacak pemesanan tiket Anda</p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/pelanggan/jadwal">
                            <Bus className="h-4 w-4" />
                            Pesan Tiket Baru
                        </Link>
                    </Button>
                </div>

                {/* Filter Section */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Cari kode booking atau rute..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="lunas">Lunas</option>
                                    <option value="batal">Batal</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pemesanan List */}
                {filteredPemesanan.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredPemesanan.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-4">
                                        <div className="bg-blue-50 p-4 md:col-span-1">
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500">Kode Booking</p>
                                                <p className="text-lg font-bold text-blue-600">{item.kode_booking}</p>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getStatusIcon(item.status_bayar)}
                                                    {getStatusBadge(item.status_bayar)}
                                                </div>
                                                {item.status_bayar === 'pending' && item.pembayaran && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.pembayaran.status_verifikasi === 'pending'
                                                            ? 'Menunggu verifikasi'
                                                            : item.pembayaran.status_verifikasi === 'rejected'
                                                                ? 'Ditolak'
                                                                : ''}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4 md:col-span-2">
                                            <div className="mb-3 flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-blue-600" />
                                                <span className="font-semibold">
                                                    {item.jadwal.rute.kota_asal} → {item.jadwal.rute.kota_tujuan}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(item.jadwal.tanggal_berangkat)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{item.jadwal.jam_berangkat}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{item.detailPemesanan.map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bus className="h-4 w-4" />
                                                    <span>{item.jadwal.armada.tipe_mobil}</span>
                                                </div>
                                            </div>
                                            {item.status_bayar === 'pending' && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/pelanggan/pembayaran/create/${item.id}`}>
                                                            <Receipt className="h-4 w-4" />
                                                            Upload Bukti Bayar
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Link
                                                            href={`/pelanggan/pemesanan/${item.id}/cancel`}
                                                            method="post"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            Batalkan
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-l bg-gray-50 p-4 md:col-span-1">
                                            <div className="mb-3 text-right">
                                                <p className="text-xs text-gray-500">Total Biaya</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {formatRupiah(item.total_bayar)}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full justify-start gap-2"
                                                >
                                                    <Link href={`/pelanggan/pemesanan/${item.id}`}>
                                                        <FileText className="h-4 w-4" />
                                                        Detail
                                                    </Link>
                                                </Button>
                                                {item.status_bayar === 'lunas' && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="w-full justify-start gap-2"
                                                    >
                                                        <Link href={`/pelanggan/pemesanan/${item.id}/eticket`}>
                                                            <Download className="h-4 w-4" />
                                                            Cetak Tiket
                                                        </Link>
                                                    </Button>
                                                )}
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
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Tidak ada pemesanan ditemukan'
                                    : 'Belum ada pemesanan'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Coba ubah filter pencarian'
                                    : 'Mulai pesan tiket perjalanan Anda sekarang'}
                            </p>
                            {!searchQuery && statusFilter === 'all' && (
                                <Button asChild>
                                    <Link href="/pelanggan/jadwal">
                                        <Bus className="h-4 w-4" />
                                        Cari Jadwal
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {pemesanan.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {pemesanan.links.map((link, index) => (
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
