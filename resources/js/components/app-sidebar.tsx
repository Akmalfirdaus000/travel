import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
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
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// Menu Pelanggan
const pelangganNavItems: NavItem[] = [
    {
        title: 'Jadwal Travel',
        href: '/pelanggan/jadwal',
        icon: Bus,
    },
    {
        title: 'Pemesanan Saya',
        href: '/pelanggan/pemesanan',
        icon: Receipt,
    },
];

// Menu Admin
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Data Supir',
        href: '/supir',
        icon: Users,
    },
    {
        title: 'Data Armada',
        href: '/armada',
        icon: Car,
    },
    {
        title: 'Data Rute',
        href: '/rute',
        icon: Route,
    },
    {
        title: 'Jadwal Keberangkatan',
        href: '/jadwal',
        icon: MapPin,
    },
    {
        title: 'Data Pelanggan',
        href: '/pelanggan',
        icon: Users,
    },
    {
        title: 'Pemesanan',
        href: '/pemesanan',
        icon: Package,
    },
    {
        title: 'Pembayaran',
        href: '/pembayaran',
        icon: Receipt,
    },
];

// Menu Super Admin
const superAdminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Laporan',
        href: '/admin/reports',
        icon: BarChart3,
        children: [
            {
                title: 'Ringkasan',
                href: '/admin/reports',
                icon: LayoutDashboard,
            },
            {
                title: 'Pendapatan',
                href: '/admin/reports/pendapatan',
                icon: TrendingUp,
            },
            {
                title: 'Pemesanan',
                href: '/admin/reports/pemesanan',
                icon: Package,
            },
            {
                title: 'Rute Terpopuler',
                href: '/admin/reports/rute-terpopuler',
                icon: Route,
            },
            {
                title: 'Performa Supir',
                href: '/admin/reports/supir-performa',
                icon: UserCog,
            },
            {
                title: 'Utilisasi Armada',
                href: '/admin/reports/armada-utilisasi',
                icon: Car,
            },
            {
                title: 'Bulanan',
                href: '/admin/reports/bulanan',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Data Supir',
        href: '/supir',
        icon: Users,
    },
    {
        title: 'Data Armada',
        href: '/armada',
        icon: Car,
    },
    {
        title: 'Data Rute',
        href: '/rute',
        icon: Route,
    },
    {
        title: 'Jadwal Keberangkatan',
        href: '/jadwal',
        icon: MapPin,
    },
    {
        title: 'Data Pelanggan',
        href: '/pelanggan',
        icon: Users,
    },
    {
        title: 'Pemesanan',
        href: '/pemesanan',
        icon: Package,
    },
    {
        title: 'Pembayaran',
        href: '/pembayaran',
        icon: Receipt,
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

    let mainNavItems: NavItem[] = [];

    if (user?.role === 'pelanggan') {
        mainNavItems = pelangganNavItems;
    } else if (user?.role === 'admin') {
        mainNavItems = adminNavItems;
    } else if (user?.role === 'super_admin') {
        mainNavItems = superAdminNavItems;
    }

    const dashboardTitle = user?.role === 'pelanggan'
        ? 'Pelanggan'
        : user?.role === 'super_admin'
          ? 'Super Admin'
          : 'Admin';

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
                <NavMain items={mainNavItems} title={dashboardTitle} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
