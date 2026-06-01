import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    Ticket,
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
            day: 'numeric',
            month: 'long',
            year: 'numeric',
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
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Jadwal & Tarif</h1>
                        <p className="text-lg text-muted-foreground">Cari jadwal keberangkatan dan pesan tiket perjalanan Anda</p>
                    </div>
                    
                    {/* Routes Catalog Modal */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                Daftar Harga Rute
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Daftar Rute & Tarif</DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap rute perjalanan yang tersedia beserta harganya.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto pr-2">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-background/95 backdrop-blur z-10">
                                        <tr className="border-b">
                                            <th className="py-3 text-left font-semibold text-muted-foreground">Rute Perjalanan</th>
                                            <th className="py-3 text-right font-semibold text-muted-foreground">Harga Tiket</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uniqueRoutes.map((r) => (
                                            <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Bus className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">
                                                            {r.kota_asal} → {r.kota_tujuan}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right font-bold text-foreground">
                                                    {formatRupiah(r.harga_tiket)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filter Section */}
                <Card className="border-muted bg-card">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5 text-muted-foreground" />
                            Filter Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="rute">Rute</Label>
                                <Select
                                    value={searchFilters.rute_id || 'all'}
                                    onValueChange={(val) => setSearchFilters({ ...searchFilters, rute_id: val === 'all' ? '' : val })}
                                >
                                    <SelectTrigger id="rute">
                                        <SelectValue placeholder="Semua Rute" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Rute</SelectItem>
                                        {uniqueRoutes.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {r.kota_asal} → {r.kota_tujuan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="asal">Kota Asal</Label>
                                <Select
                                    value={searchFilters.kota_asal || 'all'}
                                    onValueChange={(val) => setSearchFilters({ ...searchFilters, kota_asal: val === 'all' ? '' : val })}
                                >
                                    <SelectTrigger id="asal">
                                        <SelectValue placeholder="Semua Kota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kota</SelectItem>
                                        {citiesAsal.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tujuan">Kota Tujuan</Label>
                                <Select
                                    value={searchFilters.kota_tujuan || 'all'}
                                    onValueChange={(val) => setSearchFilters({ ...searchFilters, kota_tujuan: val === 'all' ? '' : val })}
                                >
                                    <SelectTrigger id="tujuan">
                                        <SelectValue placeholder="Semua Kota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kota</SelectItem>
                                        {citiesTujuan.map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tanggal">Tanggal</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={searchFilters.tanggal}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, tanggal: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Button onClick={handleFilter} className="w-full sm:w-auto gap-2">
                                <Search className="h-4 w-4" />
                                Cari Jadwal
                            </Button>
                            <Button onClick={resetFilters} variant="outline" className="w-full sm:w-auto">
                                Reset Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule List */}
                {jadwal.data.length > 0 ? (
                    <div className="grid gap-4 mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-semibold text-foreground tracking-tight">
                                Hasil Pencarian
                            </h2>
                            <Badge variant="secondary" className="px-3 py-1">
                                {jadwal.data.length} Jadwal ditemukan
                            </Badge>
                        </div>
                        
                        {jadwal.data.map((item) => (
                            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Date & Time Section */}
                                        <div className="bg-muted/30 p-6 flex flex-col justify-center items-center md:w-48 border-b md:border-b-0 md:border-r border-border shrink-0">
                                            <div className="text-center mb-3">
                                                <div className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 mb-1.5">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(item.tanggal_berangkat)}
                                                </div>
                                                <div className="text-4xl font-black tracking-tighter text-foreground">
                                                    {item.jam_berangkat.substring(0, 5)}
                                                </div>
                                            </div>
                                            <Badge variant={item.available_seats === 0 ? "destructive" : "secondary"} className="w-full justify-center">
                                                {item.available_seats ?? '?'} Kursi Tersedia
                                            </Badge>
                                        </div>
                                        
                                        {/* Route Details Section */}
                                        <div className="p-6 flex-1 flex flex-col justify-center">
                                            <div className="flex items-center gap-4 mb-5">
                                                <span className="text-xl font-bold tracking-tight">{item.rute.kota_asal}</span>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-xl font-bold tracking-tight">{item.rute.kota_tujuan}</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2.5">
                                                    <Bus className="h-4 w-4 text-primary" />
                                                    <span className="font-medium text-foreground">{item.armada.tipe_mobil}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Ticket className="h-4 w-4 text-primary" />
                                                    <span className="font-medium text-foreground">{item.armada.plat_nomor}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    <span className="font-medium text-foreground">{item.supir.nama_supir}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Section */}
                                        <div className="bg-muted/10 p-6 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center items-center md:items-end md:w-56 shrink-0">
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Harga per kursi</p>
                                            <p className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                                                {formatRupiah(item.rute.harga_tiket)}
                                            </p>
                                            {(item.available_seats ?? 0) < 1 ? (
                                                <Button
                                                    className="w-full"
                                                    size="lg"
                                                    disabled
                                                >
                                                    Habis
                                                </Button>
                                            ) : (
                                                <Button
                                                    asChild
                                                    className="w-full"
                                                    size="lg"
                                                >
                                                    <Link href={`/pelanggan/jadwal/${item.id}`}>
                                                        Pilih Kursi
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-dashed mt-4">
                        <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Bus className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Tidak ada jadwal ditemukan
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Kami tidak dapat menemukan jadwal yang sesuai dengan filter Anda. Silakan coba ubah tanggal atau rute pencarian.
                            </p>
                            <Button onClick={resetFilters} variant="outline" className="mt-6">
                                Reset Pencarian
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {jadwal.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
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
