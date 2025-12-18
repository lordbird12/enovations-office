/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

function _getUserFromLocalStorage(): any | null {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function _allowOnlyDepartment(departmentId: number): boolean {
    const user = _getUserFromLocalStorage();
    const permissionId = Number(user?.permission_id);
    const userDepartmentId = Number(user?.department_id);

    // Keep all menus for super admin
    if (permissionId === 1) {
        return true;
    }

    // If department is not available (e.g. before login), don't hide anything
    if (!Number.isFinite(userDepartmentId)) {
        return true;
    }

    return userDepartmentId === departmentId;
}

const storedPermission = JSON.parse(localStorage.getItem('permission'));
export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'admin',
        title: 'ตั้งค่าระบบ',
        subtitle: 'ข้อมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:cog-6-tooth',
        hidden: () => {
            // const storedPermission = JSON.parse(localStorage.getItem('permission'));
            var user = JSON.parse(localStorage.getItem('user'))
            if (user.permission_id == '1') {
                return false;
            } else {
                return true;
            }
        },
        children: [
            {
                id: 'admin.employee',
                title: 'ผู้ใช้งาน',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/admin/employee/list',
            },
            {
                id: 'admin.comp',
                title: 'ข้อมูลบริษัท',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/companie/list',
            },
            {
                id: 'admin.department',
                title: 'แผนก',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/department/list',
            },
            {
                id: 'admin.position',
                title: 'ตำแหน่ง',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/position/list',
            },
            {
                id: 'admin.team',
                title: 'ทีม',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/admin/team/list',
            },
            {
                id: 'admin.category-product',
                title: 'ประเภทสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/category-product/list',
            },
            {
                id: 'admin.brand',
                title: 'ยี่ห้อสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/brand/list',
            },
            {
                id: 'admin.product',
                title: 'สินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/product/list',
            },
            {
                id: 'client.list',
                title: 'ลูกค้าโรงพยาบาล',
                type: 'basic',
                icon: 'heroicons_mini:user-group',
                link: '/admin/customers/list',
            },
        ],
    },
    {
        id: 'sales',
        title: 'Sale',
        subtitle: 'ข้อมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:shopping-cart',
        hidden: () => !_allowOnlyDepartment(36),
        children: [
            {
                id: 'sales.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:chart-bar',
                link: '/dashboards/project',
            },
            {
                id: 'sales.create',
                title: 'สร้างการจอง',
                type: 'basic',
                icon: 'heroicons_outline:plus-circle',
                link: '/admin/sales/form/echocardiogram',
            },
            {
                id: 'sales.my-bookings',
                title: 'รายการจองของฉัน',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-list',
                link: '/admin/sales/my-bookings',
            },
            {
                id: 'sales.product-list',
                title: 'รายการสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/sales/product-list',
            },
        ],
    },
    {
        id: 'marketing',
        title: 'Marketing',
        subtitle: 'ข้อมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:megaphone',
        hidden: () => !_allowOnlyDepartment(35),
        children: [
            {
                id: 'marketing.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:chart-bar',
                link: '/dashboards/project',
            },
            {
                id: 'marketing.pending-approval',
                title: 'รายการจองรออนุมัติ',
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/admin/sales/list',
                queryParams: { view: 'marketing-pending' },
            },
            {
                id: 'marketing.all-bookings',
                title: 'รายการจองทั้งหมด',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-list',
                link: '/admin/sales/list',
                queryParams: { view: 'marketing-all' },
            },
            {
                id: 'marketing.product-list',
                title: 'รายการสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/sales/product-list',
            },
        ],
    },
    {
        id: 'warehouse',
        title: 'Warehouse',
        subtitle: 'ข้อมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:archive-box',
        hidden: () => !_allowOnlyDepartment(34),
        children: [
            {
                id: 'warehouse.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:chart-bar',
                link: '/dashboards/project',
            },
            {
                id: 'warehouse.pending-arrange',
                title: 'รอจัดสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-list',
                link: '/admin/sales/list',
                queryParams: { status: 'Confirm' },
            },
            {
                id: 'warehouse.pending-receive',
                title: 'รอรับสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:inbox-arrow-down',
                link: '/admin/sales/list',
                queryParams: { status: 'Approve' },
            },
            {
                id: 'warehouse.pending-finish',
                title: 'รอคืนสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:arrow-uturn-left',
                link: '/admin/sales/list',
                queryParams: { status: 'Finish' },
            },
            {
                id: 'warehouse.pending-returned',
                title: 'รับคืนสินค้าแล้ว',
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/admin/sales/list',
                queryParams: { status: 'Returned' },
            },
            {
                id: 'warehouse.category-product',
                title: 'ประเภทสินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/category-product/list',
                hidden: () => {
                    // const storedPermission = JSON.parse(localStorage.getItem('permission'));
                    var user = JSON.parse(localStorage.getItem('user'))
                    if (user.permission_id == '1' || user.permission_id == '3') {
                        return false;
                    } else {
                        return true;
                    }
                },
            },
            {
                id: 'warehouse.product',
                title: 'สินค้า',
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/product/list',
                hidden: () => {
                    // const storedPermission = JSON.parse(localStorage.getItem('permission'));
                    var user = JSON.parse(localStorage.getItem('user'))
                    if (user.permission_id == '1' || user.permission_id == '2' || user.permission_id == '3') {
                        return false;
                    } else {
                        return true;
                    }
                },
            },
        ],
    },

    {
        id: 'self',
        title: 'ส่วนตัว',
        subtitle: 'จัดการโปรไฟล์',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'self.profile',
                title: 'โปรไฟล์',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/admin/profile',
            },
            {
                id: 'admin.logout',
                title: 'ออกจากระบบ',
                type: 'basic',
                icon: 'heroicons_outline:arrow-left-on-rectangle',
                link: '/sign-out',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qr-code',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'หน้า',
        tooltip: 'หน้า',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'ส่วนติดต่อผู้ใช้',
        tooltip: 'ส่วนติดต่อผู้ใช้',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'การนำทาง',
        tooltip: 'การนำทาง',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'แดชบอร์ด',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'แอป',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'อื่นๆ',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'หน้า',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'ส่วนติดต่อผู้ใช้',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'คุณสมบัติการนำทาง',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'แดชบอร์ด',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'apps',
    //     title: 'Apps',
    //     type: 'group',
    //     icon: 'heroicons_outline:qr-code',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'pages',
    //     title: 'Pages',
    //     type: 'group',
    //     icon: 'heroicons_outline:document-duplicate',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'user-interface',
    //     title: 'UI',
    //     type: 'group',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'navigation-features',
    //     title: 'Misc',
    //     type: 'group',
    //     icon: 'heroicons_outline:bars-3',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    {
        id: 'purchase',
        title: 'ซื้อ',
        type: 'group',
        icon: 'heroicons_outline:inbox-arrow-down',
        children: [],
    },
    {
        id: 'sale',
        title: 'ขาย',
        type: 'group',
        icon: 'heroicons_outline:shopping-cart',
        children: [],
    },
    {
        id: 'inventory',
        title: 'คลังสินค้า',
        type: 'group',
        icon: 'heroicons_outline:cube',
        children: [],
    },
    {
        id: 'accounting',
        title: 'บัญชี/การเงิน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'delivery-workers',
        title: 'คนส่งของ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'admin',
        title: 'จัดการพนักงาน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'reports',
        title: 'รายงาน',
        type: 'group',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [],
    },
];
