const EXCHANGE_RATES = {
  USD: 1,
  CAD: 1.41,
};

const HISTORICAL_DATA = {
  2014: { price: 378.64, volume: 0.1, marketCap: 5.1 },
  2015: { price: 430.89, volume: 0.15, marketCap: 6.2 },
  2016: { price: 998.33, volume: 0.5, marketCap: 16.1 },
  2017: { price: 4000, volume: 1.5, marketCap: 67.2 },
  2018: { price: 6500, volume: 5, marketCap: 115.1 },
  2019: { price: 7200, volume: 8, marketCap: 129.4 },
  2020: { price: 28990, volume: 15, marketCap: 540.2 },
  2021: { price: 46000, volume: 40, marketCap: 870.4 },
  2022: { price: 43700, volume: 35, marketCap: 832.9 },
  2023: { price: 42260, volume: 30, marketCap: 827.9 },
  2024: { price: 95000, volume: 45, marketCap: 1888 },
  2025: { price: 120000, volume: 60, marketCap: 2390 },
};

const interpolate = (a, b, factor) => {
  return a + (b - a) * factor;
};

const getHistoricalValue = (date, dataType, currency = "USD") => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let baseValue;
  if (HISTORICAL_DATA[year]) {
    baseValue = HISTORICAL_DATA[year][dataType];
  } else {
    const years = Object.keys(HISTORICAL_DATA)
      .map(Number)
      .sort((a, b) => a - b);

    let lowerYear = years[0];
    let upperYear = years[years.length - 1];

    for (let i = 0; i < years.length - 1; i++) {
      if (year >= years[i] && year <= years[i + 1]) {
        lowerYear = years[i];
        upperYear = years[i + 1];
        break;
      }
    }

    if (year < years[0]) {
      lowerYear = years[0];
      upperYear = years[1];
    } else if (year > years[years.length - 1]) {
      lowerYear = years[years.length - 2];
      upperYear = years[years.length - 1];
    }

    const factor = (year - lowerYear) / (upperYear - lowerYear);
    baseValue = interpolate(
      HISTORICAL_DATA[lowerYear][dataType],
      HISTORICAL_DATA[upperYear][dataType],
      factor
    );
  }

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  const yearProgress = (date - yearStart) / (yearEnd - yearStart);

  const nextYear = year + 1;
  let nextYearValue = HISTORICAL_DATA[nextYear]?.[dataType];

  if (!nextYearValue) {
    const years = Object.keys(HISTORICAL_DATA)
      .map(Number)
      .sort((a, b) => a - b);
    const currentIndex = years.indexOf(year);
    if (currentIndex >= 0 && currentIndex < years.length - 1) {
      nextYearValue = HISTORICAL_DATA[years[currentIndex + 1]][dataType];
    } else {
      nextYearValue = baseValue;
    }
  }

  const interpolatedValue = interpolate(baseValue, nextYearValue, yearProgress);

  let value = interpolatedValue;

  let volatility;
  if ([2017, 2021, 2024].includes(year)) {
    volatility = 0.15;
  } else if ([2018, 2022].includes(year)) {
    volatility = 0.12;
  } else {
    volatility = 0.08;
  }

  if (dataType === "volume") {
    volatility = 0.3;
  } else if (dataType === "marketCap") {
    volatility = 0.1;
  }

  const randomFactor = 1 + (Math.random() - 0.5) * volatility;
  value *= randomFactor;

  if (currency === "CAD") {
    value *= EXCHANGE_RATES.CAD;
  }

  return Math.max(value, 0.01);
};

export const generatePriceData = (
  days,
  currency = "USD",
  timeframe = "7D",
  currentPrice = null
) => {
  let dataPoints;
  let intervalMs;

  switch (timeframe) {
    case "1H":
      dataPoints = 60;
      intervalMs = 1 * 60 * 1000;
      break;

    case "1D":
      dataPoints = 24;
      intervalMs = 1 * 60 * 60 * 1000;
      break;

    case "7D":
      dataPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000;
      break;

    case "1M":
      dataPoints = 30;
      intervalMs = 24 * 60 * 60 * 1000;
      break;

    case "1Y":
      dataPoints = 12;
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      break;

    case "ALL":
      dataPoints = 12;
      intervalMs = 365 * 24 * 60 * 60 * 1000;
      break;

    default:
      dataPoints = 30;
      intervalMs = 24 * 60 * 60 * 1000;
  }

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - dataPoints * intervalMs);
  const data = [];

  for (let i = 0; i < dataPoints; i++) {
    const currentTime = new Date(startTime.getTime() + i * intervalMs);
    let price = getHistoricalValue(currentTime, "price", currency);

    if (i === dataPoints - 1 && currentPrice) {
      price = currentPrice;
    }

    const formattedDate =
      timeframe === "ALL"
        ? currentTime.getFullYear().toString()
        : timeframe === "1Y"
        ? currentTime.toLocaleDateString("en-US", { month: "short" })
        : timeframe === "1M" || timeframe === "7D"
        ? currentTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

    data.push({ date: currentTime, price, formattedDate });
  }

  return data;
};

export const generateVolumeData = (
  currency = "USD",
  language = "en",
  timeframe = "7D"
) => {
  let dataPoints;
  let intervalMs;

  switch (timeframe) {
    case "1H":
      dataPoints = 60;
      intervalMs = 1 * 60 * 1000;
      break;

    case "1D":
      dataPoints = 24;
      intervalMs = 1 * 60 * 60 * 1000;
      break;

    case "7D":
      dataPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000;
      break;

    case "1M":
      dataPoints = 30;
      intervalMs = 24 * 60 * 60 * 1000;
      break;

    case "1Y":
      dataPoints = 12;
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      break;

    case "ALL":
      dataPoints = 12;
      intervalMs = 365 * 24 * 60 * 60 * 1000;
      break;

    default:
      dataPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000;
  }

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - dataPoints * intervalMs);
  const data = [];

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startTime.getTime() + i * intervalMs);
    let volume = getHistoricalValue(date, "volume", currency);

    if (timeframe === "1H" || timeframe === "1D") {
      const weekendFactor =
        date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
      const hourlyFactor =
        Math.sin(((date.getHours() - 6) * Math.PI) / 12) * 0.3 + 0.7;
      volume *= weekendFactor * hourlyFactor;
    }

    const day =
      timeframe === "ALL"
        ? date.getFullYear().toString()
        : timeframe === "1Y"
        ? date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
            month: "short",
          })
        : timeframe === "1H" || timeframe === "1D"
        ? date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
            month: "short",
            day: "numeric",
          });

    data.push({ day, volume });
  }

  return data;
};

export const generateMarketCapData = (
  currency = "USD",
  language = "en",
  timeframe = "7D"
) => {
  let dataPoints;
  let intervalMs;

  switch (timeframe) {
    case "1H":
      dataPoints = 60;
      intervalMs = 1 * 60 * 1000;
      break;

    case "1D":
      dataPoints = 24;
      intervalMs = 1 * 60 * 60 * 1000;
      break;

    case "7D":
      dataPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000;
      break;

    case "1M":
      dataPoints = 30;
      intervalMs = 24 * 60 * 60 * 1000;
      break;

    case "1Y":
      dataPoints = 12;
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      break;

    case "ALL":
      dataPoints = 12;
      intervalMs = 365 * 24 * 60 * 60 * 1000;
      break;

    default:
      dataPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000;
  }

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - dataPoints * intervalMs);
  const data = [];

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startTime.getTime() + i * intervalMs);
    const marketCap = getHistoricalValue(date, "marketCap", currency);

    const day =
      timeframe === "ALL"
        ? date.getFullYear().toString()
        : timeframe === "1Y"
        ? date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
            month: "short",
          })
        : timeframe === "1H" || timeframe === "1D"
        ? date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
            month: "short",
            day: "numeric",
          });

    data.push({ day, marketCap });
  }

  return data;
};

export const getCurrentStats = (currency = "USD") => {
  const now = new Date();
  let currentPrice = getHistoricalValue(now, "price", currency);
  let marketCap = getHistoricalValue(now, "marketCap", currency);
  let volume24h = getHistoricalValue(now, "volume", currency);

  if (currency === "CAD") {
    currentPrice = convertPrice(currentPrice, "USD", "CAD");
    marketCap = convertPrice(marketCap, "USD", "CAD");
    volume24h = convertPrice(volume24h, "USD", "CAD");
  }

  const priceVariation = (Math.random() - 0.5) * 0.02;
  const change24h = (Math.random() - 0.3) * 8;

  return {
    currentPrice: Math.round(currentPrice * (1 + priceVariation)),
    change24h: change24h,
    marketCap: Math.round(marketCap),
    volume24h: Math.round(volume24h),
    lastUpdated: now.toISOString(),
  };
};

export const convertPrice = (value, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return value;

  const usdValue = value / EXCHANGE_RATES[fromCurrency];
  return usdValue * EXCHANGE_RATES[toCurrency];
};
