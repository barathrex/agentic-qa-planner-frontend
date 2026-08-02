import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { toast } from 'react-toastify';
import { qaApi } from '../api/qaApi';
import type { QaPlan, TestCase, TestCategory, TestPriority } from '../types/qa';
import { CATEGORY_LABELS } from '../types/qa';
import TestCaseCard from '../components/TestCaseCard';
import UserFlowDiagram from '../components/UserFlowDiagram';

const MAIN_CATEGORIES: TestCategory[] = [
  'UNIT_TESTS',
  'API_TESTS',
  'INTEGRATION_TESTS',
  'END_TO_END_TESTS',
  'PLAYWRIGHT_TESTS',
  'MANUAL_TESTS',
];

const SCENARIO_CATEGORIES: TestCategory[] = [
  'EDGE_CASES',
  'PERMISSION_CASES',
  'FAILURE_STATES',
  'REGRESSION_AREAS',
];

const RAG_CHECKLIST_ITEMS = [
  'API Validation',
  'Authentication',
  'Authorization',
  'Security Testing',
  'Regression Checklist',
  'Boundary Testing',
];

export default function QaPlanPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<QaPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPlan = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await qaApi.getPlan(Number(id));
      setPlan(data);
    } catch {
      toast.error('Failed to load QA plan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const testsByCategory = useMemo(() => {
    if (!plan) return {} as Record<TestCategory, TestCase[]>;
    const grouped = {} as Record<TestCategory, TestCase[]>;
    for (const tc of plan.testCases) {
      if (!grouped[tc.category]) grouped[tc.category] = [];
      grouped[tc.category].push(tc);
    }
    return grouped;
  }, [plan]);

  const handleApprove = async (testCaseId: number) => {
    try {
      await qaApi.approveTestCase(testCaseId);
      toast.success('Test case approved');
      loadPlan();
    } catch {
      toast.error('Failed to approve test case');
    }
  };

  const handleReject = async (testCaseId: number) => {
    try {
      await qaApi.rejectTestCase(testCaseId);
      toast.success('Test case rejected');
      loadPlan();
    } catch {
      toast.error('Failed to reject test case');
    }
  };

  const handlePriorityChange = async (testCaseId: number, priority: TestPriority) => {
    try {
      await qaApi.updatePriority(testCaseId, priority);
      toast.success('Priority updated');
      loadPlan();
    } catch {
      toast.error('Failed to update priority');
    }
  };

  const handleEdit = async (testCaseId: number, data: Partial<TestCase>) => {
    try {
      await qaApi.updateTestCase(testCaseId, data);
      toast.success('Test case updated');
      loadPlan();
    } catch {
      toast.error('Failed to update test case');
    }
  };

  const handleSave = async () => {
    if (!plan?.id) return;
    setSaving(true);
    try {
      const updated = await qaApi.savePlan(plan.id);
      setPlan(updated);
      toast.success(`Saved as version ${updated.currentVersion}`);
    } catch {
      toast.error('Failed to save QA plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!plan?.id) return;
    try {
      toast.info('Generating PDF document...');
      await qaApi.downloadPdf(plan.id);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!plan) {
    return <Alert severity="error">QA plan not found</Alert>;
  }

  const totalAc = plan.acceptanceCriteria ? plan.acceptanceCriteria.length : 0;
  const coveredAcList = plan.acceptanceCriteria ? plan.acceptanceCriteria.filter(ac => ac.covered) : [];
  const uncoveredAcList = plan.acceptanceCriteria ? plan.acceptanceCriteria.filter(ac => !ac.covered) : [];
  const coveragePercent = plan.coveragePercentage ? Math.round(plan.coveragePercentage) : 100;

  const renderCategorySection = (categories: TestCategory[]) =>
    categories.map((cat) => {
      const tests = testsByCategory[cat];
      if (!tests || tests.length === 0) return null;
      return (
        <Accordion key={cat} defaultExpanded={MAIN_CATEGORIES.includes(cat)} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>
              {CATEGORY_LABELS[cat]} ({tests.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {tests.map((tc) => (
              <TestCaseCard
                key={tc.id ?? tc.testId}
                testCase={tc}
                onApprove={handleApprove}
                onReject={handleReject}
                onPriorityChange={handlePriorityChange}
                onEdit={handleEdit}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      );
    });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Top Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} color="inherit">
            Back
          </Button>
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {plan.title || `QA Test Plan #${plan.id}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Developer: <strong>{plan.developerName || 'Barath'}</strong> | Created: {plan.createdDate ? new Date(plan.createdDate).toLocaleDateString() : 'Today'}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="info" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            Save Plan
          </Button>
        </Stack>
      </Stack>

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
        {plan.disclaimer}
      </Alert>

      {/* Plan Details Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
            Requirement / User Story
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3, color: '#334155' }}>
            {plan.requirement}
          </Typography>

          <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
            Implementation Summary
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#334155' }}>
            {plan.implementationSummary}
          </Typography>
        </CardContent>
      </Card>

      {/* Acceptance Criteria Coverage Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Acceptance Criteria Coverage
          </Typography>

          <Stack direction="row" spacing={4} alignItems="center" sx={{ my: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Covered Status
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary">
                Covered: {coveredAcList.length} / {totalAc}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Coverage
              </Typography>
              <Typography variant="h5" fontWeight={700} color={coveragePercent === 100 ? 'success.main' : 'warning.main'}>
                Coverage: {coveragePercent}%
              </Typography>
            </Box>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={coveragePercent}
            sx={{ height: 10, borderRadius: 5, mb: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: coveragePercent === 100 ? '#10B981' : '#2563EB' } }}
          />

          <Grid container spacing={2}>
            {/* Covered Criteria List */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#F8FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" /> Covered Criteria
                </Typography>
                <Stack spacing={1}>
                  {coveredAcList.map((ac) => (
                    <Typography key={ac.criteriaIndex} variant="body2" sx={{ color: '#1E293B' }}>
                      ✓ AC{ac.criteriaIndex}: {ac.description}
                    </Typography>
                  ))}
                  {coveredAcList.length === 0 && (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Uncovered Criteria List */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: uncoveredAcList.length > 0 ? '#FEF2F2' : '#F8FAFC' }}>
                <Typography variant="subtitle2" fontWeight={700} color={uncoveredAcList.length > 0 ? 'error.main' : 'text.secondary'} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelIcon fontSize="small" /> Uncovered Criteria
                </Typography>
                <Stack spacing={1}>
                  {uncoveredAcList.map((ac) => (
                    <Typography key={ac.criteriaIndex} variant="body2" color="error">
                      AC{ac.criteriaIndex}: {ac.description}
                    </Typography>
                  ))}
                  {uncoveredAcList.length === 0 && (
                    <Typography variant="body2" color="text.secondary">All criteria covered!</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* User Flows */}
      {plan.userFlows && plan.userFlows.length > 0 && (
        <UserFlowDiagram flows={plan.userFlows} />
      )}

      {/* QA Guidance Applied (RAG) */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TaskAltIcon color="primary" /> QA Guidance Applied
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ my: 2 }}>
            {RAG_CHECKLIST_ITEMS.map((item) => (
              <Chip key={item} label={`✓ ${item}`} color="primary" variant="outlined" sx={{ fontWeight: 600, borderRadius: 2 }} />
            ))}
          </Stack>

          {plan.retrievedGuidance && (
            <Accordion variant="outlined" sx={{ borderRadius: 3, mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600} color="text.secondary">
                  View Details (Raw RAG Context)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#475569' }}>
                  {plan.retrievedGuidance}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Assumptions */}
      {plan.assumptions && plan.assumptions.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Assumptions
            </Typography>
            {plan.assumptions.map((a, i) => (
              <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                • {a}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Proposed Test Cases
      </Typography>

      {renderCategorySection(MAIN_CATEGORIES)}
      {renderCategorySection(SCENARIO_CATEGORIES)}
    </Box>
  );
}
