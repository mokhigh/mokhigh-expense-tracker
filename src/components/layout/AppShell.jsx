import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  { to: '/add', label: 'Add', icon: <AddIcon /> },
  { to: '/expenses', label: 'Expenses', icon: <ListIcon /> },
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

const SIDEBAR_WIDTH = 240;

export default function AppShell() {
  useSync();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mode, toggleMode } = useThemeMode();
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
            <Typography variant="h2" sx={{ fontSize: '1.125rem' }}>
              Expenses
            </Typography>
          </Toolbar>
          <List>
            {NAV.map((item) => (
              <ListItemButton
                key={item.to}
                selected={currentValue === item.to}
                onClick={() => navigate(item.to)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ p: 1.5 }}>
            <IconButton onClick={toggleMode} size="small">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h2" sx={{ fontSize: '1.125rem', flexGrow: 1 }}>
            Expenses
          </Typography>
          <IconButton onClick={toggleMode} size="small" edge="end">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2, pb: 'calc(72px + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </Box>
      <BottomNavigation
        value={currentValue}
        onChange={(_, value) => navigate(value)}
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: 1,
          borderColor: 'divider',
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: 'calc(56px + env(safe-area-inset-bottom))',
        }}
      >
        {NAV.map((item) => (
          <BottomNavigationAction
            key={item.to}
            label={item.label}
            value={item.to}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
