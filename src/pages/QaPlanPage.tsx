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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
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

  const renderCategorySection = (categories: TestCategory[]) =>
    categories.map((cat) => {
      const tests = testsByCategory[cat];
      if (!tests || tests.length === 0) return null;
      return (
        <Accordion key={cat} defaultExpanded={MAIN_CATEGORIES.includes(cat)}>
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
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            QA Plan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Version {plan.currentVersion}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate(`/plan/${plan.id}/versions`)}
          >
            Version History
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            Save QA Plan
          </Button>
        </Stack>
      </Stack>

      <Alert severity="warning" sx={{ mb: 3 }}>
        {plan.disclaimer}
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Requirement
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {plan.requirement}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Implementation Summary
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {plan.implementationSummary}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Acceptance Criteria Coverage
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={plan.coveragePercentage ?? 0}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {plan.coveragePercentage ?? 0}%
          </Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {plan.acceptanceCriteria.map((ac) => (
            <Chip
              key={ac.criteriaIndex}
              label={`AC${ac.criteriaIndex}: ${ac.description}`}
              color={ac.covered ? 'success' : 'default'}
              variant={ac.covered ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
        {plan.uncoveredCriteria && plan.uncoveredCriteria.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Uncovered Acceptance Criteria
            </Typography>
            {plan.uncoveredCriteria.map((uc) => (
              <Typography key={uc.criteriaIndex} variant="body2">
                AC{uc.criteriaIndex}: {uc.description}
              </Typography>
            ))}
          </Alert>
        )}
      </Paper>

      {plan.userFlows && plan.userFlows.length > 0 && (
        <UserFlowDiagram flows={plan.userFlows} />
      )}

      {plan.retrievedGuidance && (
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Retrieved QA Guidance (RAG)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {plan.retrievedGuidance}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}

      {plan.assumptions && plan.assumptions.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Assumptions
          </Typography>
          {plan.assumptions.map((a, i) => (
            <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
              • {a}
            </Typography>
          ))}
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Proposed Test Cases
      </Typography>
      {renderCategorySection(MAIN_CATEGORIES)}
      {renderCategorySection(SCENARIO_CATEGORIES)}

      {plan.duplicateTestCases && plan.duplicateTestCases.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom color="info.main">
            Possible Duplicate Test Cases
          </Typography>
          {plan.duplicateTestCases.map((dup, i) => (
            <Alert severity="info" key={i} sx={{ mb: 1 }}>
              {dup.testId1} &amp; {dup.testId2} — similarity {Math.round(dup.similarityScore * 100)}%
              <br />
              &quot;{dup.title1}&quot; vs &quot;{dup.title2}&quot;
            </Alert>
          ))}
        </Paper>
      )}

      {plan.incompleteTestCases && plan.incompleteTestCases.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom color="warning.main">
            Incomplete Test Cases
          </Typography>
          {plan.incompleteTestCases.map((tc) => (
            <Alert severity="warning" key={tc.testId} sx={{ mb: 1 }}>
              {tc.testId}: {tc.title || '(no title)'} — missing required fields
            </Alert>
          ))}
        </Paper>
      )}
    </Box>
  );
}
