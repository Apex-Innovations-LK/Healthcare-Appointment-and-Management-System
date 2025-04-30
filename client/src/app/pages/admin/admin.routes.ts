import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Empty } from '../empty/empty';

export default [
    { path: '', component: Admin }, 
    { path: 'empty', component: Empty }
] as Routes;
