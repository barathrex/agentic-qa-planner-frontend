import { Box, Paper, Typography, Stack } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface UserFlowDiagramProps {
  flows: string[];
}

export default function UserFlowDiagram({ flows }: UserFlowDiagramProps) {
  if (!flows || flows.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Identified User Flows
      </Typography>
      <Stack alignItems="center" spacing={0}>
        {flows.map((step, index) => (
          <Box key={index} sx={{ textAlign: 'center', width: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 2,
                display: 'inline-block',
                minWidth: 200,
              }}
            >
              <Typography variant="body1">{step}</Typography>
            </Paper>
            {index < flows.length - 1 && (
              <ArrowDownwardIcon sx={{ my: 0.5, color: 'text.secondary' }} />
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
