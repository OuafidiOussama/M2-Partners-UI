import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3F51B5',
      light: '#5C6BC0',
      dark: '#303F9F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00BCD4',
      light: '#26C6DA',
      dark: '#0097A7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F3F4F6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        },
      },
    },
    // AppBar is always white with a bottom border in this app
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          color: 'rgba(0,0,0,0.87)',
        },
      },
    },
    // DataGrid pages all share the same surface styling
    MuiDataGrid: {
      defaultProps: {
        pageSizeOptions: [10, 25, 50],
        disableRowSelectionOnClick: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;

