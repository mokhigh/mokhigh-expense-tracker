import { createTheme } from '@mui/material/styles';

export function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#ffffff' : '#000000' },
      secondary: { main: mode === 'dark' ? '#cccccc' : '#333333' },
      ...(mode === 'dark'
        ? {
            background: { default: '#000000', paper: '#111111' },
            text: { primary: '#ffffff', secondary: '#aaaaaa' },
          }
        : {
            background: { default: '#ffffff', paper: '#ffffff' },
            text: { primary: '#000000', secondary: '#444444' },
          }),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: { fontSize: '1.75rem', fontWeight: 700 },
      h2: { fontSize: '1.375rem', fontWeight: 700 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { minHeight: 44, textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', fullWidth: true },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            WebkitTapHighlightColor: 'transparent',
          },
        },
      },
    },
  });
}
