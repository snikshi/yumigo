import * as Localization from 'expo-localization';

// 1. Define the approximate exchange rate (You can update this later)
const EXCHANGE_RATES = {
  US: 1,    // 1 USD = 1 USD
  IN: 85,   // 1 USD = 85 INR (Approx)
  GB: 0.8,  // 1 USD = 0.8 GBP
  EU: 0.95, // 1 USD = 0.95 EUR
};

const SYMBOLS = {
  US: '$',
  IN: '₹',
  GB: '£',
  EU: '€',
};

// 2. The Master Function
export const formatPrice = (priceInUSD) => {
  // Get the user's region (e.g., "IN" for India, "US" for USA)
  const userRegion = Localization.getLocales()[0]?.regionCode || 'US';

  // Get the multiplier and symbol (Default to US if unknown)
  const multiplier = EXCHANGE_RATES[userRegion] || 1;
  const symbol = SYMBOLS[userRegion] || '$';

  // Calculate new price
  const finalPrice = (priceInUSD * multiplier).toFixed(0); // Remove decimals for clean look

  return `${symbol}${finalPrice}`;
};