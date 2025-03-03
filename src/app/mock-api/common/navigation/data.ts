/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
const storedPermission = JSON.parse(localStorage.getItem('permission'));
export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'admin',
        title: 'จัดการระบบ',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
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
                id: 'admin.comp',
                title: 'ข้อมูลบริษัท',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/companie/list',
            },
            {
                id: 'admin.department',
                title: 'แผนกงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/department/list',
            },
            {
                id: 'admin.position',
                title: 'ตำแหน่งงาน',
                type: 'basic',
                icon: 'heroicons_outline:list-bullet',
                link: '/admin/position/list',
            },
            {
                id: 'admin.employee',
                title: 'ข้อมูลพนักงาน',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/admin/employee/list',
            },
            {
                id: 'admin.team',
                title: 'ทีม',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/admin/team/list',
            },

        ],
    },
   
    {
        id: 'products',
        title: 'จัดการคลังและสินค้า',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        
        children: [
            {
                id: 'products.brand',
                title: 'ยี่ห้อ',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/admin/brand/list',
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
                id: 'products.category-product',
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
                id: 'products.product',
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
        id: 'sales',
        title: 'จัดการจอง',
        subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'sales.list',
                title: 'จองเครื่อง',
                type: 'basic',
                icon: 'checklist',
                link: '/admin/sales/list',
            },
            {
                id: 'calendar.list',
                title: 'ปฏิทิน',
                type: 'basic',
                icon: 'heroicons_outline:calendar-days',
                link: '/admin/calendar-order/list',
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
        id: 'self',
        title: 'ส่วนตัว',
        subtitle: 'จัดการโปรไฟล์',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
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
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
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
