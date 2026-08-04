import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  // URL de production ou locale, appel backend 
  private apiUrl = `${environment.baseUrl}/v1/products`;
  

  /**
   * Récupère la liste complète des produits du catalogue
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

   /**
   * Insérer des produits du catalogue
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
  return this.http.post<Product>(this.apiUrl, product);
}


/**
   * NOUVEAU : RÉCUPÉRATION D'UN PRODUIT PAR SON ID (Read - Single)
   * Appelée automatiquement par le composant 'ProductDetails' lors de la navigation
   * @param id L'identifiant unique de l'article
   */
  getProductById(id: number): Observable<Product> {
    // Construit l'URL : http://localhost:8080/api/v1/products/{id}
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }


  /**
   * NOUVEAU : MISE À JOUR COMPLÈTE D'UNE FICHE ARTICLE (Update)
   * Envoie le payload modifié via le verbe PUT conforme aux standards REST
   * @param id L'identifiant unique du produit à modifier
   * @param product Les nouvelles données saisies dans le formulaire
   */
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    // Construit l'URL : http://localhost:8080/api/v1/products/{id}
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }


/**
   * ROBOTISATION CRUD : SUPPRESSION D'UN ARTICLE
   * Envoie une requête HTTP DELETE au serveur pour retirer l'article de PostgreSQL
   * @param id L'identifiant unique du produit à supprimer
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }




}
