import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../models/product.model';
import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppPageLayoutComponent } from '../../../../shared/components/page-layout.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { ERP_GRID_GUTTER } from '../../../../shared/components/ui-constants';
import { AppCurrencyPipe } from '../../../../shared/pipes/app-currency.pipe';
import { AddProducts } from '../add-products/add-products';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    SHARED_ZORRO_MODULES,
    AppPageLayoutComponent,
    AddProducts,
    AppCurrencyPipe,
    AppButtonComponent
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {

  private router = inject(Router);
  private productService = inject(ProductService);
  private modalService = inject(NzModalService);
  private message = inject(NzMessageService);

  // GAGNE DE TEMPS ANGULAR 21 : Modernisation complète de l'état de l'ERP en Signals réactifs
  protected products = signal<Product[]>([]);
  protected isLoading = signal<boolean>(true);
  protected errorMessage = signal<string | null>(null);
  
  // Pilotage robotisé de la modale centrale
  protected isModalOpen = signal<boolean>(false);
  protected modalTitle = signal<string>('Ajouter une nouvelle référence article');

  // Exposition de la constante universelle de responsivité des grilles
  protected readonly gridGutter = ERP_GRID_GUTTER;

  
  ngOnInit(): void {
    this.loadCatalog();
  }

  /**
   * CHARGEMENT DU CATALOGUE
   * Appelle ton service d'origine 'getProducts()' pour alimenter le signal
   */
  loadCatalog(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Erreur de production - API hors ligne :', err);
        this.errorMessage.set('Impossible de charger le catalogue. Veuillez vérifier la connexion avec le serveur.');
        this.isLoading.set(false);
      }
    });
  }

  // --- FONCTIONS DE PILOTAGE DE L'INTERFACE ET MODALE ---

  openCreationModal(): void {
    this.modalTitle.set('Ajouter une nouvelle référence article');
    this.isModalOpen.set(true);
  }

  handleModalClose(): void {
    this.isModalOpen.set(false);
  }

  onProductCreated(): void {
    this.isModalOpen.set(false); 
    this.loadCatalog(); // Rechargement automatique des listes et grilles
  }

  /**
   * ACTION 1 : MODIFICATION (ÉDITION D'UN PRODUIT)
   */
 onEditProduct(productId: number): void {
    // Redirection propre vers la fiche produit : /commercial/products/ex: id= 45
    this.router.navigate(['/commercial/products', productId]);
  }

  /**
   * ACTION 2 : SUPPRESSION SÉCURISÉE (UX ENTERPRISE)
   * Déclenche une boîte de dialogue de confirmation stricte avant l'appel API
   */
  onDeleteProduct(id: number, sku: string): void {
    this.modalService.confirm({
      nzTitle: 'Confirmation de suppression',
      nzContent: `Êtes-vous sûr de vouloir retirer définitivement le produit <b>${sku}</b> du catalogue des stocks ?`,
      nzOkText: 'Supprimer l’article',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Annuler',
      nzOnOk: () => this.executeProductDeletion(id)
    });
  }

  private executeProductDeletion(id: number): void {
    this.isLoading.set(true);
    
    // On présuppose que ton service possède une méthode deleteProduct(id), sinon on la créera ensemble
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.message.success('Le produit a été supprimé avec succès.');
        this.loadCatalog(); // Rafraîchissement automatique
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

}
