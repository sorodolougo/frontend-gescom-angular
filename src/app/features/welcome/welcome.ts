import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

// Imports des modules NG-ZORRO requis

import { CommonModule } from '@angular/common';
import { AppTextComponent } from '../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../shared/components/ui-components';
import { AppPageLayoutComponent } from '../../shared/components/page-layout.component';
import { ProductDetails } from '../commercial/stock/product-details/product-details';
import { AppButtonComponent } from '../../shared/components/button.component';
import { Router } from '@angular/router';



@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [
    CommonModule,
    AppTextComponent,
    SHARED_ZORRO_MODULES,
    AppButtonComponent, 
  ], 
 
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Welcome {
  
 private router = inject(Router);

  /**
   * Redirige automatiquement le visiteur vers le catalogue produits
   */
  navigateToProducts(): void {
    this.router.navigate(['/commercial/products']); // Ajuste la route selon ton routage exact
  }

  
}
