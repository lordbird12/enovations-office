import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { CalendarOrderComponent } from './list/list.component';
import { PageService } from './page.service';
import { inject } from '@angular/core';
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
                component: CalendarOrderComponent,
                resolve  : {
                    allProduct    : () => inject(PageService).getAllProduct(),
                    // categories: () => inject(InventoryService).getCategories(),
                    // products  : () => inject(InventoryService).getProducts(),
                    // tags      : () => inject(InventoryService).getTags(),
                    // vendors   : () => inject(InventoryService).getVendors(),
                },
            },
        ],
    },
    
] as Routes;
