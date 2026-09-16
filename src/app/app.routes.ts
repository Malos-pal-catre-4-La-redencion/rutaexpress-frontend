import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './core/role.guard';
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
    path: 'envios',
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Admin', 'Despachador', 'Cliente'] },
    loadComponent: () =>
      import('./features/envios/envios.component').then((m) => m.EnviosComponent),
  },
  {
    path: 'catalogo',
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Admin', 'Despachador'] },
    loadComponent: () =>
      import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent),
  },
  {
    path: 'no-autorizado',
    component: NoAutorizadoComponent,
  },
  { path: '**', redirectTo: 'dashboard' },
];
