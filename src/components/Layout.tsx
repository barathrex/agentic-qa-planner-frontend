import { ReactNode } from 'react';
import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <AssignmentIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Agentic QA Planning Assistant
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ opacity: location.pathname === '/' ? 1 : 0.8 }}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary', fontSize: 13 }}>
        Proposed QA plans only — final approval belongs to the developer.
      </Box>
    </Box>
  );
}
