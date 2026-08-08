import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Modules et composants transverses d'IHM
import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppTextComponent } from '../../../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { Invoice } from '../../../../models/invoice.model';
import { NzNotificationService } from 'ng-zorro-antd/notification'; // 🟢 UX : Pour les alertes réseau
import { InvoiceService } from '../../../../core/services/invoice/invoice';

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
  private invoiceService = inject(InvoiceService); // 🟢 INJECTION DU SERVICE DE FACTURATION
  private notification = inject(NzNotificationService); // 🟢 INJECTION DU LOGICIEL D'ALERTE

  // GESTION DE L'ÉTAT RÉACTIF PAR SIGNALS (ANGULAR 21)
  invoices = signal<Invoice[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAllInvoices();
  }

  /**
   * CONNECTEUR CLOUD : Extrait le grand livre comptable depuis le serveur Render
   */
  loadAllInvoices(): void {
    this.isLoading.set(true);
    
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        // Hydratation instantanée du tableau réactif et des cartes mobiles
        this.invoices.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Impossible de charger le registre des ventes', err);
        
        // Alerte Premium SaaS à l'écran si le serveur est inaccessible
        this.notification.error(
          'Erreur d\'infrastructure',
          'Impossible de récupérer le grand livre des factures. Vérifiez votre connexion.',
          { nzDuration: 5000 }
        );
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/commercial/invoices/create']);
  }

/**
   * NAVIGATION PROFILE : Propulse l'utilisateur sur la page dédiée du client
   * @param id L'identifiant unique du tiers à inspecter
   */
  navigateToCustomerDetails(id: number): void {
    this.router.navigate(['/commercial/customers', id]); // Génère l'URL : /commercial/customers/12
  }

    /**
   * INVOICE PROFILE NAVIGATION : Propulse l'utilisateur sur la page de consultation de la facture
   * @param id L'identifiant technique unique du document de vente
   */
  onViewInvoice(id: number): void {
    // Génère proprement l'URL : /commercial/invoices/12
    this.router.navigate(['/commercial/customers', id]);
  }

 
}
