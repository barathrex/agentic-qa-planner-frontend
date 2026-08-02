import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { developerName, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (location.pathname === '/login') return null;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#1E293B',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0.5 }}>
          {/* Logo & App Name */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: '#1E293B',
                letterSpacing: '-0.01em',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                whiteSpace: 'nowrap',
              }}
            >
              Agentic QA Assistant
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          {developerName && (
            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/')}
                sx={{ color: location.pathname === '/' ? '#2563EB' : '#64748B' }}
              >
                Dashboard
              </Button>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ backgroundColor: '#F1F5F9', px: 1.5, py: 0.5, borderRadius: 3 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#2563EB', fontSize: '0.85rem' }}>
                  {developerName.charAt(0)}
                </Avatar>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Welcome, {developerName}
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            </Stack>
          )}

          {/* Mobile Hamburger Menu Icon */}
          {developerName && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Mobile Navigation Drawer — rendered outside AppBar stacking context */}
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: {
                width: 280,
                p: 0,
                borderRadius: '12px 0 0 12px',
              },
            }}
          >
            {/* Drawer Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 44, height: 44, bgcolor: 'rgba(255,255,255,0.25)', fontWeight: 700, fontSize: '1.1rem' }}>
                  {developerName?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="#fff">
                    {developerName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                    Logged In Developer
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setMobileOpen(false)} sx={{ color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            <List sx={{ px: 1.5, pt: 1.5 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate('/');
                    setMobileOpen(false);
                  }}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DashboardIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mt: 1 }}>
                <ListItemButton
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/login');
                  }}
                  sx={{ borderRadius: 2, color: 'error.main' }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
