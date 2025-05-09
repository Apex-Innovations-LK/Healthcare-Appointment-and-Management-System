import { Routes } from '@angular/router';
import { AppLayout } from './app/pages/admin/app.layout';
import { NotFound } from './app/pages/notfound/notfound';
import { DoctorLayout } from './app/pages/doctor/doctor.layout';
import { PatientLayout } from './app/pages/patient/patient.layout';
import { StaffLayout } from './app/pages/staff/staff.layout';
import { HomeComponent } from './app/pages/home/home';
import { AdminAuthGuard } from './app/service/AuthGuards/adminAuth.guard';
import { PatientAuthGuard } from './app/service/AuthGuards/patientAuth.guard';
import { DoctorAuthGuard } from './app/service/AuthGuards/doctorAuth.guard';
import { StaffAuthGuard } from './app/service/AuthGuards/staffAuth.guard';

import { VideoCallComponent } from './app/video-call/video-call.component';
export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
        // children: [
        //     {
        //         path: '',
        //         loadChildren: () => import('./app/pages/home/home.routes').then((m) => m.default)
        //     }
        // ]
    },
    {
        path: 'admin',
        component: AppLayout,
 //       canActivate: [AdminAuthGuard],
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
//        canActivate: [PatientAuthGuard],
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
 //       canActivate: [DoctorAuthGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/doctor/doctor.routes').then((m) => m.default)
            }
        ]
    },
    { path: 'telehealth', component: VideoCallComponent },
    {
        path: 'staff',
        component: StaffLayout,
//        canActivate: [StaffAuthGuard],
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
    }
    // {
    //     path: '**',
    //     redirectTo: '/notfound'
    // }
];
