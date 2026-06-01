import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

interface Pembayaran {
    id: number;
    pemesanan_id: number;
    bukti_transfer: string;
    tanggal_transfer: string;
    pemesanan: {
        id: number;
        kode_booking: string;
        status_bayar: string;
        total_bayar: number;
        user: { name: string; email: string };
        jadwal: {
            tanggal_berangkat: string;
            rute: {
                kota_asal: string;
                kota_tujuan: string;
            }
        }
    }
}

interface PaginationData {
    data: Pembayaran[];
    links: any[];
}

export default function PembayaranIndex({ pembayaran }: { pembayaran: PaginationData }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleVerifikasi = (id: number, status: 'lunas' | 'batal') => {
        const message = status === 'lunas' 
            ? 'Apakah Anda yakin ingin menyetujui pembayaran ini? E-Ticket akan otomatis terbit.' 
            : 'Apakah Anda yakin ingin menolak pembayaran ini? Status pesanan akan dibatalkan.';
            
        if (confirm(message)) {
            router.post(`/admin/pembayaran/${id}/verifikasi`, {
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
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Verifikasi Pembayaran" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Verifikasi Pembayaran</h1>
                        <p className="text-muted-foreground">Periksa dan validasi bukti transfer yang diunggah pelanggan.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Bukti Pembayaran</CardTitle>
                        <CardDescription>Semua pembayaran yang masuk ke sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode & Pelanggan</TableHead>
                                        <TableHead>Waktu Transfer</TableHead>
                                        <TableHead>Total Tagihan</TableHead>
                                        <TableHead>Bukti</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi Verifikasi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pembayaran.data.length > 0 ? (
                                        pembayaran.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="font-semibold text-primary">
                                                        <Link href={`/admin/pemesanan/${item.pemesanan.id}`} className="hover:underline">
                                                            {item.pemesanan.kode_booking}
                                                        </Link>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.pemesanan.user.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        {formatDate(item.tanggal_transfer)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold">
                                                        {formatRupiah(item.pemesanan.total_bayar)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        {item.bukti_transfer && item.bukti_transfer !== 'undefined' ? (
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" onClick={() => setSelectedImage(`/storage/${item.bukti_transfer}`)}>
                                                                    <FileText className="h-4 w-4 mr-2" />
                                                                    Lihat Bukti
                                                                </Button>
                                                            </DialogTrigger>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">Tidak ada</span>
                                                        )}
                                                        <DialogContent className="max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>Bukti Transfer</DialogTitle>
                                                                <DialogDescription>
                                                                    Kode Booking: {item.pemesanan.kode_booking}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-lg">
                                                                {selectedImage && (
                                                                    <img src={selectedImage} alt="Bukti Transfer" className="max-w-full max-h-[60vh] object-contain rounded-md" />
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell>
                                                    {item.pemesanan.status_bayar === 'pending' && <Badge variant="outline" className="text-yellow-600 border-yellow-600">Menunggu Verifikasi</Badge>}
                                                    {item.pemesanan.status_bayar === 'lunas' && <Badge className="bg-green-600">Lunas</Badge>}
                                                    {item.pemesanan.status_bayar === 'batal' && <Badge variant="destructive">Batal/Ditolak</Badge>}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.pemesanan.status_bayar === 'pending' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerifikasi(item.id, 'lunas')}>
                                                                <CheckCircle className="mr-1 h-4 w-4" /> Setujui
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={() => handleVerifikasi(item.id, 'batal')}>
                                                                <XCircle className="mr-1 h-4 w-4" /> Tolak
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground italic">Sudah diverifikasi</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                Tidak ada bukti pembayaran yang perlu diverifikasi.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PembayaranIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Verifikasi Pembayaran', href: '/admin/pembayaran' },
    ],
};
