import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Dashboard.css";
import MatrixRain from "./MatrixRain";

import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LanguageIcon from "@mui/icons-material/Language";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

import bitcoinBytesLogo from "../assets/bitcoin-bytes-logo.png";

import {
  generatePriceData,
  generateVolumeData,
  generateMarketCapData,
  getCurrentStats,
} from "../utils/bitcoinData";
import { fetchBitcoinData } from "../utils/coinGeckoApi";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [currency, setCurrency] = useState("CAD");
  const [timeframe, setTimeframe] = useState("1D");
  const [chartType, setChartType] = useState("price");
  const [chartStyle, setChartStyle] = useState("area");
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const realStats = await fetchBitcoinData(currency);
        setStats(realStats);
        setUsingFallbackData(false);
      } catch (error) {
        console.error(
          "Failed to fetch real Bitcoin data, using fallback:",
          error
        );
        setStats(getCurrentStats(currency));
        setUsingFallbackData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();

    const interval = setInterval(fetchRealData, 300000);

    return () => clearInterval(interval);
  }, [currency]);

  useEffect(() => {
    const days =
      {
        "1H": 1,
        "1D": 1,
        "7D": 7,
        "1M": 30,
        "1Y": 365,
        ALL: 365 * 3,
      }[timeframe] || 7;

    if (chartType === "price") {
      setChartData(
        generatePriceData(days, currency, timeframe, stats.currentPrice)
      );
    } else if (chartType === "volume") {
      setChartData(generateVolumeData(currency, i18n.language, timeframe));
    } else {
      setChartData(generateMarketCapData(currency, i18n.language, timeframe));
    }
  }, [timeframe, chartType, i18n.language, stats.currentPrice]);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const formatCurrency = (value, curr = currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatBillion = (value, curr = currency) => {
    if (value >= 1000) {
      const trillions = Math.floor(value / 1000);
      return `${formatCurrency(trillions, curr)}T`;
    }
    return `${formatCurrency(value, curr)}B`;
  };

  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    return {
      value: `${isPositive ? "+" : ""}${value.toFixed(2)}%`,
      color: isPositive ? "#00d084" : "#ff4747",
      isPositive,
    };
  };

  const timeframes = [
    { key: "1H", label: t("timeframes.1H") },
    { key: "1D", label: t("timeframes.1D") },
    { key: "7D", label: t("timeframes.7D") },
    { key: "1M", label: t("timeframes.1M") },
    { key: "1Y", label: t("timeframes.1Y") },
    { key: "ALL", label: t("timeframes.ALL") },
  ];

  const chartTypes = [
    { key: "price", label: t("currentPrice"), icon: <ShowChartIcon /> },
    { key: "volume", label: t("chartTypes.volume"), icon: <BarChartIcon /> },
    {
      key: "marketCap",
      label: t("chartTypes.marketCap"),
      icon: <ShowChartIcon />,
    },
  ];

  const renderChart = () => {
    const dataKey =
      chartType === "price"
        ? "price"
        : chartType === "volume"
        ? "volume"
        : "marketCap";

    const color =
      chartType === "price"
        ? "#00d084"
        : chartType === "volume"
        ? "#3861fb"
        : "#ffa726";

    if (chartStyle === "area") {
      return (
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={chartType === "price" ? "formattedDate" : "day"}
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            interval={timeframe === "1M" ? 4 : "preserveStartEnd"}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              chartType === "price"
                ? formatCurrency(value)
                : formatBillion(value)
            }
          />
          <RechartsTooltip
            formatter={(value) => [
              chartType === "price"
                ? formatCurrency(value)
                : formatBillion(value),
              chartTypes.find((ct) => ct.key === chartType)?.label,
            ]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              color: "#ffffff",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      );
    } else {
      return (
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={chartType === "price" ? "formattedDate" : "day"}
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            interval={timeframe === "1M" ? 4 : "preserveStartEnd"}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#666" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              chartType === "price"
                ? formatCurrency(value)
                : formatBillion(value)
            }
          />
          <RechartsTooltip
            formatter={(value) => [
              chartType === "price"
                ? formatCurrency(value)
                : formatBillion(value),
              chartTypes.find((ct) => ct.key === chartType)?.label,
            ]}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(10px)",
              color: "#ffffff",
            }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      );
    }
  };

  const priceChange = formatPercentage(stats.change24h || 0);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <MatrixRain />
      <Container maxWidth={false} sx={{ py: 2, px: 2, minHeight: "100vh" }}>
        <Box className="dashboard-disclaimer">
          <Typography className="dashboard-disclaimer-text">
            {t("disclaimer.aiGenerated")}
          </Typography>
        </Box>

        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1000 }}>
          <Tooltip title={t("settings")}>
            <IconButton onClick={handleSettingsOpen} size="large">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Modal
          open={settingsOpen}
          onClose={handleSettingsClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={settingsOpen}>
            <Box sx={modalStyle} className="dashboard-modal">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" component="h2">
                  {t("settings")}
                </Typography>
                <IconButton onClick={handleSettingsClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>{t("language")}</InputLabel>
                  <Select
                    value={i18n.language}
                    label={t("language")}
                    onChange={handleLanguageChange}
                    startAdornment={
                      <LanguageIcon sx={{ mr: 1, color: "text.secondary" }} />
                    }
                  >
                    <MenuItem value="en">{t("languages.en")}</MenuItem>
                    <MenuItem value="fr">{t("languages.fr")}</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>{t("currency")}</InputLabel>
                  <Select
                    value={currency}
                    onChange={handleCurrencyChange}
                    label={t("currency")}
                    startAdornment={
                      <AttachMoneyIcon
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                    }
                  >
                    <MenuItem value="CAD">{t("currencies.cad")}</MenuItem>
                    <MenuItem value="USD">{t("currencies.usd")}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          </Fade>
        </Modal>

        <Box className="dashboard-header">
          <Box className="dashboard-logo-section">
            <Box className="dashboard-title-container">
              <img
                src={bitcoinBytesLogo}
                alt="Bitcoin Bytes Logo"
                className="dashboard-logo"
              />
              <Typography
                variant="h4"
                component="h1"
                className="dashboard-title"
              >
                Bitcoin Bytes
              </Typography>
            </Box>
            <Box className="dashboard-price-section">
              <Typography
                variant="h5"
                className={`dashboard-price ${loading ? "loading" : ""}`}
              >
                {loading
                  ? t("loading") || "Loading..."
                  : formatCurrency(stats.currentPrice)}
              </Typography>
              {!loading && (
                <Chip
                  label={priceChange.value}
                  className="dashboard-price-chip"
                  sx={{
                    backgroundColor: priceChange.isPositive
                      ? "#e8f5e8"
                      : "#ffebee",
                    color: priceChange.color,
                  }}
                  icon={
                    priceChange.isPositive ? (
                      <TrendingUpIcon sx={{ color: priceChange.color }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: priceChange.color }} />
                    )
                  }
                />
              )}
            </Box>
            {!loading && stats.lastUpdated && (
              <Box className="dashboard-last-updated">
                <Typography variant="caption" color="text.secondary">
                  {t("lastUpdated")}:{" "}
                  {new Date(stats.lastUpdated).toLocaleTimeString()}
                </Typography>
                {usingFallbackData && (
                  <Chip
                    label="Simulated Data"
                    size="small"
                    sx={{
                      fontSize: "0.65rem",
                      height: "20px",
                      backgroundColor: "#fff3cd",
                      color: "#856404",
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          <Grid container spacing={2} className="dashboard-stats-grid">
            <Grid item xs={6} sm={3}>
              <Card className="dashboard-stat-card">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("marketCap")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatBillion(stats.marketCap)}
                </Typography>
                <Typography variant="caption" color="success.main">
                  +2.34%
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card className="dashboard-stat-card">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("volume24h")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatBillion(stats.volume24h)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vol / MCap: 0.04
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card className="dashboard-stat-card">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("circulatingSupply")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  19.89M BTC
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  94.7%
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card className="dashboard-stat-card">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("maxSupply")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  21M BTC
                </Typography>
                <Typography variant="caption" color="warning.main">
                  --
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Paper className="dashboard-chart-container">
          <Box className="dashboard-chart-controls">
            <Box className="dashboard-chart-type-buttons">
              <ButtonGroup variant="text" size="small">
                {chartTypes.map((type) => (
                  <Button
                    key={type.key}
                    onClick={() => setChartType(type.key)}
                    className={
                      chartType === type.key
                        ? `dashboard-active-button ${type.key}-button`
                        : "dashboard-inactive-button"
                    }
                    sx={{
                      px: 2,
                      py: 1,
                      minWidth: "auto",
                    }}
                    startIcon={type.icon}
                  >
                    {type.label}
                  </Button>
                ))}
              </ButtonGroup>

              <ButtonGroup size="small" variant="outlined">
                <Button
                  variant={chartStyle === "area" ? "contained" : "outlined"}
                  onClick={() => setChartStyle("area")}
                  size="small"
                >
                  <ShowChartIcon fontSize="small" />
                </Button>
                <Button
                  variant={chartStyle === "bar" ? "contained" : "outlined"}
                  onClick={() => setChartStyle("bar")}
                  size="small"
                >
                  <BarChartIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>

            <Box className="dashboard-timeframe-buttons">
              <ButtonGroup variant="text" size="small">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.key}
                    onClick={() => setTimeframe(tf.key)}
                    className={
                      timeframe === tf.key
                        ? "dashboard-active-button timeframe-button"
                        : "dashboard-inactive-button"
                    }
                    sx={{
                      minWidth: 45,
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    {tf.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Box>

          <Box className="dashboard-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Footer */}
        <Box className="dashboard-footer">
          <Typography className="dashboard-footer-text">
            Created by Kyle Khai Tran 2025
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
