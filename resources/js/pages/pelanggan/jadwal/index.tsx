import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Bus,
    MapPin,
    Clock,
    Users,
    Calendar,
    Search,
    Filter,
    ArrowRight,
    IndianRupee,
} from 'lucide-react';
import { useState } from 'react';

interface Jadwal {
    id: number;
    tanggal_berangkat: string;
    jam_berangkat: string;
    rute: {
        id: number;
        kota_asal: string;
        kota_tujuan: string;
        harga_tiket: number;
    };
    armada: {
        id: number;
        plat_nomor: string;
        tipe_mobil: string;
        kapasitas_kursi: number;
    };
    supir: {
        id: number;
        nama_supir: string;
    };
    available_seats?: number;
}

interface Rute {
    id: number;
    kota_asal: string;
    kota_tujuan: string;
    harga_tiket: number;
}

interface JadwalIndexProps {
    jadwal: {
        data: Jadwal[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    rute: Rute[];
    filters: {
        rute_id?: string;
        kota_asal?: string;
        kota_tujuan?: string;
        tanggal?: string;
    };
}

export default function JadwalIndex({ jadwal, rute, filters }: JadwalIndexProps) {
    const [searchFilters, setSearchFilters] = useState({
        rute_id: filters.rute_id || '',
        kota_asal: filters.kota_asal || '',
        kota_tujuan: filters.kota_tujuan || '',
        tanggal: filters.tanggal || '',
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

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (searchFilters.rute_id) params.append('rute_id', searchFilters.rute_id);
        if (searchFilters.kota_asal) params.append('kota_asal', searchFilters.kota_asal);
        if (searchFilters.kota_tujuan) params.append('kota_tujuan', searchFilters.kota_tujuan);
        if (searchFilters.tanggal) params.append('tanggal', searchFilters.tanggal);

        window.location.href = `/pelanggan/jadwal?${params.toString()}`;
    };

    const resetFilters = () => {
        setSearchFilters({
            rute_id: '',
            kota_asal: '',
            kota_tujuan: '',
            tanggal: '',
        });
        window.location.href = '/pelanggan/jadwal';
    };

    const uniqueRoutes = [
        ...new Map(rute.map((r) => [r.kota_asal + ' - ' + r.kota_tujuan, r])).values(),
    ];

    const citiesAsal = [...new Set(rute.map((r) => r.kota_asal))];
    const citiesTujuan = [...new Set(rute.map((r) => r.kota_tujuan))];

    return (
        <>
            <Head title="Jadwal & Tarif - CV Baruna Travel" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jadwal & Tarif</h1>
                    <p className="text-gray-600">Cari jadwal keberangkatan dan lihat tarif tiket</p>
                </div>

                {/* Filter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Cari Jadwal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div>
                                <Label htmlFor="rute">Rute</Label>
                                <select
                                    id="rute"
                                    value={searchFilters.rute_id}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, rute_id: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Semua Rute</option>
                                    {uniqueRoutes.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.kota_asal} → {r.kota_tujuan} ({formatRupiah(r.harga_tiket)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="asal">Kota Asal</Label>
                                <select
                                    id="asal"
                                    value={searchFilters.kota_asal}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, kota_asal: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Semua Kota</option>
                                    {citiesAsal.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="tujuan">Kota Tujuan</Label>
                                <select
                                    id="tujuan"
                                    value={searchFilters.kota_tujuan}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, kota_tujuan: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Semua Kota</option>
                                    {citiesTujuan.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="tanggal">Tanggal Keberangkatan</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={searchFilters.tanggal}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, tanggal: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button onClick={handleFilter} className="gap-2">
                                <Search className="h-4 w-4" />
                                Cari Jadwal
                            </Button>
                            <Button onClick={resetFilters} variant="outline">
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Routes Catalog */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IndianRupee className="h-5 w-5" />
                            Daftar Rute & Tarif
                        </CardTitle>
                        <CardDescription>
                            Daftar lengkap rute yang tersedia dengan harga tiket
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Rute
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            Jam Keberangkatan
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Harga Tiket
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uniqueRoutes.map((r) => (
                                        <tr key={r.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Bus className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">
                                                        {r.kota_asal} → {r.kota_tujuan}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Badge variant="outline">10.00 WIB</Badge>
                                                    <Badge variant="outline">22.00 WIB</Badge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-blue-600">
                                                {formatRupiah(r.harga_tiket)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule List */}
                {jadwal.data.length > 0 ? (
                    <div className="grid gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Jadwal Tersedia ({jadwal.data.length} jadwal ditemukan)
                        </h2>
                        {jadwal.data.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-4">
                                        <div className="bg-blue-50 p-4 md:col-span-1">
                                            <div className="mb-3 flex items-center gap-2 text-blue-600">
                                                <Calendar className="h-5 w-5" />
                                                <span className="font-semibold">
                                                    {formatDate(item.tanggal_berangkat)}
                                                </span>
                                            </div>
                                            <div className="mb-3 flex items-center gap-2 text-gray-700">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-lg font-bold">{item.jam_berangkat}</span>
                                            </div>
                                            <Badge className="bg-green-100 text-green-700">
                                                {item.available_seats ?? '?'} Kursi Tersedia
                                            </Badge>
                                        </div>
                                        <div className="p-4 md:col-span-2">
                                            <div className="mb-3 flex items-center gap-2">
                                                <MapPin className="h-5 w-5 text-blue-600" />
                                                <span className="text-lg font-bold">
                                                    {item.rute.kota_asal} → {item.rute.kota_tujuan}
                                                </span>
                                            </div>
                                            <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Bus className="h-4 w-4" />
                                                    <span>{item.armada.tipe_mobil}</span>
                                                    <span className="text-gray-400">({item.armada.plat_nomor})</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{item.armada.kapasitas_kursi} kursi</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{item.supir.nama_supir}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-l bg-gray-50 p-4 md:col-span-1">
                                            <div className="mb-3 text-right">
                                                <p className="text-sm text-gray-500">Harga Tiket</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {formatRupiah(item.rute.harga_tiket)}
                                                </p>
                                            </div>
                                            <Button
                                                asChild
                                                className="w-full"
                                                disabled={(item.available_seats ?? 0) < 1}
                                            >
                                                <Link href={`/pelanggan/jadwal/${item.id}`}>
                                                    Pilih Kursi
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Bus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Tidak ada jadwal ditemukan
                            </h3>
                            <p className="text-gray-500">
                                Coba ubah filter pencarian atau pilih tanggal lain
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {jadwal.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {jadwal.links.map((link, index) => (
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
