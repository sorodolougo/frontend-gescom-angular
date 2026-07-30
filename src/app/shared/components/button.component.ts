// src/app/shared/components/button/button.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Typage strict des types d'actions autorisés dans la GesCom
export type ButtonActionType = 'save' | 'cancel' | 'delete' | 'edit' | 'create' | 'export';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
  template: `
    <button
      nz-button
      [nzType]="computedNzType"
      [nzDanger]="action() === 'delete'"
      [type]="htmlType()"
      [disabled]="disabled() || loading()"
      [nzLoading]="loading()"
      (click)="btnClick.emit($event)">
      
      <!-- Injection automatique de l'icône selon l'action métier -->
      @if (computedIcon && !loading()) {
        <span nz-icon [nzType]="computedIcon"></span>
      }
      
      <!-- Contenu textuel du bouton -->
      <ng-content></ng-content>
    </button>
  `
})
export class AppButtonComponent {
  // Propriétés de configuration via les Signals d'Angular 21
  action = input.required<ButtonActionType>(); 
  htmlType = input<'button' | 'submit'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  // Émetteur d'événement moderne pour capter le clic
  btnClick = output<MouseEvent>();

  // Calcule automatiquement le style graphique Ant Design (Primary, Default, etc.)
  get computedNzType(): 'primary' | 'default' | 'text' {
    switch (this.action()) {
      case 'save':
      case 'create':
        return 'primary'; // Bleu corporate
      case 'cancel':
      case 'export':
        return 'default'; // Blanc avec bordure grise
      case 'edit':
        return 'primary';    // Bleu corporate
      case 'delete':
        return 'primary'; // Devient rouge combiné avec [nzDanger]
      default:
        return 'default';
    }
  }

  // Calcule automatiquement l'icône standardisée de la GesCom
  get computedIcon(): string {
    switch (this.action()) {
      case 'save': return 'save';
      case 'create': return 'plus';
      case 'cancel': return 'arrow-left';
      case 'delete': return 'delete';
      case 'edit': return 'edit';
      case 'export': return 'file-excel';
      default: return '';
    }
  }
}
