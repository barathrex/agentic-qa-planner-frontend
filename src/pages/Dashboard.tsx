import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  Backdrop,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsycholinkIcon from '@mui/icons-material/Psychology';
import { toast } from 'react-toastify';
import { qaApi } from '../api/qaApi';

interface FormValues {
  requirement: string;
  implementationSummary: string;
  acceptanceCriteria: { value: string }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      requirement: '',
      implementationSummary: '',
      acceptanceCriteria: [{ value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'acceptanceCriteria' });

  const onSubmit = async (data: FormValues) => {
    const criteria = data.acceptanceCriteria.map((c) => c.value.trim()).filter(Boolean);
    if (criteria.length === 0) {
      toast.error('Add at least one acceptance criterion');
      return;
    }

    setLoading(true);
    try {
      const plan = await qaApi.generate({
        requirement: data.requirement,
        acceptanceCriteria: criteria,
        implementationSummary: data.implementationSummary,
      });
      toast.success('QA plan generated successfully');
      navigate(`/plan/${plan.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate QA plan';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 2 }}>
      {/* Animated Loading Backdrop */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
        }}
        open={loading}
      >
        <Stack spacing={3} alignItems="center">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={80} thickness={4} sx={{ color: '#818cf8' }} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PsycholinkIcon sx={{ fontSize: 36, color: '#ec4899' }} />
            </Box>
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ background: 'linear-gradient(90deg, #818cf8, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Generating Intelligent QA Plan...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyzing requirements • Matching knowledge base • Structuring test scenarios
          </Typography>
        </Stack>
      </Backdrop>

      {/* Header Banner */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: '16px !important', color: '#ec4899 !important' }} />}
          label="AI-Powered QA Assistant"
          size="small"
          sx={{ mb: 2, background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#f472b6', fontWeight: 600 }}
        />
        <Typography
          variant="h3"
          fontWeight={800}
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
          }}
        >
          Generate Proposed QA Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Describe your feature specifications below to receive an automated, structured proposed QA test plan for developer review.
        </Typography>
      </Box>

      <Alert
        severity="info"
        sx={{
          mb: 4,
          borderRadius: 3,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          color: '#cbd5e1',
          '& .MuiAlert-icon': { color: '#818cf8' },
        }}
      >
        <strong>Developer Notice:</strong> This assistant proposes test scenarios only. It never certifies release readiness or determines final pass/fail status.
      </Alert>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3.5}>
            <TextField
              label="Requirement / User Story"
              multiline
              rows={4}
              fullWidth
              placeholder="As a customer, I want to reset my password, so that I can log in again."
              {...register('requirement', { required: 'Requirement is required' })}
              error={!!errors.requirement}
              helperText={errors.requirement?.message}
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight={600} sx={{ color: '#f8fafc' }}>
                Acceptance Criteria
              </Typography>
              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Stack key={field.id} direction="row" spacing={1.5} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Acceptance criterion ${index + 1}`}
                      {...register(`acceptanceCriteria.${index}.value` as const, {
                        required: index === 0 ? 'At least one criterion is required' : false,
                      })}
                    />
                    <IconButton
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      color="error"
                      size="small"
                      sx={{ background: 'rgba(239, 68, 68, 0.1)' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => append({ value: '' })}
                  size="small"
                  sx={{ alignSelf: 'flex-start', color: '#818cf8' }}
                >
                  Add Criterion
                </Button>
              </Stack>
            </Box>

            <TextField
              label="Implementation Summary"
              multiline
              rows={4}
              fullWidth
              placeholder="Added Forgot Password API, Email Service, JWT expiry validation..."
              {...register('implementationSummary', { required: 'Implementation summary is required' })}
              error={!!errors.implementationSummary}
              helperText={errors.implementationSummary?.message}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              disabled={loading}
              sx={{
                py: 1.8,
                fontSize: '1.05rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8 0%, #f472b6 100%)',
                  boxShadow: '0 10px 30px rgba(236, 72, 153, 0.5)',
                },
              }}
            >
              Generate Proposed QA Plan
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
