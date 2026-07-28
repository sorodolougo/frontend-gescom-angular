// src/app/shared/utils/commercial-math.ts

export class CommercialMath {
  
  /**
   * Calcule le montant de la TVA à partir du Prix HT et du taux
   * ex: (10000, 20) -> 2000
   */
  static calculateVatAmount(priceHt: number, vatRate: number): number {
    if (!priceHt || !vatRate) return 0;
    return (priceHt * vatRate) / 100;
  }

  /**
   * Calcule le Prix TTC global
   * ex: (10000, 20) -> 12000
   */
  static calculatePriceTtc(priceHt: number, vatRate: number): number {
    if (!priceHt) return 0;
    const vatAmount = this.calculateVatAmount(priceHt, vatRate);
    return priceHt + vatAmount;
  }
}
