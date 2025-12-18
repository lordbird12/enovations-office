import { Routes } from '@angular/router';
import { PageComponent } from './page.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

export default [
    {
        path     : '',
        component: PageComponent,
        children : [
            { path: '', pathMatch: 'full', redirectTo: 'view' },
            { path: 'view', component: ViewComponent },
            { path: 'edit', component: EditComponent },
        ],
    },
] as Routes;
