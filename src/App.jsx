import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Dashboard from "./components/Dashboard";
import "./App.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#00d084",
    },
    background: {
      default: "#fafbfc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e1e1e",
      secondary: "#666666",
    },
    success: {
      main: "#00d084",
    },
    error: {
      main: "#ff4747",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    body1: {
      fontSize: "0.875rem",
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    caption: {
      fontSize: "0.7rem",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #e6e6e6",
          borderRadius: "8px",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #e6e6e6",
          borderRadius: "12px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: 500,
          padding: "6px 12px",
        },
        outlined: {
          borderColor: "#e6e6e6",
          color: "#666666",
          "&:hover": {
            borderColor: "#d0d0d0",
            backgroundColor: "#f8f9fa",
          },
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e6e6e6",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d0d0d0",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
