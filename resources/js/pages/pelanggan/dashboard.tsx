import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Bus,
    Calendar,
    MapPin,
    Receipt,
    ArrowRight,
} from 'lucide-react';

interface DashboardProps {
    user?: {
        name: string;
        email: string;
        role: string;
    };
}

export default function Dashboard({ user }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard Pelanggan" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pemesanan Aktif
                            </CardTitle>
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                Pemesanan yang sedang berlangsung
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Jadwal Tersedia
                            </CardTitle>
                            <Bus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                Jadwal keberangkatan tersedia
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Perjalanan
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                Total perjalanan Anda
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="min-h-[400px] flex-1 rounded-xl border bg-card p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Selamat Datang, {user?.name || 'Pelanggan'}!</h3>
                        <p className="text-sm text-muted-foreground">
                            Cari jadwal travel dan pesan tiket perjalanan Anda.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bus className="h-5 w-5" />
                                    Cari Jadwal
                                </CardTitle>
                                <CardDescription>
                                    Lihat jadwal keberangkatan travel yang tersedia
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href="/pelanggan/jadwal">
                                        Lihat Jadwal
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="border-dashed">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Pemesanan Saya
                                </CardTitle>
                                <CardDescription>
                                    Kelola dan lihat pemesanan tiket Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/pelanggan/pemesanan">
                                        Lihat Pemesanan
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/pelanggan/dashboard',
        },
    ],
};
