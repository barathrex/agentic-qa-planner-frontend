import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../context/AuthContext';
import { qaApi } from '../api/qaApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [developerName, setDeveloperName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerName || !password) {
      setError('Please enter developer name and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await qaApi.login(developerName.trim(), password);
      login(response.developerName, response.token);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid developer credentials';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const setQuickDev = (name: string) => {
    setDeveloperName(name);
    setPassword('Test@123');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}
            >
              <AutoAwesomeIcon fontSize="large" />
            </Box>

            <Box textAlign="center">
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Agentic QA Planning Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enterprise QA Automation Platform
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack spacing={2.5}>
                <TextField
                  label="Developer Name"
                  fullWidth
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  placeholder="e.g. Barath or Rishabh"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Workspace'}
                </Button>
              </Stack>
            </form>

            <Box sx={{ width: '100%', pt: 1, borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Quick Developer Credentials:
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip
                  label="Barath (Test@123)"
                  onClick={() => setQuickDev('Barath')}
                  size="small"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="Rishabh (Test@123)"
                  onClick={() => setQuickDev('Rishabh')}
                  size="small"
                  variant="outlined"
                  clickable
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
