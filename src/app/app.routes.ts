import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NoAutorizadoComponent } from './features/no-autorizado/no-autorizado.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    // MsalGuard dispara el login automáticamente si no hay sesión activa.
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'no-autorizado',
    component: NoAutorizadoComponent,
  },
  { path: '**', redirectTo: 'dashboard' },
];
