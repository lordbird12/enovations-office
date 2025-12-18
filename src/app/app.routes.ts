import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards/project' },

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards/project',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            // Dashboards
            {
                path: 'dashboards',
                children: [
                    {
                        path: 'project',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/project/project.routes'
                            ),
                    },
                    {
                        path: 'analytics',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.routes'
                            ),
                    },
                    {
                        path: 'finance',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/finance/finance.routes'
                            ),
                    },
                ],
            },

            // 404 & Catch all
            // { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes') },
            { path: '**', redirectTo: '404-not-found' },
            //Sales
            {

                path: 'admin',
                children: [
                    {
                        path: 'department',
                        loadChildren: () =>
                            import('app/modules/admin/department/page.routes'),
                    },
                    {
                        path: 'position',
                        loadChildren: () =>
                            import('app/modules/admin/position/page.routes'),
                    },
                    {
                        path: 'employee',
                        loadChildren: () =>
                            import('app/modules/admin/employee/page.routes'),
                    },
                    {
                        path: 'profile',
                        loadChildren: () =>
                            import('app/modules/admin/profile/page.routes'),
                    },
                    {
                        path: 'permission',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/permission/permission-routing'
                            ),
                    },
                    {
                        path: 'product',
                        loadChildren: () =>
                            import('app/modules/admin/product/page.routes'),
                    },
                    {
                        path: 'customers',
                        loadChildren: () =>
                            import('app/modules/admin/customers/page.routes'),
                    },
                    {
                        path: 'brand',
                        loadChildren: () =>
                            import('app/modules/admin/brand/page.routes'),
                    },
                    {
                        path: 'brand-model',
                        loadChildren: () =>
                            import('app/modules/admin/brand-model/page.routes'),
                    },
                    {
                        path: 'sales',
                        loadChildren: () =>
                            import('app/modules/admin/sales/page.routes'),
                    },
                    {
                        path: 'companie',
                        loadChildren: () =>
                            import('app/modules/admin/companie/page.routes'),
                    },
                    {
                        path: 'branch',
                        loadChildren: () =>
                            import('app/modules/admin/branch/page.routes'),
                    },

                    {
                        path: 'category-product',
                        loadChildren: () =>
                            import('app/modules/admin/category-product/page.routes'),
                    },
                    {
                        path: 'calendar-order',
                        loadChildren: () =>
                            import('app/modules/admin/calendar/page.routes'),
                    },
                    {
                        path: 'team',
                        loadChildren: () =>
                            import('app/modules/admin/team/page.routes'),
                    },

                ],
            },
        ],
    },
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        data: {
            layout: 'empty',
        },
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [

            {
                path: 'line',
                loadChildren: () =>
                    import('app/modules/line/line.routing'),
            },
        ],
    },
    {
        path: '',
        data: {
            layout: 'empty',
        },
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [

            {
                path: 'register',
                loadChildren: () =>
                    import('app/modules/line/register/line-register.routing'),
            },
        ],
    },
];
