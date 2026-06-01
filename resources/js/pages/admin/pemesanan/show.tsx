import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, MapPin, Calendar, Clock, User, Phone, CheckCircle, XCircle, Eye, Printer, Car, CreditCard, FileText } from 'lucide-react';
import { useState } from 'react';

interface Pemesanan {
    id: number;
    kode_booking: string;
    total_bayar: number;
    status_bayar: string;
    tanggal_pesan: string;
    user: { name: string; email: string; pelanggan?: { no_telp?: string } };
    jadwal: {
        id: number;
        tanggal_berangkat: string;
        jam_berangkat: string;
        rute: { kota_asal: string; kota_tujuan: string; harga_tiket: number; estimasi_waktu_jam: number };
        armada: { plat_nomor: string; tipe_mobil: string };
        supir: { nama_supir: string; no_telp_supir: string };
    };
    detail_pemesanan: { id: number; nomor_kursi: number }[];
    pembayaran?: {
        id: number;
        bukti_transfer: string;
        tanggal_transfer: string;
    }[];
}

export default function PemesananShow({ pemesanan }: { pemesanan: Pemesanan }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const latestPayment = pemesanan.pembayaran && pemesanan.pembayaran.length > 0 
        ? pemesanan.pembayaran[pemesanan.pembayaran.length - 1] 
        : null;

    const handleVerifikasi = (status: 'lunas' | 'batal') => {
        if (!latestPayment) return;
        
        const message = status === 'lunas' 
            ? 'Setujui pembayaran ini?' 
            : 'Tolak pembayaran ini?';
            
        if (confirm(message)) {
            router.post(`/admin/pembayaran/${latestPayment.id}/verifikasi`, {
                _method: 'patch',
                status_bayar: status
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
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const getStatusPerjalanan = () => {
        if (pemesanan.status_bayar !== 'lunas') return null;
        const now = new Date();
        const departureDateTime = new Date(`${pemesanan.jadwal.tanggal_berangkat.split('T')[0]}T${pemesanan.jadwal.jam_berangkat}`);
        const arrivalDateTime = new Date(departureDateTime);
        arrivalDateTime.setHours(arrivalDateTime.getHours() + pemesanan.jadwal.rute.estimasi_waktu_jam);

        if (now < departureDateTime) return <Badge variant="secondary">Menunggu Keberangkatan</Badge>;
        if (now >= departureDateTime && now < arrivalDateTime) return <Badge className="bg-blue-500 hover:bg-blue-600">Dalam Perjalanan</Badge>;
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
    };

    return (
        <>
            <Head title={`Detail Pemesanan ${pemesanan.kode_booking}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/pemesanan"><ChevronLeft className="h-4 w-4" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Pemesanan</h1>
                            <p className="text-muted-foreground">{pemesanan.kode_booking}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {pemesanan.status_bayar === 'pending' && <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-sm px-4 py-1">Pending</Badge>}
                        {pemesanan.status_bayar === 'lunas' && <Badge className="bg-green-600 text-sm px-4 py-1">Lunas</Badge>}
                        {pemesanan.status_bayar === 'batal' && <Badge variant="destructive" className="text-sm px-4 py-1">Batal</Badge>}
                        {getStatusPerjalanan()}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column: Booking Info & Customer Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Informasi Jadwal & Rute</CardTitle>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Rute Perjalanan</div>
                                        <div className="font-semibold text-lg">{pemesanan.jadwal.rute.kota_asal} &rarr; {pemesanan.jadwal.rute.kota_tujuan}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Waktu Keberangkatan</div>
                                        <div className="font-medium flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(pemesanan.jadwal.tanggal_berangkat)}</div>
                                        <div className="font-medium flex items-center gap-2 mt-1"><Clock className="h-4 w-4" /> Pukul {pemesanan.jadwal.jam_berangkat.substring(0, 5)} WIB</div>
                                        <div className="text-sm text-muted-foreground mt-1">Est. Waktu Tempuh: {pemesanan.jadwal.rute.estimasi_waktu_jam} Jam</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Armada & Supir</div>
                                        <div className="font-medium flex items-center gap-2"><Car className="h-4 w-4" /> {pemesanan.jadwal.armada.tipe_mobil} ({pemesanan.jadwal.armada.plat_nomor})</div>
                                        <div className="font-medium flex items-center gap-2 mt-1"><User className="h-4 w-4" /> {pemesanan.jadwal.supir.nama_supir}</div>
                                        <div className="text-sm text-muted-foreground mt-1">Telp Supir: {pemesanan.jadwal.supir.no_telp_supir}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Data Pelanggan</CardTitle>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Nama Lengkap</div>
                                    <div className="font-medium">{pemesanan.user.name}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                                    <div className="font-medium">{pemesanan.user.email}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Nomor Telepon</div>
                                    <div className="font-medium">{pemesanan.user.pelanggan?.no_telp || '-'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment & Seats Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Rincian Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Harga per Tiket</span>
                                    <span className="font-medium">{formatRupiah(pemesanan.jadwal.rute.harga_tiket)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Jumlah Kursi</span>
                                    <span className="font-medium">{pemesanan.detail_pemesanan.length} Kursi</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-lg">Total Tagihan</span>
                                    <span className="font-bold text-xl text-primary">{formatRupiah(pemesanan.total_bayar)}</span>
                                </div>
                                
                                <div className="pt-4 space-y-2">
                                    <div className="text-sm text-muted-foreground mb-2">Kursi yang dipesan:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {pemesanan.detail_pemesanan.map((detail) => (
                                            <Badge key={detail.id} variant="secondary" className="px-3 py-1 text-sm">
                                                Kursi {detail.nomor_kursi}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Proof Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bukti Transfer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {latestPayment ? (
                                    <div className="space-y-4">
                                        <div className="text-sm text-muted-foreground">
                                            Diunggah pada: {new Date(latestPayment.tanggal_transfer).toLocaleString('id-ID')}
                                        </div>
                                        <Dialog>
                                            {latestPayment.bukti_transfer && latestPayment.bukti_transfer !== 'undefined' ? (
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full" onClick={() => setSelectedImage(`/storage/${latestPayment.bukti_transfer}`)}>
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Lihat Bukti Transfer
                                                    </Button>
                                                </DialogTrigger>
                                            ) : null}
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Bukti Transfer</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
                                                    {selectedImage && (
                                                        <img src={selectedImage} alt="Bukti Transfer" className="max-w-full max-h-[60vh] object-contain rounded-md" />
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {pemesanan.status_bayar === 'pending' && (
                                            <div className="flex gap-2 pt-2">
                                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleVerifikasi('lunas')}>
                                                    <CheckCircle className="mr-1 h-4 w-4" /> Lunas
                                                </Button>
                                                <Button className="flex-1" variant="destructive" onClick={() => handleVerifikasi('batal')}>
                                                    <XCircle className="mr-1 h-4 w-4" /> Batal
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                        <CreditCard className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">Pelanggan belum<br/>mengunggah bukti pembayaran.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

PemesananShow.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Manajemen Pemesanan', href: '/admin/pemesanan' },
        { title: 'Detail Pemesanan', href: '#' },
    ],
};
