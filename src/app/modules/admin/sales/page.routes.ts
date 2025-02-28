import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { PageService } from './page.service';
import { inject } from '@angular/core';
import { ViewOrderComponent } from './view/view.component';

export default [
    // {
    //     path      : '',
    //     pathMatch : 'full',
    //     redirectTo: 'quotation',
    // },
    {
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'list',
                component: ListComponent,
                resolve  : {
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
        path     : '',
        component: PageComponent,
        children : [
            {
                path     : 'form/echocardiogram',
                component: FormComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
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
                path     : 'view/echocardiogram',
                component: FormComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
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
                path     : 'form/ec',
                component: FormComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
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
                path     : 'form/ultrasound-imaging',
                component: FormComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
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
                path     : 'form/rc',
                component: FormComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
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
                path     : 'edit/:id',
                component: FormComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
                    user: () => inject(PageService).getUser(),
                    client: () => inject(PageService).getClient(),
                    machine_model: () => inject(PageService).getMachineModelAll(),
                    // brands    : () => inject(InventoryService).getBrands(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
                data : {
                    page_type: 'EDIT'
                }
            },
            {
                path     : 'view/:id',
                component: ViewOrderComponent,
                resolve  : {
                    products    : () => inject(PageService).getProductEno(),
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
                data : {
                    page_type: 'EDIT'
                }
            },
        ],
    },
] as Routes;
