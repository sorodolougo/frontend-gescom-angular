/**
 * ====================================================================================
 * ROLE : PASSERELLE HTTP DE COMMUNICATION / SERVICE LAYER (REACTIVE DATA FLUX)
 * RESPONSIBILITY : Centralise l'intégralité des appels AJAX/HTTP vers les routes 
 * REST de production (/api/v1/customers) hébergées sur le cloud Render.
 * ARCHITECTURE : Conforme aux standards d'Angular 21 (Standalone Provider). Injecte
 * le client HttpClient de manière chirurgicale pour alimenter l'état de l'IHM.
 * ====================================================================================
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../../models/customer.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Injection moderne de dépendance par fonction inject()
  private http = inject(HttpClient);
  
  // URL transverse issue de tes variables d'environnement centralisées
  private readonly apiUrl = `${environment.baseUrl}/v1/customers`;

  /**
   * Récupère la liste complète de tous les clients du fichier tiers.
   * Alimente directement le grand tableau réactif NG-ZORRO.
   */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  /**
   * Récupère les détails complets d'une fiche client par son ID unique.
   * @param id L'identifiant technique de la ligne de données
   */
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Insère un nouveau client dans l'ERP.
   * Le code client (ex: CLI0001) est calculé et injecté automatiquement par le serveur Java.
   * @param customer Le payload épuré sans ID ni code pré-généré
   */
  createCustomer(customer: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  /**
   * Modifie sélectivement les coordonnées d'un tiers existant.
   * @param id L'identifiant unique du client à mettre à jour
   * @param customer Les nouvelles données saisies dans le formulaire
   */
  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  /**
   * Supprime définitivement un client de PostgreSQL Cloud (Neon).
   * @param id L'identifiant technique du tiers à révoquer
   */
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
