// src/app/features/commercial/commercial.routes.ts
import { Routes } from '@angular/router';

export const COMMERCIAL_ROUTES: Routes = [
  // FIX CRUCIAL : Si l'utilisateur arrive sur /commercial, on l'aiguille directement vers /commercial/products
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  
  // 1. ÉCRAN LISTE : tableau hybride (Tableau/Cartes)
  {
    path: 'products',
    title: 'GesCom - Catalogue Produits',
    loadComponent: () => import('./stock/product-list/product-list').then(m => m.ProductList)
  },

  // 2. ÉCRAN FICHE DÉTAIL / ÉDITION : Route dynamique avec l'ID
  {
    path: 'products/:id',
    title: 'GesCom - Fiche Produit',
    loadComponent: () => import('./stock/product-details/product-details').then(m => m.ProductDetails)
  }
  
];
