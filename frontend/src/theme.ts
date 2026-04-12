import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#123b5d",
      light: "#2a6f9b",
      dark: "#0b2439",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#cc7a24",
      light: "#e39b44",
      dark: "#9f5712",
      contrastText: "#1f1102"
    },
    success: {
      main: "#1f8a4c"
    },
    error: {
      main: "#c0342b"
    },
    background: {
      default: "#f4f3ef",
      paper: "#ffffff"
    },
    text: {
      primary: "#102234",
      secondary: "#5f6b76"
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: "'Cairo', 'IBM Plex Sans Arabic', 'Manrope', sans-serif",
    h1: {
      fontFamily: "'Cairo', 'Manrope', sans-serif",
      fontWeight: 800
    },
    h2: {
      fontFamily: "'Cairo', 'Manrope', sans-serif",
      fontWeight: 800
    },
    h3: {
      fontFamily: "'Cairo', 'Manrope', sans-serif",
      fontWeight: 800
    },
    h4: {
      fontFamily: "'Cairo', 'Manrope', sans-serif",
      fontWeight: 800
    },
    h5: {
      fontFamily: "'Cairo', 'Manrope', sans-serif",
      fontWeight: 800
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#bac6d1 transparent"
        },
        "*::-webkit-scrollbar": {
          width: "10px",
          height: "10px"
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#bac6d1",
          borderRadius: "999px"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 16px 40px rgba(16, 34, 52, 0.08)",
          border: "1px solid #e5e7eb",
          backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fdfcf9 100%)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 700,
          paddingInline: 14,
          boxShadow: "none"
        },
        outlined: {
          borderWidth: 1.5
        }
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundImage: "linear-gradient(135deg, #123b5d 0%, #1d5d8f 100%)",
            color: "#ffffff"
          }
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            backgroundImage: "linear-gradient(135deg, #cc7a24 0%, #e39b44 100%)"
          }
        }
      ]
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none"
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f2f4f6"
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #edf0f3",
          color: "#243746",
          paddingTop: 12,
          paddingBottom: 12
        },
        head: {
          color: "#5f6b76",
          fontWeight: 800,
          fontSize: 13
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 120ms ease"
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 800,
          color: "#123b5d"
        }
      }
    }
  }
});
