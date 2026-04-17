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
      MuiDialog: {
        styleOverrides: {
          container: ({ theme }) => ({
            [theme.breakpoints.down('sm')]: {
              alignItems: 'flex-end',
            },
          }),
          paper: ({ theme }) => ({
            borderRadius: 20,
            backgroundImage: 'none',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 -2px 32px rgba(255,255,255,0.06)'
                : '0 -2px 32px rgba(0,0,0,0.10)',
            [theme.breakpoints.down('sm')]: {
              margin: 0,
              width: '100%',
              maxWidth: '100% !important',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              '&::before': {
                content: '""',
                display: 'block',
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.divider,
                margin: '12px auto 0',
              },
            },
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: '1.125rem',
            fontWeight: 700,
            padding: '20px 24px 8px',
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: '8px 24px 16px',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '12px 24px 20px',
            gap: 8,
            [theme.breakpoints.down('sm')]: {
              paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
            },
          }),
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
          body { -webkit-tap-highlight-color: transparent; }
          ::view-transition-old(root), ::view-transition-new(root) {
            animation-duration: 0.35s;
            animation-timing-function: ease-in-out;
          }
        `,
      },
    },
  });
}
