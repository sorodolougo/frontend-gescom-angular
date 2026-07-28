// src/app/shared/components/input.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, ReactiveFormsModule, NgControl } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NzFormModule, 
    NzInputModule
  ],
  template: `
    <nz-form-item>
      @if (label()) {
        <nz-form-label [nzRequired]="required()">{{ label() }}</nz-form-label>
      }
      
      <!-- FIX FINAL TS2322 : Utilisation d'une chaîne de caractères explicite attendue par NG-ZORRO -->
      <nz-form-control 
        [nzErrorTip]="computedErrorTip" 
        [nzValidateStatus]="(ngControl?.control?.invalid && ngControl?.control?.dirty) ? 'error' : ''"
        nzHasFeedback>
        <input
          nz-input
          [type]="type()"
          [placeholder]="placeholder()"
          [value]="value"
          [disabled]="disabled"
          (input)="onInputChange($event)"
          (blur)="onTouched()" />
      </nz-form-control>
    </nz-form-item>
  `
})
export class AppInputComponent implements ControlValueAccessor {
  
  public ngControl = inject(NgControl, { optional: true, self: true });

  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  required = input<boolean>(false);

  value: any = '';
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get computedErrorTip(): string {
    if (!this.ngControl || !this.ngControl.errors) return '';

    const errors = this.ngControl.errors;
    const fieldLabel = this.label() || 'Ce champ';

    if (errors['required']) return `${fieldLabel} est obligatoire.`;
    if (errors['minlength']) return `${fieldLabel} doit contenir au moins ${errors['minlength'].requiredLength} caractères.`;
    if (errors['maxlength']) return `${fieldLabel} ne peut pas dépasser ${errors['maxlength'].requiredLength} caractères.`;
    if (errors['min']) return `${fieldLabel} doit être supérieur ou égal à ${errors['min'].min}.`;
    if (errors['max']) return `${fieldLabel} ne peut pas dépasser ${errors['max'].max}.`;
    if (errors['email']) return `Veuillez saisir une adresse email valide.`;

    return 'Champ invalide.';
  }

  writeValue(value: any): void { 
    this.value = value; 
  }

  registerOnChange(fn: any): void { 
    this.onChange = fn; 
  }

  registerOnTouched(fn: any): void { 
    this.onTouched = fn; 
  }

  setDisabledState(isDisabled: boolean): void { 
    this.disabled = isDisabled; 
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    
    this.onChange(this.value);

    if (this.ngControl && this.ngControl.control) {
      this.ngControl.control.markAsDirty();
      this.ngControl.control.markAsTouched();
      this.ngControl.control.updateValueAndValidity({ emitEvent: false });
    }
  }
}
