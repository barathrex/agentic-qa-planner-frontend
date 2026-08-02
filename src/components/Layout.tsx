import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, textAlign: 'center', color: '#64748B', fontSize: 13, borderTop: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        Agentic QA Planning Assistant — Proposed QA plans only. Final release approval always belongs to the developer.
      </Box>
    </Box>
  );
}
