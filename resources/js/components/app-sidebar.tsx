import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import {
    BookOpen,
    Bus,
    FolderGit2,
    LayoutDashboard,
    MapPin,
    Package,
    Receipt,
    Route,
    UserCog,
    Users,
    Car,
    FileText,
    BarChart3,
    TrendingUp,
    CreditCard,
    Home,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type NavGroup = {
    title: string;
    items: NavItem[];
};

// Menu Pelanggan
const pelangganNavGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            // { title: 'Beranda', href: '/', icon: Home },
            { title: 'Dashboard', href: '/pelanggan/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Perjalanan',
        items: [
            { title: 'Jadwal & Tarif', href: '/pelanggan/jadwal', icon: Bus },
            { title: 'Pemesanan Saya', href: '/pelanggan/pemesanan', icon: Receipt },
        ],
    },
    {
        title: 'Transaksi',
        items: [
            { title: 'Riwayat Pembayaran', href: '/pelanggan/pembayaran', icon: CreditCard },
        ],
    },
];

// Menu Admin
const adminNavGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
        ],
    },
    {
        title: 'Data Master',
        items: [
            { title: 'Data Supir', href: '/admin/supir', icon: Users },
            { title: 'Data Armada', href: '/admin/armada', icon: Car },
            { title: 'Data Rute', href: '/admin/rute', icon: Route },
            { title: 'Jadwal Keberangkatan', href: '/admin/jadwal', icon: MapPin },
            { title: 'Data Pelanggan', href: '/admin/pelanggan', icon: Users },
        ],
    },
    {
        title: 'Transaksi',
        items: [
            { title: 'Pemesanan', href: '/admin/pemesanan', icon: Package },
            { title: 'Pembayaran', href: '/admin/pembayaran', icon: Receipt },
        ],
    },
];

// Menu Super Admin
const superAdminNavGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
            {
                title: 'Laporan',
                href: '/admin/reports',
                icon: BarChart3,
                children: [
                    { title: 'Ringkasan', href: '/admin/reports', icon: LayoutDashboard },
                    { title: 'Pendapatan', href: '/admin/reports/pendapatan', icon: TrendingUp },
                    { title: 'Pemesanan', href: '/admin/reports/pemesanan', icon: Package },
                    { title: 'Rute Terpopuler', href: '/admin/reports/rute-terpopuler', icon: Route },
                    { title: 'Performa Supir', href: '/admin/reports/supir-performa', icon: UserCog },
                    { title: 'Utilisasi Armada', href: '/admin/reports/armada-utilisasi', icon: Car },
                    { title: 'Bulanan', href: '/admin/reports/bulanan', icon: FileText },
                ],
            },
        ],
    },
    {
        title: 'Data Master',
        items: [
            { title: 'Data Supir', href: '/admin/supir', icon: Users },
            { title: 'Data Armada', href: '/admin/armada', icon: Car },
            { title: 'Data Rute', href: '/admin/rute', icon: Route },
            { title: 'Jadwal Keberangkatan', href: '/admin/jadwal', icon: MapPin },
            { title: 'Data Pelanggan', href: '/admin/pelanggan', icon: Users },
        ],
    },
    {
        title: 'Transaksi',
        items: [
            { title: 'Pemesanan', href: '/admin/pemesanan', icon: Package },
            { title: 'Pembayaran', href: '/admin/pembayaran', icon: Receipt },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const user = props.auth?.user;

    let navGroups: NavGroup[] = [];

    if (user?.role === 'pelanggan') {
        navGroups = pelangganNavGroups;
    } else if (user?.role === 'admin') {
        navGroups = adminNavGroups;
    } else if (user?.role === 'super_admin') {
        navGroups = superAdminNavGroups;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={user?.role === 'pelanggan' ? '/pelanggan/jadwal' : dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group, index) => (
                    <Fragment key={group.title}>
                        <NavMain items={group.items} title={group.title} />
                        {index < navGroups.length - 1 && <SidebarSeparator className="mx-4 my-2" />}
                    </Fragment>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
