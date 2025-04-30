import { Routes } from '@angular/router';
import { AppLayout } from './app/pages/admin/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { DoctorLayout } from './app/pages/doctor/doctor.layout';
import { PatientLayout } from './app/pages/patient/patient.layout';
import { StaffLayout } from './app/pages/staff/staff.layout';

export const appRoutes: Routes = [
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
        component: Notfound
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];
