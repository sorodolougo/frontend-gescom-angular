import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router'; 
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
    NzLayoutModule,
    NzMenuModule,
    NzIconModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout implements OnInit, OnDestroy {
  // Injection moderne des dépendances d'infrastructure
  private router = inject(Router);

  // 1. SIGNALS MODERNES D'ANGULAR 21 (REACTIVE STATE MANAGEMENT)
  isCollapsed = signal<boolean>(false);
  currentDateTime = signal<Date>(new Date());
  
  private timerId: any;
  private routerSubscription!: Subscription;

  ngOnInit(): void {
    // HORLOGE UNIVERSELLE : Met à jour le signal chaque seconde (1000 ms)
    this.timerId = setInterval(() => {
      this.currentDateTime.set(new Date());
    }, 1000);

    // ERGONOMIE MOBILE : Pliage automatique de la sidebar lors du changement d'écran
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Stratégie Senior : On force la fermeture (true) sur mobile et tablette 
      // pour laisser immédiatement place au contenu de la nouvelle page choisie
      if (window.innerWidth <= 992) {
        this.isCollapsed.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    // Destruction chirurgicale des processus pour éliminer tout risque de fuite de mémoire
    if (this.timerId) clearInterval(this.timerId);
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  /**
   * Méthode sécurisée pour intercepter le changement d'état imposé par NG-ZORRO
   * @param collapsed État de la sidebar renvoyé par le composant natif
   */
  onCollapseChange(collapsed: any): void {
    this.isCollapsed.set(!!collapsed);
  }
}
