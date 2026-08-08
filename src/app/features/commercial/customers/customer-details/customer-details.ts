import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer/customer';
import { Customer } from '../../../../models/customer.model';
import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppTextComponent } from '../../../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { InvoiceService } from '../../../../core/services/invoice/invoice';
import { Invoice } from '../../../../models/invoice.model';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SHARED_ZORRO_MODULES,
    AppButtonComponent,
    AppTextComponent
  ],
  templateUrl: './customer-details.html',
  styleUrls: ['./customer-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetails implements OnInit {
  
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private invoiceService = inject(InvoiceService); // 🟢 Injection du service de facturation

  customer = signal<Customer | null>(null);
  customerInvoices = signal<Invoice[]>([]); // 🟢 Signal pour stocker l'historique des factures du client
  isLoading = signal<boolean>(false);

  // 🧮 CALCULATEUR FINANCIER D'ÉLITE (COMPUTED SIGNAL)
  // Calcule automatiquement le volume d'achat total cumulé (Chiffre d'Affaires du client)
  totalPurchased = computed(() => {
    return this.customerInvoices().reduce((acc, invoice) => acc + invoice.totalAmountTtc, 0);
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCustomerData(id);
    }
  }

  loadCustomerData(id: number): void {
    this.isLoading.set(true);
    
    // Chargement parallèle fluide du profil et de son historique de facturation Cloud
    this.customerService.getCustomerById(id).subscribe({
      next: (customerData) => {
        this.customer.set(customerData);
        
        // Chaînage propre pour extraire ses factures Neon
        this.invoiceService.getInvoicesByCustomerId(id).subscribe({
          next: (invoicesData) => {
            this.customerInvoices.set(invoicesData);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Erreur chargement factures client', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Erreur chargement profil client', err);
        this.isLoading.set(false);
      }
    });
  }
}
