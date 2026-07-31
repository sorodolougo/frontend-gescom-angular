import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer/customer';
import { Customer } from '../../../../models/customer.model';
import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppTextComponent } from '../../../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';

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
  styleUrls: ['./customer-details.scss']
})
export class CustomerDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);

  customer = signal<Customer | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCustomerDetails(id);
    }
  }

  loadCustomerDetails(id: number): void {
    this.isLoading.set(true);
    this.customerService.getCustomerById(id).subscribe({
      next: (data) => {
        this.customer.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur de chargement du profil client', err);
        this.isLoading.set(false);
      }
    });
  }
}
