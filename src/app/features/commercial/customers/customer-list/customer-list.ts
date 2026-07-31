import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules NG-ZORRO indispensables pour le grand tableau et la mise en page

import { AppButtonComponent } from '../../../../shared/components/button.component';
import { AppTextComponent } from '../../../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { CustomerService } from '../../../../core/services/customer/customer';
import { Customer } from '../../../../models/customer.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddCustomer } from '../add-customer/add-customer';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule, 
   SHARED_ZORRO_MODULES,
    AppButtonComponent,
    AppTextComponent
  ],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss']
})
export class CustomerList implements OnInit {
  private customerService = inject(CustomerService);
    private message = inject(NzMessageService);
  private modalService = inject(NzModalService);
    private router = inject(Router);

  // GESTION DE L'ÉTAT RÉACTIF PAR SIGNALS (ANGULAR 21)
  customers = signal<Customer[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAllCustomers();
  }

  loadAllCustomers(): void {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients', err);
        this.isLoading.set(false);
      }
    });
  }


  /**
   * ROBOTISATION MODAL : Ouvre le formulaire d'ajout au-dessus du tableau
   */
  openCreationModal(): void {
    const modal = this.modalService.create({
      nzTitle: 'Ajouter une nouvelle fiche client',
      nzContent: AddCustomer, // On injecte directement notre composant formulaire
      nzWidth: 600, // Largeur élégante pour les champs du formulaire
      nzFooter: null, // On cache le footer de base car on utilise déjà nos propres boutons app-button
      nzMaskClosable: false // Empêche la fermeture accidentelle en cliquant à côté du formulaire
    });

    // À la fermeture de la modal, si le formulaire a renvoyé "true", on rafraîchit le tableau automatiquement !
    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.loadAllCustomers(); // Rechargement fluide instantané
      }
    });
  }

 
/**
   * NAVIGATION PROFILE : Propulse l'utilisateur sur la page dédiée du client
   * @param id L'identifiant unique du tiers à inspecter
   */
  navigateToCustomerDetails(id: number): void {
    this.router.navigate(['/commercial/customers', id]); // Génère l'URL : /commercial/customers/12
  }




  /**
   * ROBOTISATION MODAL : Ouvre le même formulaire en mode ÉDITION
   * @param id L'identifiant technique du tiers à modifier
   */
  onEditCustomer(id: number): void {
    const modal = this.modalService.create({
      nzTitle: 'Modifier la fiche client',
      nzContent: AddCustomer,
      nzWidth: 600,
      nzFooter: null,
      nzMaskClosable: false,
      // FIX POSITIONNEMENT : On injecte l'ID directement à la racine de la configuration
      nzData: { customerId: id } 
    });

    // À la fermeture, si des modifications ont été enregistrées, on rafraîchit le tableau
    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.loadAllCustomers(); // Rafraîchissement fluide instantané
      }
    });
  }






  /**
   * ACTION 2 : SUPPRESSION SÉCURISÉE (UX ENTERPRISE)
   * Déclenche une boîte de dialogue de confirmation stricte avant l'appel API
   */
  onDeleteCustomer(id: number, code: string): void {
    this.modalService.confirm({
      nzTitle: 'Confirmation de suppression',
      nzContent: `Êtes-vous sûr de vouloir retirer définitivement le produit <b>${code}</b> du catalogue des stocks ?`,
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
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.message.success('Le Client a été supprimé avec succès.');
        this.loadAllCustomers(); // Rafraîchissement automatique
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }




}
