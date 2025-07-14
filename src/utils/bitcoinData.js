// Utility functions to generate fake Bitcoin data

// Exchange rates (fake but realistic)
export const EXCHANGE_RATES = {
  CAD_TO_USD: 0.73,
  USD_TO_CAD: 1.37,
};

// Generate fake Bitcoin price data
export const generatePriceData = (days = 7, currency = "CAD") => {
  const data = [];
  const basePrice = currency === "CAD" ? 89000 : 65000; // CAD vs USD base prices
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic price fluctuations
    const volatility = Math.random() * 0.08 - 0.04; // ±4% daily volatility
    const price = basePrice * (1 + volatility * i * 0.1);

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
      formattedDate: date.toLocaleDateString(),
    });
  }

  return data;
};

// Generate trading volume data
export const generateVolumeData = (currency = "CAD") => {
  const data = [];
  const baseVolume = currency === "CAD" ? 2.8 : 2.1; // Billion CAD vs USD

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const volume = baseVolume + (Math.random() * 1.5 - 0.75); // Random variation

    data.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      volume: Math.round(volume * 100) / 100,
      date: date.toISOString().split("T")[0],
    });
  }

  return data;
};

// Generate market cap data
export const generateMarketCapData = (currency = "CAD") => {
  const data = [];
  const baseMarketCap = currency === "CAD" ? 1750 : 1280; // Billion CAD vs USD

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const marketCap = baseMarketCap + (Math.random() * 200 - 100); // Random variation

    data.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      marketCap: Math.round(marketCap),
      date: date.toISOString().split("T")[0],
    });
  }

  return data;
};

// Get current Bitcoin stats
export const getCurrentStats = (currency = "CAD") => {
  const basePrice = currency === "CAD" ? 89250 : 65120;
  const change24h = Math.random() * 8 - 4; // ±4% change
  const marketCap = currency === "CAD" ? 1764 : 1287;
  const volume24h = currency === "CAD" ? 3.2 : 2.3;

  return {
    currentPrice: Math.round(basePrice),
    change24h: Math.round(change24h * 100) / 100,
    marketCap: Math.round(marketCap),
    volume24h: Math.round(volume24h * 100) / 100,
    currency,
  };
};

// Convert price between currencies
export const convertPrice = (price, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return price;

  if (fromCurrency === "CAD" && toCurrency === "USD") {
    return Math.round(price * EXCHANGE_RATES.CAD_TO_USD);
  } else if (fromCurrency === "USD" && toCurrency === "CAD") {
    return Math.round(price * EXCHANGE_RATES.USD_TO_CAD);
  }

  return price;
};
