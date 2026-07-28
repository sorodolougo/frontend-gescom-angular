// src/app/shared/pipes/app-currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency',
  standalone: true
})
export class AppCurrencyPipe implements PipeTransform {
  // Par défaut, l'ERP utilise la monnaie locale XOF, mais tu pourras la rendre dynamique
  transform(value: number | string | null | undefined, currencyCode: string = 'XOF'): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0 F CFA';
    }

    const amount = Number(value);
    
    // Formatage standardisé propre aux transactions d'Afrique de l'Ouest / International
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0 // Pas de centimes pour le XOF en GesCom
    }).format(amount);
  }
}
