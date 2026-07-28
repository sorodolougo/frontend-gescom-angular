import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // <-- On garde uniquement ces deux briques légères

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // Gère l'affichage dynamique de la zone blanche
    RouterLink,   // Gère l'écoute des clics et alimente le nzMatchRouter de NG-ZORRO
  //  RouterLinkActive,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  // Notre signal réactif pour piloter l'état de la Sidebar
  isCollapsed = signal<boolean>(false);

  // Méthode sécurisée pour intercepter le changement d'état imposé par NG-ZORRO
  onCollapseChange(collapsed: any): void {
    this.isCollapsed.set(!!collapsed);
  }
}
