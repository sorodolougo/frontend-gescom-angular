// src/app/features/commercial/stock/product-details/product-details.ts
import { Component, inject, input, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppPageLayoutComponent } from '../../../../shared/components/page-layout.component';
import { AppInputComponent } from '../../../../shared/components/input.component';
import { AppButtonComponent } from '../../../../shared/components/button.component';
import { ProductService } from '../../../../core/services/product.service';
import { Router } from '@angular/router';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    AppPageLayoutComponent, 
    AppInputComponent, 
    AppButtonComponent,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails {
  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // MAGIE ANGULAR 21 : L'id de l'URL est capturé automatiquement dans ce Signal Input !
  id = input.required<string>(); 
  
  protected isSubmitting = signal<boolean>(false);

  protected form = this.fb.group({
    sku: this.fb.control('', [Validators.required]),
    name: this.fb.control('', [Validators.required]),
    priceHt: this.fb.control(0, [Validators.required, Validators.min(0.01)]),
    vatRate: this.fb.control(20.00, [Validators.required, Validators.min(0)]),
    currentStock: this.fb.control(0, [Validators.required, Validators.min(0)])
  });

  constructor() {
    /**
     * ÉCOUTEUR RÉACTIF AUTOMATIQUE
     * Dès que le composant se charge avec un ID dans l'URL, on appelle l'API Spring Boot
     */
    effect(() => {
      const productId = Number(this.id());
      
      // Sécurité : si l'id vaut 0 ou "new", on reste en mode création, sinon on charge le produit
      if (productId) {
        this.productService.getProductById(productId).subscribe({
          next: (product) => {
            this.form.patchValue(product);
            this.form.controls.sku.disable(); // Interdiction de modifier le SKU
          },
          error: () => {
            this.message.error("Impossible de charger les détails de cet article.");
            this.goBackToList();
          }
        });
      }
    });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.form.getRawValue();

    // Mise à jour de la fiche via l'ID de l'URL
    this.productService.updateProduct(Number(this.id()), payload).subscribe({
      next: () => {
        this.message.success('La fiche produit a été mise à jour avec succès !');
        this.goBackToList();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  goBackToList(): void {
    this.router.navigate(['/commercial/products']);
  }
}
