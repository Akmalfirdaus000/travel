import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    ArrowRight,
    Bus,
    Calendar,
    Clock,
    IndianRupee,
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
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Back Button */}
                <Button asChild variant="ghost" className="w-fit gap-2">
                    <Link href="/pelanggan/jadwal">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Jadwal
                    </Link>
                </Button>

                {/* Schedule Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                    {jadwal.rute.kota_asal} → {jadwal.rute.kota_tujuan}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-4 mt-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(jadwal.tanggal_berangkat)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {jadwal.jam_berangkat}
                                    </span>
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Harga per kursi</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatRupiah(jadwal.rute.harga_tiket)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3">
                                <Bus className="h-5 w-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Armada</p>
                                    <p className="font-medium">{jadwal.armada.tipe_mobil}</p>
                                    <p className="text-xs text-gray-400">{jadwal.armada.plat_nomor}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Supir</p>
                                    <p className="font-medium">{jadwal.supir.nama_supir}</p>
                                    <p className="text-xs text-gray-400">{jadwal.supir.no_telp_supir}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Armchair className="h-5 w-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Kapasitas</p>
                                    <p className="font-medium">{jadwal.armada.kapasitas_kursi} kursi</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seat Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Armchair className="h-5 w-5" />
                            Pilih Kursi
                        </CardTitle>
                        <CardDescription>
                            Klik pada kursi untuk memilih. Kursi yang berwarna merah sudah dipesan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Seat Legend */}
                        <div className="mb-6 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded border-2 border-green-500 bg-green-100" />
                                <span className="text-sm">Tersedia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded border-2 border-blue-500 bg-blue-500 text-white flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm">Dipilih</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded border-2 border-red-500 bg-red-100" />
                                <span className="text-sm">Terisi</span>
                            </div>
                        </div>

                        {/* Seat Map */}
                        <div className="mb-6 overflow-x-auto">
                            <div className="min-w-[600px]">
                                {/* Driver Seat */}
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <span className="text-sm text-gray-500">Supir</span>
                                </div>

                                {/* Seats Grid */}
                                <div className="space-y-2">
                                    {seatLayout.map((rowSeats, rowIndex) => (
                                        <div key={rowIndex} className="flex items-center justify-center gap-2">
                                            {rowSeats.map((seatNum, colIndex) => {
                                                if (seatNum === null) {
                                                    return <div key="aisle" className="w-16" />;
                                                }

                                                const seat = availableSeats.find((s) => s.nomor === seatNum);
                                                const isSelected = selectedSeats.includes(seatNum);
                                                const isAvailable = seat?.tersedia ?? false;

                                                return (
                                                    <button
                                                        key={seatNum}
                                                        onClick={() => toggleSeat(seatNum)}
                                                        disabled={!isAvailable}
                                                        className={`h-10 w-10 rounded-lg border-2 transition-all flex items-center justify-center text-sm font-medium
                                                            ${!isAvailable
                                                                ? 'border-red-500 bg-red-100 text-red-500 cursor-not-allowed'
                                                                : isSelected
                                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                                    : 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                                                            }
                                                        `}
                                                        title={`Kursi ${seatNum}`}
                                                    >
                                                        {isSelected ? <User className="h-4 w-4" /> : seatNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Seat Summary */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Tersedia</p>
                                    <p className="font-semibold text-green-600">{availableCount} kursi</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Terisi</p>
                                    <p className="font-semibold text-red-600">{bookedCount} kursi</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dipilih</p>
                                    <p className="font-semibold text-blue-600">{selectedSeats.length} kursi</p>
                                </div>
                            </div>
                            {selectedSeats.length > 0 && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Biaya</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatRupiah(totalPrice)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Seats & Continue */}
                {selectedSeats.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Kursi Terpilih: {selectedSeats.sort((a, b) => a - b).join(', ')}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total: {formatRupiah(totalPrice)}
                                    </p>
                                </div>
                                <Button onClick={handleContinue} className="gap-2">
                                    Lanjut Pemesanan
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
