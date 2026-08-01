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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Generate QA Plan
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enter your feature details to receive a proposed QA plan for developer review.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This tool proposes test cases only. It never determines pass/fail status or release readiness.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
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
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Acceptance Criteria
              </Typography>
              <Stack spacing={1.5}>
                {fields.map((field, index) => (
                  <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
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
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => append({ value: '' })} size="small">
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
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate QA Plan'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
