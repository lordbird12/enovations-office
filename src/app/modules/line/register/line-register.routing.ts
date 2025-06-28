import { Routes } from '@angular/router';
import { PageComponent } from '../sales/page.component';
import { LineRegisterComponent } from './register.component';




export default [

    {
        path: '',
        component: LineRegisterComponent,
    },
] as Routes;
