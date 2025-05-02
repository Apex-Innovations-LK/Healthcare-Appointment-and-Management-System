import { Routes } from '@angular/router';
import { Staff } from './staff';
import { Schedule } from './schedule';

export default [
    { path: '', component: Staff },
    { path: 'schedule', component: Schedule }
] as Routes;
