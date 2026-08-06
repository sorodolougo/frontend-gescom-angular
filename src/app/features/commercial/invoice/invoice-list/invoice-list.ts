import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Modules NG-ZORRO indispensables pour le grand livre de facturation

import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppTextComponent } from '../../../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { Invoice } from '../../../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppButtonComponent,
    AppTextComponent,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceList implements OnInit {
  private router = inject(Router);

  // GESTION DE L'ÉTAT RÉACTIF PAR SIGNALS (ANGULAR 21)
  invoices = signal<Invoice[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAllInvoices();
  }

  loadAllInvoices(): void {
    this.isLoading.set(true);
    // Simulation temporaire du jeu de données en attendant le Backend Spring Boot
    setTimeout(() => {
      this.invoices.set([]); // On démarre à vide ou avec un tableau d'historique
      this.isLoading.set(false);
    }, 400);
  }

  navigateToCreate(): void {
    this.router.navigate(['/commercial/invoices/create']);
  }

  onViewInvoice(id: number): void {
    console.log('Consultation de la facture ID:', id);
    // Prochainement : router.navigate(['/commercial/invoices', id]);
  }
}
