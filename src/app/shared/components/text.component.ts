// src/app/shared/components/text/text.component.ts
import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

// Typage strict des variantes autorisées dans l'ERP
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body-lead' | 'body' | 'caption';
export type TextType = 'secondary' | 'success' | 'warning' | 'danger' | undefined;

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule, NzTypographyModule],
  template: `
    @switch (variant()) {
      @case ('h1') { <h1 nz-title [nzType]="type()" [nzDisabled]="disabled()" class="app-text-h1"><ng-container *ngTemplateOutlet="content"></ng-container></h1> }
      @case ('h2') { <h2 nz-title [nzType]="type()" [nzDisabled]="disabled()" class="app-text-h2"><ng-container *ngTemplateOutlet="content"></ng-container></h2> }
      @case ('h3') { <h3 nz-title [nzType]="type()" [nzDisabled]="disabled()" class="app-text-h3"><ng-container *ngTemplateOutlet="content"></ng-container></h3> }
      @case ('h4') { <h4 nz-title [nzType]="type()" [nzDisabled]="disabled()" class="app-text-h4"><ng-container *ngTemplateOutlet="content"></ng-container></h4> }
      @case ('body-lead') { <p nz-paragraph [nzType]="type()" [nzDisabled]="disabled()" class="app-text-body-lead"><ng-container *ngTemplateOutlet="content"></ng-container></p> }
      @case ('caption') { <span nz-text [nzType]="type()" [nzDisabled]="disabled()" class="app-text-caption"><ng-container *ngTemplateOutlet="content"></ng-container></span> }
      @default { <p nz-paragraph [nzType]="type()" [nzDisabled]="disabled()" class="app-text-body"><ng-container *ngTemplateOutlet="content"></ng-container></p> }
    }

    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: [`
    :host { display: inline-block; width: 100%; }
  `]
})
export class AppTextComponent {
  // Entrées basées sur les Signals d'Angular 21
  variant = input<TextVariant>('body');
  type = input<TextType>(undefined);
  disabled = input<boolean>(false);
}
