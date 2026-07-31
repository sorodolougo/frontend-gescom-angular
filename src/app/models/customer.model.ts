export interface Customer {
  id: number;
  customerCode: string; // Généré automatiquement par le backend (ex: CLI0001)
  name: string;         // Raison sociale ou Nom complet
  phone: string;
  email: string;
  address: string;
  customerType: 'PARTICULIER' | 'ENTREPRISE'; // Type de tiers B2B / B2C
  createdAt: string;
}

