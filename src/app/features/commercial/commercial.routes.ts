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
  },

   // 1. ÉCRAN Fiche Client
  {
    path: 'customers',
    title: 'GesCom - Fiche Client',
    loadComponent: () => import('./customers/customer-list/customer-list').then(m => m.CustomerList)
  },

    {
    path: 'customers/:id',
    title: 'GesCom - Fiche Client Détails',
    loadComponent: () => import('./customers/customer-details/customer-details').then(m => m.CustomerDetails)
  },


 // 1. ROUTE POUR LE GRAND TABLEAU DES FACTURES
  {
    path: 'invoices',
    loadComponent: () =>
      import('./invoice/invoice-list/invoice-list').then(
        (m) => m.InvoiceList
      ),
  },

   // 2. ROUTE POUR L'ÉCRAN DE CRÉATION DE FACTURE PREMIUM
  {
    path: 'invoices/create',
    loadComponent: () =>
      import('./invoice/invoice-create/invoice-create').then(
        (m) => m.InvoiceCreate
      ),
  }

  
];
