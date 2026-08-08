/**
 * ====================================================================================
 * ROLE : PASSERELLE HTTP DE TRANSACTION / INVOICE SERVICE LAYER
 * RESPONSIBILITY : Centralise les flux financiers et l'envoi des paniers d'achats 
 * vers les routes REST (/api/v1/invoices) hébergées sur ton Cloud Render.
 * ARCHITECTURE : Conforme aux spécifications d'Angular 21 (Standalone Provider).
 * Convertit les paniers de l'IHM au format DTO strict attendu par le serveur Java.
 * ====================================================================================
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../../models/invoice.model';
import { environment } from '../../../../environments/environment';

// CONTRAT DE TRANSFERT REQUIS PAR TON BACKEND (MAPPING DTO)
export interface InvoiceRequestDto {
  customerId: number;
  lines: {
    productId: number;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private http = inject(HttpClient);
  
  // FIX ROUTING : Respect de la structure unifiée sans doublon de segment
  private readonly apiUrl = `${environment.baseUrl}/v1/invoices`;

  /**
   * Récupère le grand livre comptable de toutes les factures émises.
   * Alimente le tableau d'historique de la page d'accueil de la facturation.
   */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  /**
   * Récupère les détails exhaustifs d'une facture par son ID (pour impression ou consultation).
   */
  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  /**
   * MOTEUR DE VENTE : Envoie le panier d'achat à Spring Boot pour déstockage automatique.
   * @param transaction Le payload DTO structuré avec l'ID client et le tableau d'articles
   */
  createInvoice(transaction: InvoiceRequestDto): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, transaction);
  }


    /**
   * HISTORIQUE TIERS : Récupère toutes les factures associées à un client spécifique.
   * @param customerId L'identifiant technique du client
   */
  getInvoicesByCustomerId(customerId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/customer/${customerId}`);
  }

}

