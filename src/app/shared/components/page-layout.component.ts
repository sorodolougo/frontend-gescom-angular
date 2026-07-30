// src/app/shared/components/page-layout/page-layout.component.ts
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule],
  template: `
    <div class="erp-page-container">
      
      <!-- En-tête de page automatisé NG-ZORRO -->
      <nz-page-header 
        class="erp-page-header" 
        [nzTitle]="title()" 
        [nzSubtitle]="subtitle()">
        
        <!-- Zone d'action de l'en-tête (Boutons injectés dynamiquement) -->
        <nz-page-header-extra>
          <div class="header-actions-slot">
            <ng-content select="[actions]"></ng-content>
          </div>
        </nz-page-header-extra>

      </nz-page-header>

      <!-- Zone centrale de contenu de la page (Tableaux, Formulaires) -->
      <main class="erp-page-body">
        <ng-content></ng-content>
      </main>

    </div>
  `,
  styles: [`
    .erp-page-container {
    
      background-color: #f4f6f9; /* Fond gris clair standard des ERP d'entreprise */
      min-height: 100vh;
    }
    .erp-page-header {
      background: #ffffff;
      border-radius: 8px;
      padding: 16px 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
      
    .header-actions-slot {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .erp-page-body {
      background: #ffffff;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class AppPageLayoutComponent {
  // Propriétés obligatoires et optionnelles gérées par les Signals d'Angular 21
  title = input.required<string>();
  subtitle = input<string>('');
}
