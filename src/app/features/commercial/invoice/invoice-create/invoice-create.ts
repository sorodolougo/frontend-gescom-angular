import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Nos services existants et notre nouveau modèle

import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppTextComponent } from '../../../../shared/components/text.component';
import { CustomerService } from '../../../../core/services/customer/customer';
import { ProductService } from '../../../../core/services/product.service';
import { Customer } from '../../../../models/customer.model';
import { InvoiceLine } from '../../../../models/invoice.model';
import { Product } from '../../../../models/product.model';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppButtonComponent,
    AppTextComponent,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './invoice-create.html',
  styleUrls: ['./invoice-create.scss']
})
export class InvoiceCreate implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private router = inject(Router);

  // ÉTATS DE SÉLECTION ISSUS DU CLOUD NEON
  customersList = signal<Customer[]>([]);
  productsList = signal<Product[]>([]);
  isSaving = signal<boolean>(false);

  // PANIER D'ACHAT RÉACTIF (SIGNAL TABLEAU)
  invoiceLines = signal<InvoiceLine[]>([]);

  // FORMULAIRES DE CONFIGURATION
  invoiceForm = this.fb.group({
    customerId: [null as number | null, [Validators.required]]
  });

  lineForm = this.fb.group({
    productId: [null as number | null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  // 🧮 CALCULATEURS FINANCIERS AUTOMATIQUES (COMPUTED SIGNALS)
  totalHt = computed(() => this.invoiceLines().reduce((acc, line) => acc + line.totalHt, 0));
  totalVat = computed(() => this.invoiceLines().reduce((acc, line) => acc + line.totalVat, 0)); // Modifié pour stocker la tva de la ligne
  totalTtc = computed(() => this.invoiceLines().reduce((acc, line) => acc + line.totalTtc, 0));

  ngOnInit(): void {
    // Chargement parallèle des référentiels pour alimenter nos selects premium
    this.customerService.getCustomers().subscribe(data => this.customersList.set(data));
    this.productService.getProducts().subscribe(data => this.productsList.set(data));
  }

    /**
   * Ajoute un article dans le panier de facturation et calcule ses montants immédiats
   */
  addInvoiceLine(): void {
    if (this.lineForm.valid) {
      const pId = this.lineForm.controls.productId.value;
      const qty = this.lineForm.controls.quantity.value;
      const selectedProduct = this.productsList().find(p => p.id === pId);

      if (selectedProduct) {
        const uPriceHt = selectedProduct.priceHt;
        const vRate = selectedProduct.vatRate;
        const lineTotalHt = uPriceHt * qty;
        const lineTotalVat = lineTotalHt * (vRate / 100);
        const lineTotalTtc = lineTotalHt + lineTotalVat;

        // FIX TYPESCRIPT : Objet parfaitement conforme à l'interface InvoiceLine
        const newLine: InvoiceLine = {
          product: selectedProduct,
          quantity: qty,
          unitPriceHt: uPriceHt,
          vatRate: vRate,
          totalHt: lineTotalHt,
          totalVat: lineTotalVat, // Assigné proprement
          totalTtc: lineTotalTtc
        };

        // Mise à jour réactive immuable du signal
        this.invoiceLines.set([...this.invoiceLines(), newLine]);
        this.lineForm.reset({ productId: null, quantity: 1 }); // Reset du sélecteur d'article
      }
    }
  }


  removeInvoiceLine(index: number): void {
    const currentLines = this.invoiceLines();
    currentLines.splice(index, 1);
    this.invoiceLines.set([...currentLines]);
  }

  saveInvoice(): void {
    if (this.invoiceForm.valid && this.invoiceLines().length > 0) {
      this.isSaving.set(true);
      console.log('Facture prête pour l\'envoi au serveur Spring Boot:', {
        customerId: this.invoiceForm.controls.customerId.value,
        lines: this.invoiceLines()
      });
      // Prochaine session : Raccordement au service HTTP
    }
  }
}
