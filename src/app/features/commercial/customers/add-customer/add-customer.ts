import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal'; // <-- AJOUT DU LIEN MODAL

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CustomerService } from '../../../../core/services/customer/customer';
import { AppButtonComponent } from '../../../../shared/components/button.component';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
    AppButtonComponent
  ],
  templateUrl: './add-customer.html',
  styleUrls: ['./add-customer.scss']
})
export class AddCustomer {
  private fb = inject(NonNullableFormBuilder);
  private customerService = inject(CustomerService);
  private modalRef = inject(NzModalRef); // <-- Référence pour pouvoir fermer la modal

    // FIX INJECTION : On intercepte les données brutes de la modal de manière sécurisée
  private modalData = inject(NZ_MODAL_DATA, { optional: true }); 


  // Reçoit l'ID envoyé dynamiquement par le tableau lors du clic sur Éditer
  customerId = signal<number | null>(null);
  isSaving = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.pattern('^[0-9+ ]*$')]],
    email: ['', [Validators.email]],
    address: [''],
    customerType: ['PARTICULIER' as 'PARTICULIER' | 'ENTREPRISE', [Validators.required]]
  });



 ngOnInit(): void {
    // Si la modal contient des données d'édition, on configure le mode
    if (this.modalData && this.modalData.customerId) {
      const id = this.modalData.customerId;
      this.customerId.set(id);
      this.isEditMode.set(true);
      
      // Appel réseau vers ton API Render pour récupérer la fiche à jour
      this.customerService.getCustomerById(id).subscribe({
        next: (customer) => {
          this.customerForm.patchValue(customer); // Remplissage automatique des champs
        },
        error: (err) => console.error('Erreur lors de la récupération du client', err)
      });
    }
  }


  submitForm(): void {
    if (this.customerForm.valid) {
      this.isSaving.set(true);
      
      // Choix de l'API selon le mode de traitement (PUT pour modification, POST pour création)
      const request$ = this.isEditMode()
        ? this.customerService.updateCustomer(this.customerId()!, this.customerForm.getRawValue())
        : this.customerService.createCustomer(this.customerForm.getRawValue());

      request$.subscribe({
        next: () => {
          this.isSaving.set(false);
          this.modalRef.destroy(true); // Ferme et rafraîchit le tableau
        },
        error: (err) => {
          console.error('Erreur lors du traitement', err);
          this.isSaving.set(false);
        }
      });
    } else {
      Object.values(this.customerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  closeModal(): void {
    this.modalRef.destroy(false);
  }


}
