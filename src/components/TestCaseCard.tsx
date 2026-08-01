import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import type { TestCase, TestPriority } from '../types/qa';
import { CATEGORY_LABELS, PRIORITY_COLORS, STATUS_COLORS } from '../types/qa';

interface TestCaseCardProps {
  testCase: TestCase;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onPriorityChange: (id: number, priority: TestPriority) => void;
  onEdit: (id: number, data: Partial<TestCase>) => void;
}

export default function TestCaseCard({
  testCase,
  onApprove,
  onReject,
  onPriorityChange,
  onEdit,
}: TestCaseCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: testCase.title,
    steps: testCase.steps || '',
    expectedResult: testCase.expectedResult || '',
    preconditions: testCase.preconditions || '',
    reason: testCase.reason || '',
  });

  const handleSave = () => {
    if (testCase.id) {
      onEdit(testCase.id, editForm);
      setEditOpen(false);
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {testCase.testId}
                </Typography>
                <Chip label={CATEGORY_LABELS[testCase.category]} size="small" variant="outlined" />
                <Chip
                  label={testCase.priority}
                  size="small"
                  color={PRIORITY_COLORS[testCase.priority]}
                />
                <Chip label={testCase.status.replace(/_/g, ' ')} size="small" color={STATUS_COLORS[testCase.status]} />
              </Stack>
              <Typography variant="h6" gutterBottom>
                {testCase.title}
              </Typography>
              {testCase.preconditions && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Preconditions:</strong> {testCase.preconditions}
                </Typography>
              )}
              {testCase.steps && (
                <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                  <strong>Steps:</strong> {testCase.steps}
                </Typography>
              )}
              {testCase.expectedResult && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Expected Result:</strong> {testCase.expectedResult}
                </Typography>
              )}
              {testCase.reason && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Why important:</strong> {testCase.reason}
                </Typography>
              )}
              {testCase.mappedCriteriaIndices && testCase.mappedCriteriaIndices.length > 0 && (
                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                  {testCase.mappedCriteriaIndices.map((idx) => (
                    <Chip key={idx} label={`AC${idx}`} size="small" color="primary" variant="outlined" />
                  ))}
                </Stack>
              )}
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton size="small" onClick={() => setEditOpen(true)} title="Edit">
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="success"
                onClick={() => testCase.id && onApprove(testCase.id)}
                title="Approve"
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => testCase.id && onReject(testCase.id)}
                title="Reject"
              >
                <CancelIcon />
              </IconButton>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={testCase.priority}
                  label="Priority"
                  onChange={(e) =>
                    testCase.id && onPriorityChange(testCase.id, e.target.value as TestPriority)
                  }
                >
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Test Case</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <TextField
              label="Preconditions"
              fullWidth
              multiline
              rows={2}
              value={editForm.preconditions}
              onChange={(e) => setEditForm({ ...editForm, preconditions: e.target.value })}
            />
            <TextField
              label="Steps"
              fullWidth
              multiline
              rows={3}
              value={editForm.steps}
              onChange={(e) => setEditForm({ ...editForm, steps: e.target.value })}
            />
            <TextField
              label="Expected Result"
              fullWidth
              multiline
              rows={2}
              value={editForm.expectedResult}
              onChange={(e) => setEditForm({ ...editForm, expectedResult: e.target.value })}
            />
            <TextField
              label="Reason"
              fullWidth
              multiline
              rows={2}
              value={editForm.reason}
              onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
