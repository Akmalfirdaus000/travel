import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ArrowRight,
    Bus,
    Calendar,
    Clock,
    MapPin,
    Users,
    User,
    Armchair,
} from 'lucide-react';
import { useState } from 'react';

interface Jadwal {
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
}

interface AvailableSeat {
    nomor: number;
    tersedia: boolean;
}

interface JadwalShowProps {
    jadwal: Jadwal;
    availableSeats: AvailableSeat[];
}

export default function JadwalShow({ jadwal, availableSeats: initialSeats }: JadwalShowProps) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [availableSeats] = useState<AvailableSeat[]>(initialSeats);

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

    const toggleSeat = (seatNumber: number) => {
        const seat = availableSeats.find((s) => s.nomor === seatNumber);
        if (!seat?.tersedia) return;

        setSelectedSeats((prev) =>
            prev.includes(seatNumber)
                ? prev.filter((s) => s !== seatNumber)
                : [...prev, seatNumber].sort((a, b) => a - b),
        );
    };

    const totalPrice = selectedSeats.length * jadwal.rute.harga_tiket;

    const handleContinue = () => {
        if (selectedSeats.length === 0) return;

        const params = new URLSearchParams({
            jadwal_id: jadwal.id.toString(),
            kursi: selectedSeats.map(String).join(','),
        });

        window.location.href = `/pelanggan/pemesanan/create?${params.toString()}`;
    };

    const availableCount = availableSeats.filter((s) => s.tersedia).length;
    const bookedCount = availableSeats.length - availableCount;

    // Generate seat layout for bus (2-2 configuration)
    const renderSeats = () => {
        const rows = Math.ceil(jadwal.armada.kapasitas_kursi / 4);
        const seats = [];

        for (let row = 0; row < rows; row++) {
            const rowSeats = [];
            // Left side (2 seats)
            for (let col = 0; col < 2; col++) {
                const seatNum = row * 4 + col + 1;
                if (seatNum <= jadwal.armada.kapasitas_kursi) {
                    rowSeats.push(seatNum);
                }
            }
            // Aisle
            rowSeats.push(null);
            // Right side (2 seats)
            for (let col = 0; col < 2; col++) {
                const seatNum = row * 4 + col + 3;
                if (seatNum <= jadwal.armada.kapasitas_kursi) {
                    rowSeats.push(seatNum);
                }
            }

            seats.push(rowSeats);
        }

        return seats;
    };

    const seatLayout = renderSeats();

    return (
        <>
            <Head title={`Pilih Kursi - ${jadwal.rute.kota_asal} ke ${jadwal.rute.kota_tujuan}`} />
            <div className="flex flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2 -ml-3 text-muted-foreground hover:text-foreground">
                    <Link href="/pelanggan/jadwal">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Jadwal
                    </Link>
                </Button>

                {/* Schedule Info */}
                <Card className="border-muted shadow-sm">
                    <CardHeader className="bg-muted/30 border-b border-muted pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    {jadwal.rute.kota_asal} <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" /> {jadwal.rute.kota_tujuan}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-5 mt-3 text-sm">
                                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {formatDate(jadwal.tanggal_berangkat)}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        {jadwal.jam_berangkat.substring(0, 5)} WIB
                                    </span>
                                </CardDescription>
                            </div>
                            <div className="text-left md:text-right bg-background p-3 rounded-lg border border-border">
                                <p className="text-sm text-muted-foreground font-medium">Harga per kursi</p>
                                <p className="text-2xl font-bold text-primary mt-0.5">
                                    {formatRupiah(jadwal.rute.harga_tiket)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-md">
                                    <Bus className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Armada</p>
                                    <p className="font-semibold text-foreground">{jadwal.armada.tipe_mobil}</p>
                                    <Badge variant="outline" className="mt-1 font-mono text-xs">{jadwal.armada.plat_nomor}</Badge>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-md">
                                    <Users className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Supir</p>
                                    <p className="font-semibold text-foreground">{jadwal.supir.nama_supir}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{jadwal.supir.no_telp_supir}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-muted rounded-md">
                                    <Armchair className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Kapasitas</p>
                                    <p className="font-semibold text-foreground">{jadwal.armada.kapasitas_kursi} Kursi</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seat Selection */}
                <Card className="border-muted shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-muted bg-muted/10">
                        <CardTitle className="flex items-center gap-2">
                            <Armchair className="h-5 w-5" />
                            Pilih Kursi
                        </CardTitle>
                        <CardDescription>
                            Silakan pilih posisi kursi yang Anda inginkan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Seat Legend */}
                        <div className="mb-8 flex flex-wrap gap-6 justify-center bg-muted/30 p-4 rounded-xl">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-md border-2 border-primary/20 bg-background shadow-sm" />
                                <span className="text-sm font-medium text-muted-foreground">Tersedia</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground shadow-md flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium text-foreground">Dipilih</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-md border border-muted bg-muted text-muted-foreground flex items-center justify-center">
                                    <User className="h-4 w-4 opacity-50" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Terisi</span>
                            </div>
                        </div>

                        {/* Seat Map */}
                        <div className="mb-8 overflow-x-auto flex justify-center">
                            <div className="min-w-max border-2 border-muted rounded-2xl p-6 bg-background shadow-sm relative">
                                {/* Steering Wheel Icon indicating front of bus */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-2 text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                                    Depan
                                </div>
                                
                                {/* Driver Seat */}
                                <div className="mb-8 flex justify-end pr-2 border-b-2 border-dashed border-muted pb-6">
                                    <div className="h-12 w-12 rounded-xl bg-muted/50 border border-muted flex flex-col items-center justify-center">
                                        <Users className="h-5 w-5 text-muted-foreground mb-1" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Supir</span>
                                    </div>
                                </div>

                                {/* Seats Grid */}
                                <div className="space-y-3">
                                    {seatLayout.map((rowSeats, rowIndex) => (
                                        <div key={rowIndex} className="flex items-center justify-center gap-3">
                                            {rowSeats.map((seatNum, colIndex) => {
                                                if (seatNum === null) {
                                                    return <div key={`aisle-${rowIndex}`} className="w-8" />; // Aisle
                                                }

                                                const seat = availableSeats.find((s) => s.nomor === seatNum);
                                                const isSelected = selectedSeats.includes(seatNum);
                                                const isAvailable = seat?.tersedia ?? false;

                                                return (
                                                    <button
                                                        key={seatNum}
                                                        onClick={() => toggleSeat(seatNum)}
                                                        disabled={!isAvailable}
                                                        className={`h-12 w-12 rounded-xl border-2 transition-all duration-200 flex items-center justify-center text-sm font-bold shadow-sm
                                                            ${!isAvailable
                                                                ? 'border-muted bg-muted text-muted-foreground/50 cursor-not-allowed shadow-none'
                                                                : isSelected
                                                                    ? 'border-primary bg-primary text-primary-foreground shadow-md transform scale-105'
                                                                    : 'border-primary/20 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                                                            }
                                                        `}
                                                        title={!isAvailable ? 'Kursi terisi' : `Pilih Kursi ${seatNum}`}
                                                    >
                                                        {isSelected ? <User className="h-5 w-5" /> : seatNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Seat Summary */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-muted pt-6">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tersedia</p>
                                    <p className="font-bold text-lg">{availableCount} <span className="text-sm font-normal text-muted-foreground">kursi</span></p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Terisi</p>
                                    <p className="font-bold text-lg">{bookedCount} <span className="text-sm font-normal text-muted-foreground">kursi</span></p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pilihan Anda</p>
                                    <p className="font-bold text-lg text-primary">{selectedSeats.length} <span className="text-sm font-normal text-muted-foreground">kursi</span></p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Seats & Continue */}
                {selectedSeats.length > 0 && (
                    <Card className="border-primary/50 bg-primary/5 shadow-md animate-in slide-in-from-bottom-4 duration-300">
                        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-foreground mb-1">
                                    Kursi Terpilih: <span className="text-primary">{selectedSeats.sort((a, b) => a - b).join(', ')}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Pembayaran: <span className="font-bold text-foreground text-lg">{formatRupiah(totalPrice)}</span>
                                </p>
                            </div>
                            <Button onClick={handleContinue} size="lg" className="gap-2 w-full sm:w-auto shadow-md">
                                Lanjutkan Pembayaran
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
