export type CurrencyCode = 'GBP' | 'USD' | 'EUR';

export type Currency = {
  name: string;
  symbol: string;
  format: string;
};

export const currencies: Record<CurrencyCode, Currency> = {
  GBP: {
    name: 'Great British Pound',
    symbol: '£',
    format: '£{amount}',
  },
  USD: {
    name: 'United States Dollar',
    symbol: '$',
    format: '${amount}',
  },
  EUR: {
    name: 'Euro',
    symbol: '€',
    format: '€{amount}',
  },
};
