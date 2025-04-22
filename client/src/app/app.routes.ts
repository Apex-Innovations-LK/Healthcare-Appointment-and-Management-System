import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'health-analytics', loadChildren: () => import('./health-analytics/health-analytics.module').then(m => m.HealthAnalyticsModule) },
  { path: '', redirectTo: 'auth', pathMatch: 'full' }
];
