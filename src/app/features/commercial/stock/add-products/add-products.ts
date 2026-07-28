// FIX TS2305 : Changement de @angular/common vers @angular/core
import { Component, inject, output, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormControl, AbstractControl } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../models/product.model';
import { AppInputComponent } from '../../../../shared/components/input.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { ERP_GRID_GUTTER } from '../../../../shared/components/ui-constants';
import { finalize } from 'rxjs';
import { AppButtonComponent } from '../../../../shared/components/button.component';

interface ProductForm {
  sku: FormControl<string>;
  name: FormControl<string>;
  priceHt: FormControl<number>;
  vatRate: FormControl<number>;
  currentStock: FormControl<number>;
}

@Component({
  selector: 'app-add-products',
  standalone: true, // FIX NG2012 : S'assure que le composant est explicitement Standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    AppInputComponent,
    AppButtonComponent,
    SHARED_ZORRO_MODULES
  ],
  templateUrl: './add-products.html',
  styleUrl: './add-products.scss',
})
export class AddProducts {
  private fb = inject(NonNullableFormBuilder);
  private productService = inject(ProductService);
  private message = inject(NzMessageService);
  protected readonly gridGutter = ERP_GRID_GUTTER;

  productSaved = output<void>();
  isSubmitting = signal<boolean>(false);

 protected form = this.fb.group<ProductForm>({
  sku: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
  name: this.fb.control('', [Validators.required, Validators.maxLength(150)]),
  
  // Sécurisation du Prix HT : minimum 0.01 et maximum réaliste pour la BDD
  priceHt: this.fb.control(0, [
    Validators.required, 
    Validators.min(0.01), 
    Validators.max(99999999999) 
  ]),
  
  // Sécurisation de la TVA : Pas plus de 100% de taxe
  vatRate: this.fb.control(20.00, [
    Validators.required, 
    Validators.min(0), 
    // FIX MAGIE : Empêche physiquement de faire planter PostgreSQL
    Validators.max(100) 
  ]),
  
  currentStock: this.fb.control(0, [Validators.required, Validators.min(0)])
});


  
submitForm(): void {
  // 1. Validation native globale et arrêt si le formulaire est invalide
  if (this.form.invalid) {
    this.form.markAllAsTouched(); // Déclenche instantanément toutes les erreurs visuelles du template
    this.message.error('Veuillez remplir correctement les champs obligatoires.');
    return;
  }

  this.isSubmitting.set(true);

  // Appel au service avec sécurisation du cycle de vie du bouton via 'finalize'
  this.productService.createProduct(this.form.getRawValue())
    .pipe(
      finalize(() => this.isSubmitting.set(false)) // S'exécute TOUJOURS (Succès ou Échec) -> Évite la duplication
    )
    .subscribe({
      next: () => {
        this.message.success('Produit ajouté avec succès au catalogue !');
        
        // Grâce au NonNullableFormBuilder, reset() remet à zéro selon les valeurs d'initialisation par défaut
        this.form.reset(); 
        
        this.productSaved.emit();
      }
      // Le bloc error: () est supprimé car le loader est coupé par finalize 
      // et l'affichage visuel de la panne est délégué à notre ErrorInterceptor.
    });
}

}
