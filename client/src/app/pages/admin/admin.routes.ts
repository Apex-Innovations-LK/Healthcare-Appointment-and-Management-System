import { Routes } from '@angular/router';
import { Admin } from './admin';
// import { Empty } from '../guidelines/guidelines';
import { Schedular } from './schedular';
import { Analytics } from './analytics';

export default [
    { path: '', component: Admin }, 
    // { path: 'empty', component: Empty },
    { path: 'schedular', component: Schedular },
    { path: 'analytics', component: Analytics },
] as Routes;
