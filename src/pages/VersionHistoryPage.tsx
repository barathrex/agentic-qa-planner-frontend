import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { toast } from 'react-toastify';
import { qaApi } from '../api/qaApi';
import type { VersionHistory } from '../types/qa';

export default function VersionHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [versions, setVersions] = useState<VersionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    qaApi
      .getVersions(Number(id))
      .then(setVersions)
      .catch(() => toast.error('Failed to load version history'))
      .finally(() => setLoading(false));
  }, [id]);

  const openVersion = async (versionNumber: number) => {
    if (!id) return;
    try {
      const snapshot = await qaApi.getVersion(Number(id), versionNumber);
      sessionStorage.setItem(`qa-plan-version-${id}-${versionNumber}`, JSON.stringify(snapshot));
      navigate(`/plan/${id}?version=${versionNumber}`);
    } catch {
      toast.error('Failed to open version');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/plan/${id}`)}
        sx={{ mb: 2 }}
      >
        Back to QA Plan
      </Button>

      <Typography variant="h4" gutterBottom fontWeight={700}>
        Version History
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Every save creates a new version. Open a version to view its snapshot.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((v) => (
              <TableRow key={v.id}>
                <TableCell>Version {v.versionNumber}</TableCell>
                <TableCell>{new Date(v.createdDate).toLocaleString()}</TableCell>
                <TableCell>
                  {v.updatedDate ? new Date(v.updatedDate).toLocaleString() : '—'}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => openVersion(v.versionNumber)}
                  >
                    Open Version
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {versions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No versions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
