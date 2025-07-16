const API_BASE_URL = "/api/coingecko";

const CURRENCY_MAP = {
  USD: "usd",
  CAD: "cad",
};

export const fetchBitcoinData = async (currency = "CAD") => {
  const coinGeckoCurrency = CURRENCY_MAP[currency] || "cad";

  try {
    const response = await fetch(
      `${API_BASE_URL}/simple/price?ids=bitcoin&vs_currencies=${coinGeckoCurrency}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMITED");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const bitcoinData = data.bitcoin;

    return {
      currentPrice: Math.round(bitcoinData[coinGeckoCurrency]),
      change24h:
        Math.round(bitcoinData[`${coinGeckoCurrency}_24h_change`] * 100) / 100,
      marketCap:
        Math.round(
          (bitcoinData[`${coinGeckoCurrency}_market_cap`] / 1000000000) * 100
        ) / 100,
      volume24h:
        Math.round(
          (bitcoinData[`${coinGeckoCurrency}_24h_vol`] / 1000000000) * 100
        ) / 100,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error);

    if (error.message === "RATE_LIMITED") {
      console.warn(
        "CoinGecko API rate limit reached. Using fallback data. Please wait before making more requests."
      );
    }

    throw error;
  }
};
