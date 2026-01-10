import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', rate: 1, name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', rate: 0.012, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.011, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.0095, name: 'British Pound' },
  { code: 'JPY', symbol: '¥', rate: 1.79, name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', rate: 0.018, name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', rate: 0.016, name: 'Canadian Dollar' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
  formatPrice: (priceInINR: number) => string;
  convertPrice: (priceInINR: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  const convertPrice = (priceInINR: number): number => {
    return Math.round(priceInINR * currency.rate * 100) / 100;
  };

  const formatPrice = (priceInINR: number): string => {
    const converted = convertPrice(priceInINR);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      currencies,
      formatPrice,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};