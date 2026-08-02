import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  Backdrop,
  Tabs,
  Tab,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { toast } from 'react-toastify';
import { qaApi } from '../api/qaApi';
import { useAuth } from '../context/AuthContext';
import type { QaPlan } from '../types/qa';

interface FormValues {
  title: string;
  description: string;
  requirement: string;
  implementationSummary: string;
  acceptanceCriteria: { value: string }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { developerName } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<QaPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [plansLoading, setPlansLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      requirement: '',
      implementationSummary: '',
      acceptanceCriteria: [{ value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'acceptanceCriteria' });

  const fetchPlans = async (search?: string) => {
    setPlansLoading(true);
    try {
      const data = await qaApi.getPlans(search);
      setPlans(data);
    } catch {
      toast.error('Failed to load QA plans');
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (tabIndex === 1) {
      fetchPlans(searchQuery);
    }
  }, [tabIndex, searchQuery]);

  const onSubmit = async (data: FormValues) => {
    const criteria = data.acceptanceCriteria.map((c) => c.value.trim()).filter(Boolean);
    if (criteria.length === 0) {
      toast.error('Add at least one acceptance criterion');
      return;
    }

    setLoading(true);
    try {
      const plan = await qaApi.generate({
        title: data.title,
        description: data.description,
        requirement: data.requirement,
        acceptanceCriteria: criteria,
        implementationSummary: data.implementationSummary,
      });
      toast.success('QA plan generated and saved successfully');
      reset();
      navigate(`/plan/${plan.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate QA plan';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title?: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this QA plan'}"?`)) return;
    try {
      await qaApi.deletePlan(id);
      toast.success('QA plan deleted');
      fetchPlans(searchQuery);
    } catch {
      toast.error('Failed to delete QA plan');
    }
  };

  const handleDownloadPdf = async (id: number) => {
    try {
      toast.info('Generating PDF document...');
      await qaApi.downloadPdf(id);
      toast.success('PDF download started');
    } catch {
      toast.error('Failed to download PDF');
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(15, 23, 42, 0.75)' }}
        open={loading}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} thickness={4} sx={{ color: '#2563EB' }} />
          <Typography variant="h6" fontWeight={600}>
            Generating Enterprise QA Plan...
          </Typography>
        </Stack>
      </Backdrop>

      {/* Header Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} sx={{ '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem', py: 2 } }}>
          <Tab icon={<PostAddIcon />} iconPosition="start" label="Generate New QA Plan" />
          <Tab icon={<FolderCopyIcon />} iconPosition="start" label={`Saved QA Plans (${developerName || 'Mine'})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Generate New QA Plan */}
      {tabIndex === 0 && (
        <Box maxWidth={900} mx="auto">
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            <strong>Enterprise Standard:</strong> This platform generates proposed test cases for developer review only. Final approval always belongs to the developer.
          </Alert>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    label="Plan Title (Mandatory)"
                    fullWidth
                    required
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />

                  <TextField
                    label="Description"
                    multiline
                    rows={2}
                    fullWidth
                    {...register('description')}
                  />

                  <TextField
                    label="Requirement / User Story"
                    multiline
                    rows={3}
                    fullWidth
                    required
                    {...register('requirement', { required: 'Requirement is required' })}
                    error={!!errors.requirement}
                    helperText={errors.requirement?.message}
                  />

                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: '#1E293B' }}>
                      Acceptance Criteria
                    </Typography>
                    <Stack spacing={1.5}>
                      {fields.map((field, index) => (
                        <Stack key={field.id} direction="row" spacing={1} alignItems="center">
                          <TextField
                            fullWidth
                            size="small"
                            label={`AC ${index + 1}`}
                            {...register(`acceptanceCriteria.${index}.value` as const, {
                              required: index === 0 ? 'At least one criterion is required' : false,
                            })}
                          />
                          <IconButton onClick={() => remove(index)} disabled={fields.length <= 1} color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button startIcon={<AddIcon />} onClick={() => append({ value: '' })} size="small" sx={{ alignSelf: 'flex-start' }}>
                        Add Criterion
                      </Button>
                    </Stack>
                  </Box>

                  <TextField
                    label="Implementation Summary"
                    multiline
                    rows={3}
                    fullWidth
                    required
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
                    sx={{ py: 1.5, fontSize: '1rem' }}
                  >
                    Generate QA Plan
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Tab 1: Saved QA Plans (Developer Scoped) */}
      {tabIndex === 1 && (
        <Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} justify-content="space-between" spacing={2} sx={{ mb: 3 }} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              My QA Plans ({plans.length})
            </Typography>
            <TextField
              size="small"
              placeholder="Search by title, description, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: '100%', sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {plansLoading ? (
            <Box textAlign="center" py={6}>
              <CircularProgress size={40} />
            </Box>
          ) : plans.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No QA plans found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Switch to "Generate New QA Plan" tab to create your first plan.
              </Typography>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#F1F5F9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Title & Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Developer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Coverage</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600} color="primary" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/plan/${plan.id}`)}>
                          {plan.title || `QA Plan #${plan.id}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                          {plan.description || plan.requirement}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {plan.developerName || developerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {plan.createdDate ? new Date(plan.createdDate).toLocaleDateString() : 'Just now'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color={plan.coveragePercentage === 100 ? 'success.main' : 'warning.main'}>
                          {plan.coveragePercentage ? Math.round(plan.coveragePercentage) : 100}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Plan">
                            <IconButton color="primary" onClick={() => navigate(`/plan/${plan.id}`)} size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <IconButton color="info" onClick={() => handleDownloadPdf(plan.id!)} size="small">
                              <PictureAsPdfIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Plan">
                            <IconButton color="error" onClick={() => handleDelete(plan.id!, plan.title)} size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
}
