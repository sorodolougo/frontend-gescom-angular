import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  /*
  // 1. Pages publiques ou hors-menu (Zéro Sidebar ici !)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  }, */

  // 2. Pages internes de l'ERP (La Sidebar s'affiche AUTOMATIQUEMENT pour ce groupe)
  {
    path: '',
    component: MainLayout, // Le Layout devient la boîte de réception
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      {
        path: 'welcome',
        loadComponent: () => import('./features/welcome/welcome').then((m) => m.Welcome),
      },

      {
        path: 'commercial',
        loadChildren: () =>
          import('./features/commercial/commercial.routes').then((m) => m.COMMERCIAL_ROUTES),
      },
    ],
  },

  {
    path: '404',
    title: 'GesCom ERP - Page non trouvée',
    loadComponent: () =>
      import('./features/auth/not-found/not-found/not-found').then((m) => m.NotFound),
  },

  // 4. FIX SÉCURITÉ DU WILDCARD : Redirige physiquement toutes les mauvaises URLs vers la route /404
  {
    path: '**',
    redirectTo: '404',
  },
];
