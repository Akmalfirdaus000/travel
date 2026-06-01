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
            estimasi_waktu_jam?: number;
        };
        armada: {
            plat_nomor: string;
            tipe_mobil: string;
        };
        supir: {
            nama_supir: string;
        };
    };
    detail_pemesanan?: Array<{
        nomor_kursi: number;
    }>;
    pembayaran?: Array<{
        id: number;
        bukti_transfer?: string;
    }>;
}

interface PemesananIndexProps {
    pemesanan: {
        data: Pemesanan[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    tab?: string;
}

export default function PemesananIndex({ pemesanan, tab = 'pesanan' }: PemesananIndexProps) {
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

    const getStatusBadge = (item: Pemesanan) => {
        if (item.status_bayar === 'pending' && item.pembayaran && item.pembayaran.length > 0) {
            return <Badge className="bg-blue-100 text-blue-700">Sudah Dibayar</Badge>;
        }
        switch (item.status_bayar) {
            case 'lunas':
                return <Badge className="bg-green-100 text-green-700">Lunas</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
            case 'batal':
                return <Badge className="bg-red-100 text-red-700">Batal</Badge>;
            default:
                return <Badge>{item.status_bayar}</Badge>;
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

    const getTravelStatusBadge = (item: Pemesanan) => {
        // Parse date and time manually to avoid NaN issues on different browsers
        const datePart = item.jadwal.tanggal_berangkat.substring(0, 10); // get YYYY-MM-DD
        const [year, month, day] = datePart.split('-');
        const [hour, min] = item.jadwal.jam_berangkat.split(':');
        const departureTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(min), 0).getTime();
        const now = new Date().getTime();

        const diffHours = (now - departureTime) / (1000 * 60 * 60);
        const estimasi = item.jadwal.rute.estimasi_waktu_jam || 6;

        if (diffHours < 0) {
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1 w-fit">
                    Menunggu Perjalanan
                </Badge>
            );
        } else if (diffHours >= 0 && diffHours < estimasi) {
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1 w-fit">
                    Sedang Dalam Perjalanan
                </Badge>
            );
        } else {
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 mt-1 w-fit">
                    Perjalanan Selesai
                </Badge>
            );
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
            <Head title="Pemesanan - CV Baruna Travel" />
            <div className="flex flex-1 flex-col gap-6 p-4 max-w-6xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pemesanan Saya</h1>
                        <p className="text-gray-600">Kelola dan lacak perjalanan Anda</p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/pelanggan/jadwal">
                            <Bus className="h-4 w-4" />
                            Pesan Tiket Baru
                        </Link>
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <Link
                        href="/pelanggan/pemesanan?tab=pesanan"
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                            tab === 'pesanan'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Pesanan Aktif
                    </Link>
                    <Link
                        href="/pelanggan/pemesanan?tab=riwayat"
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                            tab === 'riwayat'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Riwayat Perjalanan
                    </Link>
                </div>

                {/* Filter Section */}
                <Card className="shadow-sm">
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
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 h-10"
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
                        {filteredPemesanan.map((item) => {
                            const hasPayment = item.pembayaran && item.pembayaran.length > 0;
                            return (
                            <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-4">
                                        <div className="bg-primary/5 p-5 md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                                            <div className="mb-3">
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Kode Booking</p>
                                                <p className="text-xl font-bold text-primary tracking-tight">{item.kode_booking}</p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getStatusIcon(item.status_bayar)}
                                                    {getStatusBadge(item)}
                                                </div>
                                            <div className="flex flex-col gap-1.5 mt-1">
                                                {item.status_bayar === 'pending' && hasPayment && (
                                                    <Badge variant="outline" className="text-xs bg-white text-blue-600 border-blue-200 w-fit">
                                                        Menunggu verifikasi
                                                    </Badge>
                                                )}
                                                {getTravelStatusBadge(item)}
                                            </div>
                                            </div>
                                        </div>
                                        <div className="p-5 md:col-span-2 flex flex-col justify-center">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                <span className="font-semibold text-lg text-gray-900">
                                                    {item.jadwal.rute.kota_asal} → {item.jadwal.rute.kota_tujuan}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">{formatDate(item.jadwal.tanggal_berangkat)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">{item.jadwal.jam_berangkat.substring(0, 5)} WIB</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">Kursi: {(item.detail_pemesanan || []).map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Bus className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">{item.jadwal.armada.tipe_mobil}</span>
                                                </div>
                                            </div>
                                            {item.status_bayar === 'pending' && !hasPayment && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    <Button asChild size="sm" variant="default" className="shadow-sm">
                                                        <Link href={`/pelanggan/pemesanan/${item.id}`}>
                                                            <Receipt className="h-4 w-4 mr-2" />
                                                            Upload Bukti Bayar
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Link
                                                            href={`/pelanggan/pemesanan/${item.id}/cancel`}
                                                            method="post"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Batalkan
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t md:border-t-0 md:border-l border-gray-100 bg-white p-5 md:col-span-1 flex flex-col justify-between">
                                            <div className="mb-4 text-left md:text-right">
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Biaya</p>
                                                <p className="text-2xl font-black text-gray-900">
                                                    {formatRupiah(item.total_bayar)}
                                                </p>
                                            </div>
                                            <div className="space-y-2.5 mt-auto">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full justify-center shadow-sm"
                                                >
                                                    <Link href={`/pelanggan/pemesanan/${item.id}`}>
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Lihat Detail
                                                    </Link>
                                                </Button>
                                                {item.status_bayar === 'lunas' && tab === 'pesanan' && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="w-full justify-center shadow-sm"
                                                    >
                                                        <Link href={`/pelanggan/pemesanan/${item.id}/eticket`}>
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Cetak Tiket
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )})}
                    </div>
                ) : (
                    <Card className="border-dashed border-2">
                        <CardContent className="p-16 text-center">
                            <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Receipt className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Tidak ada pemesanan ditemukan'
                                    : tab === 'pesanan' 
                                        ? 'Belum ada pesanan aktif' 
                                        : 'Belum ada riwayat perjalanan'}
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Coba ubah kata kunci atau filter pencarian Anda'
                                    : tab === 'pesanan'
                                        ? 'Mulai pesan tiket perjalanan Anda sekarang dan nikmati perjalanan yang nyaman.'
                                        : 'Perjalanan yang sudah lewat jadwalnya akan otomatis tampil di sini.'}
                            </p>
                            {!searchQuery && statusFilter === 'all' && tab === 'pesanan' && (
                                <Button asChild size="lg" className="shadow-sm">
                                    <Link href="/pelanggan/jadwal">
                                        <Bus className="h-4 w-4 mr-2" />
                                        Cari Jadwal Perjalanan
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {pemesanan.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
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
