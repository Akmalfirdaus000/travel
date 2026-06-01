import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Bus,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    MapPin,
    Phone,
    Printer,
    QrCode,
    User,
    Users,
    Ticket,
    Info,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
            alamat: string;
        };
    };
    detail_pemesanan?: Array<{
        nomor_kursi: number;
    }>;
    pembayaran?: {
        id: number;
        bukti_transfer?: string;
        tanggal_transfer?: string;
    };
}

interface ETicketProps {
    pemesanan: Pemesanan;
}

export default function ETicket({ pemesanan }: ETicketProps) {
    const { auth } = usePage().props;
    const [isPrinting, setIsPrinting] = useState(false);

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

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    };

    const handleDownloadPDF = () => {
        alert('Fitur download PDF akan segera tersedia. Silakan gunakan tombol Cetak untuk menyimpan sebagai PDF.');
    };

    const sortedKursi = (pemesanan.detail_pemesanan || []).map((d) => d.nomor_kursi).sort((a, b) => a - b);

    // Generate QR code placeholder data
    const qrData = sortedKursi.length > 0 
        ? `BRN-${pemesanan.kode_booking}-${pemesanan.jadwal.id}-${sortedKursi.join('-')}` 
        : `BRN-${pemesanan.kode_booking}-${pemesanan.jadwal.id}`;

    return (
        <>
            <Head title={`E-Tiket - ${pemesanan.kode_booking}`} />
            <div className="min-h-screen bg-muted/30 p-4 sm:p-6 print:bg-white print:p-0">
                {/* Print Controls - Hidden when printing */}
                <div className="mx-auto max-w-4xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                    <Button asChild variant="ghost" className="gap-2 self-start sm:self-auto text-muted-foreground hover:text-foreground">
                        <Link href={`/pelanggan/pemesanan/${pemesanan.id}`}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Detail
                        </Link>
                    </Button>
                    <div className="flex w-full sm:w-auto gap-3">
                        <Button onClick={handlePrint} className="flex-1 sm:flex-none gap-2 shadow-sm" disabled={isPrinting}>
                            <Printer className="h-4 w-4" />
                            {isPrinting ? 'Mencetak...' : 'Cetak Tiket'}
                        </Button>
                        {/* <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 sm:flex-none gap-2 bg-white shadow-sm">
                            <Download className="h-4 w-4" />
                            Unduh PDF
                        </Button> */}
                    </div>
                </div>

                {/* Ticket - Printable Area */}
                <div className="mx-auto max-w-4xl print:max-w-none">
                    <Card className="overflow-hidden border-0 shadow-lg print:shadow-none print:border print:rounded-none bg-white">
                        <CardContent className="p-0">
                            {/* Premium Header */}
                            <div className="bg-primary text-primary-foreground p-8 relative overflow-hidden">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                                
                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner">
                                            <Bus className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-black tracking-tight drop-shadow-sm">BARUNA TRAVEL</h1>
                                            <p className="text-primary-foreground/80 font-medium tracking-wide text-sm mt-1 uppercase">Official E-Ticket / Boarding Pass</p>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                                        <div>
                                            <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-wider mb-1">Status Pembayaran</p>
                                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm px-3 py-1 font-bold text-sm tracking-wide">
                                                <CheckCircle className="h-4 w-4 mr-1.5 inline" />
                                                LUNAS
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Body Layout */}
                            <div className="flex flex-col md:flex-row">
                                {/* Main Content - Left Side */}
                                <div className="flex-1 p-8">
                                    {/* Route Info */}
                                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-dashed border-gray-200">
                                        <div className="text-center w-5/12">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Asal / Origin</p>
                                            <p className="text-3xl md:text-4xl font-black text-foreground truncate">{pemesanan.jadwal.rute.kota_asal}</p>
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                                            <div className="w-full h-0.5 bg-gray-200 absolute top-1/2 -translate-y-1/2 z-0"></div>
                                            <div className="bg-white z-10 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                                <Bus className="h-6 w-6 text-primary" />
                                            </div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3">Perjalanan Darat</p>
                                        </div>

                                        <div className="text-center w-5/12">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Tujuan / Destination</p>
                                            <p className="text-3xl md:text-4xl font-black text-foreground truncate">{pemesanan.jadwal.rute.kota_tujuan}</p>
                                        </div>
                                    </div>

                                    {/* Detailed Information Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
                                        <div>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Tanggal</p>
                                            <p className="font-semibold text-gray-900">{formatDate(pemesanan.jadwal.tanggal_berangkat)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Keberangkatan</p>
                                            <p className="font-bold text-xl text-primary">{pemesanan.jadwal.jam_berangkat.substring(0, 5)} WIB</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-2">
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Penumpang Utama</p>
                                            <p className="font-semibold text-gray-900 truncate">{pemesanan.user.name}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{pemesanan.user.pelanggan?.no_telp || '-'}</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Bus className="h-3.5 w-3.5" /> Armada</p>
                                            <p className="font-semibold text-gray-900">{pemesanan.jadwal.armada.tipe_mobil}</p>
                                            <Badge variant="outline" className="mt-1 font-mono text-xs bg-gray-50">{pemesanan.jadwal.armada.plat_nomor}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Supir</p>
                                            <p className="font-semibold text-gray-900">{pemesanan.jadwal.supir.nama_supir}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{pemesanan.jadwal.supir.no_telp_supir}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-2 bg-primary/5 rounded-xl border border-primary/10 p-4">
                                            <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5" /> Nomor Kursi</p>
                                            <p className="font-black text-2xl text-primary tracking-tight">
                                                {sortedKursi.length > 0 ? sortedKursi.join(', ') : '-'}
                                            </p>
                                            <p className="text-xs font-medium text-primary/70 mt-1">{sortedKursi.length} Kursi Dipesan</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stub - Right Side */}
                                <div className="md:w-80 border-t md:border-t-0 md:border-l border-dashed border-gray-300 bg-gray-50/50 p-8 flex flex-col justify-between relative">
                                    {/* Semi-circles for the ticket cut effect */}
                                    <div className="hidden md:block absolute -left-4 top-0 w-8 h-8 bg-white rounded-full -mt-4 border-b border-gray-200"></div>
                                    <div className="hidden md:block absolute -left-4 bottom-0 w-8 h-8 bg-white rounded-full -mb-4 border-t border-gray-200"></div>
                                    
                                    <div>
                                        <div className="mb-6">
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Kode Booking / PNR</p>
                                            <p className="text-2xl font-black text-gray-900 tracking-tight">{pemesanan.kode_booking}</p>
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Waktu Pemesanan</p>
                                            <p className="text-sm font-medium text-gray-700">{formatDateTime(pemesanan.tanggal_pesan)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Pembayaran</p>
                                            <p className="text-xl font-bold text-primary">{formatRupiah(pemesanan.total_bayar)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center">
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 inline-block mb-3">
                                            <QrCode className="h-24 w-24 text-gray-900" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-[10px] font-mono text-gray-500">{qrData}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Rules */}
                            <div className="bg-gray-900 text-gray-300 p-6 md:p-8 border-t-4 border-primary">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                            <Info className="h-4 w-4 text-primary" />
                                            Syarat & Ketentuan Keberangkatan
                                        </h3>
                                        <ul className="space-y-2 text-xs text-gray-400">
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-0.5">•</span>
                                                <span>Penumpang diharap hadir <strong>30 menit sebelum jadwal keberangkatan</strong> di titik kumpul / loket.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-0.5">•</span>
                                                <span>E-Tiket ini adalah bukti pembayaran dan pemesanan yang sah. Harap tunjukkan kepada petugas/supir kami beserta identitas diri.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-0.5">•</span>
                                                <span>Keterlambatan yang menyebabkan tertinggalnya armada bukan menjadi tanggung jawab CV Baruna Travel dan tiket dianggap hangus.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="md:border-l md:border-gray-700 md:pl-6 flex flex-col justify-center">
                                        <p className="text-white font-bold text-sm mb-2">Pusat Bantuan</p>
                                        <p className="text-xs text-gray-400 mb-1">Kec. Rao, Kab. Pasaman</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5"><Phone className="h-3 w-3" /> +62 812-3456-7890</p>
                                        <p className="text-xs text-gray-400 mt-2 italic">Terima kasih atas kepercayaan Anda menggunakan layanan Baruna Travel.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Print Note */}
                    <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3 print:hidden">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-0.5">
                            <Info className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Panduan Cetak Tiket</p>
                            <p className="text-xs text-blue-700">Gunakan opsi cetak berwarna (Color) dengan ukuran kertas A4 secara Portrait. Pastikan opsi 'Print Background Graphics' aktif pada pengaturan browser Anda agar warna tiket tercetak dengan sempurna.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ETicket.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/pelanggan/dashboard',
        },
        {
            title: 'Pemesanan Saya',
            href: '/pelanggan/pemesanan',
        },
        {
            title: 'E-Tiket',
        },
    ],
};
