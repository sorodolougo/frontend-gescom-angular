import { Customer } from './customer.model';
import { Product } from './product.model';

export interface InvoiceLine {
  id?: number;
  product: Product;
  quantity: number;
  unitPriceHt: number;
  vatRate: number;
  totalHt: number;
  totalTtc: number;
  totalVat: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string; // Généré par le backend (ex: FAC-2026-0001)
  customer: Customer;
  invoiceLines: InvoiceLine[];
  totalAmountHt: number;
  totalAmountVat: number;
  totalAmountTtc: number;
  status: 'BROUILLON' | 'VALIDEE' | 'PAYEE' | 'ANNULEE';
  createdAt: string;
}
