import React from 'react';
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
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { developerName, logout } = useAuth();

  if (location.pathname === '/login') return null;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#1E293B',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box
              sx={{
                width: 38,
                height: 38,
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
            <Typography variant="h6" fontWeight={700} sx={{ color: '#1E293B', letterSpacing: '-0.01em' }}>
              Agentic QA Planning Assistant
            </Typography>
          </Stack>

          {developerName && (
            <Stack direction="row" spacing={3} alignItems="center">
              <Button
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/')}
                sx={{ color: location.pathname === '/' ? '#2563EB' : '#64748B' }}
              >
                Dashboard
              </Button>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ bg: '#F1F5F9', px: 1.5, py: 0.5, borderRadius: 3 }}>
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
