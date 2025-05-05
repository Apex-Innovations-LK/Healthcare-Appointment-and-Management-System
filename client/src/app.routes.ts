import { Routes } from '@angular/router';
import { AppLayout } from './app/pages/admin/app.layout';
import { NotFound } from './app/pages/notfound/notfound';
import { DoctorLayout } from './app/pages/doctor/doctor.layout';
import { PatientLayout } from './app/pages/patient/patient.layout';
import { StaffLayout } from './app/pages/staff/staff.layout';
import { HomeComponent } from './app/pages/home/home';
import { Documentation } from './app/pages/documentation/documentation';
import { Dashboard } from './app/pages/dashboard/dashboard';

export const appRoutes: Routes = [
    // {
        
    //     path: 'uikit',
    //     component: AppLayout,
    //     children: [
    //         { path: '', component: Dashboard },
    //         { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
    //         { path: 'documentation', component: Documentation },
    //         { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
    //     ]
    // },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'admin',
        component: AppLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/admin/admin.routes').then((m) => m.default)
            }
        ]
    },
    {
        path: 'patient',
        component: PatientLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/patient/patient.routes').then((m) => m.default)
            }
        ]
    },
    {
        path: 'doctor',
        component: DoctorLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/doctor/doctor.routes').then((m) => m.default)
            }
        ]
    },
    {
        path: 'staff',
        component: StaffLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/staff/staff.routes').then((m) => m.default)
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/pages/auth/auth.routes').then((m) => m.default)
    },
    {
        path: 'notfound',
        component: NotFound
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];
