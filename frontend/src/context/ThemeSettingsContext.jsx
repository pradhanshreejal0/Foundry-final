import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const ThemeSettingsContext = createContext();

export function ThemeSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    announcementText: 'FREE SHIPPING ON ORDERS OVER $50 • USE CODE SEIKO20',
    countdownTarget: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    announcementEnabled: true,
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'],
    storeName: 'Seiko Store',
    primaryColor: '#000000'
  });
  const [banners, setBanners] = useState([]);
  const [currencies, setCurrencies] = useState([
    { code: 'USD', rate: 1.0, symbol: '$' },
    { code: 'EUR', rate: 0.92, symbol: '€' },
    { code: 'GBP', rate: 0.79, symbol: '£' },
    { code: 'JPY', rate: 154.5, symbol: '¥' },
    { code: 'CAD', rate: 1.35, symbol: 'CA$' }
  ]);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  const fetchThemeData = async () => {
    try {
      setLoading(true);
      const [settingsRes, bannersRes, currenciesRes] = await Promise.all([
        api('/theme/settings').catch(() => ({ data: null })),
        api('/theme/banners').catch(() => ({ data: [] })),
        api('/theme/currencies').catch(() => ({ data: [] }))
      ]);

      if (settingsRes?.data) setSettings(settingsRes.data);
      if (bannersRes?.data) setBanners(bannersRes.data);
      if (currenciesRes?.data && currenciesRes.data.length > 0) {
        setCurrencies(currenciesRes.data);
      }
    } catch (err) {
      console.error('Failed to load theme settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeData();
  }, []);

  const formatPrice = (amountInUSD) => {
    const curr = currencies.find(c => c.code === currentCurrency) || { rate: 1.0, symbol: '$' };
    const converted = amountInUSD * curr.rate;
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  return (
    <ThemeSettingsContext.Provider value={{
      settings,
      banners,
      currencies,
      currentCurrency,
      setCurrentCurrency,
      formatPrice,
      refreshTheme: fetchThemeData,
      loading
    }}>
      {children}
    </ThemeSettingsContext.Provider>
  );
}

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within a ThemeSettingsProvider');
  }
  return context;
}
