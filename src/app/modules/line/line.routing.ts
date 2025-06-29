import { Routes } from '@angular/router';
import { PageComponent } from './sales/page.component';
import { ListComponent } from './sales/list/list.component';
import { inject } from '@angular/core';
import { FormComponent } from './sales/form/form.component';
import { PageService } from './sales/page.service';
import { ViewOrderComponent } from './sales/view/view.component';
import { NewsComponent } from './banner/list/form.component';
import { NewsDetailComponent } from './banner/view/form.component';
import { CalendarOrderLineComponent } from './calendar/list/list.component';
import { LineRegisterComponent } from './register/register.component';
import { CalendarComponent } from './sales/calendar/calendar.component';
import { CalendarTimelineComponent } from './sales/calendar-timeline/calendar-timeline.component';
import { AssessmentFormComponent } from './sales/assessment/assessment-form.component';


export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'list/booking',
                component: ListComponent,
                resolve: {
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'form',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'NEW',
                    type: 'Echocardiogram'
                }
            },
            {
                path: 'form/echocardiogram',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'NEW',
                    type: 'Echocardiogram'
                }
            },
            {
                path: 'view/echocardiogram',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'NEW',
                    type: 'Echocardiogram'
                }
            },
            {
                path: 'form/ec',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'NEW',
                    type: 'ec'
                }
            },
            {
                path: 'form/ultrasound-imaging',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'NEW',
                    type: 'Ultrasound Imaging'
                }
            },
            {
                path: 'form/rc',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'NEW',
                    type: 'rc'
                }
            },
            {
                path: 'edit/booking/:id',
                component: FormComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'EDIT'
                }
            },
            {
                path: 'view/booking/:id',
                component: ViewOrderComponent,
                resolve: {
                    products: () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    winLose: () => inject(PageService).getWinLose(),
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data: {
                    page_type: 'EDIT'
                }
            },
            {
                path: 'news',
                component: NewsComponent,
            },
            {
                path: 'news/:id',
                component: NewsDetailComponent,
            },
            {
                path: 'calendar-order/list',
                component: CalendarOrderLineComponent,
                resolve: {
                    allProduct: () => inject(PageService).getAllProduct(),
                    user: () => inject(PageService).getUser(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
            {
                path: 'register',
                component: LineRegisterComponent,
            },
            {
                path: 'calendar-custom',
                component: CalendarComponent,
            },
            {
                path: 'calendar-timeline',
                component: CalendarTimelineComponent,
            },
                {
                path: 'rate/:id',
                component: AssessmentFormComponent,
            },
        ],
    },
] as Routes;
