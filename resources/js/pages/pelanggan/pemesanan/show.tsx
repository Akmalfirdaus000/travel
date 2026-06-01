import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Bus,
    Calendar,
    Clock,
    FileText,
    MapPin,
    Receipt,
    Users,
    XCircle,
    Download,
    Phone,
    Upload,
    Ticket,
    Building2,
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
    detail_pemesanan?: Array<{
        nomor_kursi: number;
    }>;
    pembayaran?: Array<{
        id: number;
        bukti_transfer?: string;
        tanggal_transfer?: string;
    }>;
}

interface PemesananShowProps {
    pemesanan: Pemesanan;
}

export default function PemesananShow({ pemesanan }: PemesananShowProps) {
    const { auth } = usePage().props;

    const latestPayment = pemesanan.pembayaran && pemesanan.pembayaran.length > 0 
        ? pemesanan.pembayaran[pemesanan.pembayaran.length - 1] 
        : null;

    const { data, setData, post, processing, errors } = useForm({
        pemesanan_id: pemesanan.id,
        pembayaran_id: latestPayment?.id || '',
        bukti_transfer: null as File | null,
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('bukti_transfer', e.target.files[0]);
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('pemesanan_id', String(data.pemesanan_id));
        if (data.bukti_transfer) {
            formData.append('bukti_transfer', data.bukti_transfer);
        }

        if (data.pembayaran_id) {
            router.post(`/pelanggan/pembayaran/${data.pembayaran_id}`, {
                _method: 'put',
                forceFormData: true,
                ...data,
                onSuccess: () => setData('bukti_transfer', null)
            } as any);
        } else {
            post('/pelanggan/pembayaran', {
                forceFormData: true,
                onSuccess: () => setData('bukti_transfer', null)
            });
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'pending' && latestPayment) {
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Menunggu Verifikasi</Badge>;
        }
        switch (status) {
            case 'lunas':
                return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Lunas</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Belum Dibayar</Badge>;
            case 'batal':
                return <Badge variant="destructive">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title={`Detail Pemesanan - ${pemesanan.kode_booking}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-6xl mx-auto w-full">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2 -ml-3 text-muted-foreground hover:text-foreground">
                    <Link href="/pelanggan/pemesanan">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Riwayat
                    </Link>
                </Button>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-2">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Kode Booking</p>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{pemesanan.kode_booking}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(pemesanan.status_bayar)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column: Trip & Passenger Details (Spans 2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Trip Details Card */}
                        <Card className="shadow-sm border-muted overflow-hidden">
                            <div className="bg-primary/5 p-4 border-b border-muted">
                                <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                    <Bus className="h-5 w-5 text-primary" />
                                    Informasi Perjalanan
                                </h2>
                            </div>
                            <CardContent className="p-0">
                                <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-muted">
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Rute</p>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                                <span className="font-bold text-lg">{pemesanan.jadwal.rute.kota_asal} <ArrowLeft className="inline h-4 w-4 mx-1 rotate-180 text-muted-foreground" /> {pemesanan.jadwal.rute.kota_tujuan}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Waktu Keberangkatan</p>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                                                <span className="font-medium">{formatDate(pemesanan.jadwal.tanggal_berangkat)}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                                                <span className="font-bold text-lg text-primary">{pemesanan.jadwal.jam_berangkat.substring(0, 5)} WIB</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6 bg-muted/5">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Armada & Supir</p>
                                            <div className="flex items-start gap-3 mb-3">
                                                <Bus className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{pemesanan.jadwal.armada.tipe_mobil}</p>
                                                    <Badge variant="outline" className="mt-1 font-mono text-xs">{pemesanan.jadwal.armada.plat_nomor}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">{pemesanan.jadwal.supir.nama_supir}</p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" /> {pemesanan.jadwal.supir.no_telp_supir}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Kursi Anda</p>
                                            <div className="flex items-start gap-3">
                                                <Ticket className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-xl text-primary">{(pemesanan.detail_pemesanan || []).map((d) => d.nomor_kursi).sort((a, b) => a - b).join(', ')}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{pemesanan.detail_pemesanan?.length || 0} kursi dipesan</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Passenger Details Card */}
                        <Card className="shadow-sm border-muted overflow-hidden">
                            <div className="bg-muted/10 p-4 border-b border-muted">
                                <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                    <Users className="h-5 w-5 text-foreground/70" />
                                    Data Pemesan
                                </h2>
                            </div>
                            <CardContent className="p-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Nama Lengkap</p>
                                        <p className="font-semibold text-foreground text-lg">{pemesanan.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Kontak</p>
                                        <p className="font-medium text-foreground">{pemesanan.user?.pelanggan?.no_telp || '-'}</p>
                                        <p className="text-sm text-muted-foreground">{pemesanan.user?.email || '-'}</p>
                                    </div>
                                    <div className="sm:col-span-2 pt-4 border-t border-muted">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Waktu Transaksi</p>
                                        <p className="font-medium text-foreground">{formatDateTime(pemesanan.tanggal_pesan)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment & Actions (Spans 1 column) */}
                    <div className="space-y-6">
                        
                        {/* Total Card */}
                        <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
                            <CardContent className="p-6">
                                <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">Total Tagihan</p>
                                <p className="text-4xl font-black text-primary tracking-tight">
                                    {formatRupiah(pemesanan.total_bayar)}
                                </p>
                                
                                <div className="mt-6 space-y-3">
                                    {pemesanan.status_bayar === 'lunas' && (
                                        <Button asChild size="lg" className="w-full shadow-sm">
                                            <Link href={`/pelanggan/pemesanan/${pemesanan.id}/eticket`}>
                                                <Download className="h-5 w-5 mr-2" />
                                                Unduh E-Tiket
                                            </Link>
                                        </Button>
                                    )}
                                    {pemesanan.status_bayar === 'pending' && !latestPayment && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                                        >
                                            <Link href={`/pelanggan/pemesanan/${pemesanan.id}/cancel`} method="post">
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Batalkan Pesanan
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rekening Card (If Pending & No Payment Uploaded) */}
                        {pemesanan.status_bayar === 'pending' && !latestPayment && (
                            <Card className="shadow-sm border-muted">
                                <CardHeader className="p-4 border-b border-muted bg-muted/5">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Transfer Ke Rekening
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-white shadow-sm">
                                        <div className="bg-[#00529C] text-white font-bold p-1.5 rounded text-xs w-12 text-center shrink-0">BRI</div>
                                        <div>
                                            <p className="font-mono font-bold text-sm tracking-wider">1234-5678-9000</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">a.n CV Baruna Travel</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-white shadow-sm">
                                        <div className="bg-[#0066AE] text-white font-bold p-1.5 rounded text-xs w-12 text-center shrink-0">BCA</div>
                                        <div>
                                            <p className="font-mono font-bold text-sm tracking-wider">0987-6543-2100</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">a.n CV Baruna Travel</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Upload / Detail Payment Card */}
                        <Card className="shadow-sm border-muted">
                            <CardHeader className="p-4 border-b border-muted bg-muted/5">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Receipt className="h-4 w-4" />
                                    {pemesanan.status_bayar === 'pending' && !latestPayment ? 'Upload Bukti' : 'Bukti Pembayaran'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {latestPayment ? (
                                    <div className="space-y-4">
                                        {latestPayment.tanggal_transfer && (
                                            <div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Waktu Upload</p>
                                                <p className="font-medium text-sm">{formatDateTime(latestPayment.tanggal_transfer)}</p>
                                            </div>
                                        )}
                                        
                                        {latestPayment.bukti_transfer && latestPayment.bukti_transfer !== 'undefined' && (
                                            <div className="border-t border-muted pt-4">
                                                <div className="rounded-lg border border-border overflow-hidden bg-muted/30 mb-3 flex justify-center p-2">
                                                    <img
                                                        src={`/storage/${latestPayment.bukti_transfer}`}
                                                        alt="Bukti Transfer"
                                                        className="w-full h-auto max-h-48 object-contain rounded"
                                                    />
                                                </div>
                                                <Button asChild size="sm" variant="outline" className="w-full">
                                                    <a href={`/storage/${latestPayment.bukti_transfer}`} target="_blank" rel="noopener noreferrer">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Lihat Dokumen
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : pemesanan.status_bayar === 'pending' ? (
                                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="rounded-xl border-2 border-dashed border-muted p-4 text-center bg-muted/5 hover:bg-muted/10 transition-colors">
                                                <Input
                                                    id="bukti_transfer"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <Label htmlFor="bukti_transfer" className="cursor-pointer flex flex-col items-center">
                                                    <div className="rounded-full bg-primary/10 p-2 mb-2">
                                                        <Upload className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-semibold text-foreground text-sm">Pilih File Bukti</span>
                                                    <span className="text-[10px] text-muted-foreground mt-1">JPG, PNG maks. 2MB.</span>
                                                </Label>
                                            </div>
                                            {errors.bukti_transfer && (
                                                <p className="text-xs font-medium text-destructive">{errors.bukti_transfer}</p>
                                            )}
                                        </div>

                                        {data.bukti_transfer && (
                                            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-2 rounded-lg">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FileText className="h-4 w-4 text-primary shrink-0" />
                                                    <div className="truncate">
                                                        <p className="text-xs font-semibold truncate">{data.bukti_transfer.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{(data.bukti_transfer.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => setData('bukti_transfer', null)}>
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full" disabled={processing || !data.bukti_transfer}>
                                            {processing ? 'Memproses...' : 'Kirim Bukti Pembayaran'}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2 mx-auto">
                                            <XCircle className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">Dibatalkan</p>
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
