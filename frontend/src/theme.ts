import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#000666"
    },
    secondary: {
      main: "#964900"
    },
    background: {
      default: "#f1f4f9",
      paper: "#ffffff"
    }
  },
  shape: {
    borderRadius: 10
  },
  typography: {
    fontFamily: "'IBM Plex Sans Arabic', 'Manrope', sans-serif",
    h3: {
      fontFamily: "'Manrope', 'IBM Plex Sans Arabic', sans-serif",
      fontWeight: 700
    },
    h5: {
      fontFamily: "'Manrope', 'IBM Plex Sans Arabic', sans-serif",
      fontWeight: 700
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 8px 32px rgba(0, 6, 102, 0.06)",
          border: "none"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600
        }
      }
    }
  }
});
