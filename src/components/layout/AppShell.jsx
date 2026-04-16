import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  ButtonBase,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import ListIcon from '@mui/icons-material/FormatListBulleted';
import DashboardIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useSync } from '../../hooks/useSync.js';
import useThemeMode from '../../store/useThemeMode.js';

const NAV = [
  { to: '/add', label: 'Add', Icon: AddIcon },
  { to: '/expenses', label: 'Expenses', Icon: ListIcon },
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

const SIDEBAR_WIDTH = 240;

export default function AppShell() {
  useSync();

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { toggleMode } = useThemeMode();
  const location = useLocation();
  const navigate = useNavigate();
  const currentValue =
    NAV.find((n) => location.pathname.startsWith(n.to))?.to ?? '/add';

  if (isDesktop) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Toolbar>
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              Expenses
            </Typography>
          </Toolbar>
          <List>
            {NAV.map(({ to, label, Icon }) => (
              <ListItemButton
                key={to}
                selected={currentValue === to}
                onClick={() => navigate(to)}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ p: 1.5 }}>
            <IconButton onClick={toggleMode} size="small">
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '52px !important', px: 2 }}>
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'text.secondary',
            }}
          >
            Expenses
          </Typography>
          <IconButton
            onClick={toggleMode}
            size="small"
            edge="end"
            sx={{
              width: 36,
              height: 36,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '50%',
            }}
          >
            {isDark
              ? <LightModeIcon sx={{ fontSize: 16 }} />
              : <DarkModeIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2, pb: 'calc(80px + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </Box>

      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          pb: 'env(safe-area-inset-bottom)',
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Box sx={{ display: 'flex', height: 68 }}>
          {NAV.map(({ to, label, Icon }) => {
            const active = currentValue === to;
            return (
              <ButtonBase
                key={to}
                onClick={() => navigate(to)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 0.75,
                    borderRadius: '14px',
                    bgcolor: active
                      ? isDark
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.07)'
                      : 'transparent',
                    color: active ? 'text.primary' : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: active ? 'text.primary' : 'text.secondary',
                    lineHeight: 1,
                  }}
                >
                  {label}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
