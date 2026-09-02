import { Box, Button, Stack, Typography } from '@mui/material';
import { LuPlus } from 'react-icons/lu';
import { Can } from '../../../../shared/permissions';
import type { Callback } from '../../../../shared/types';

export type HeaderSectionProps = {
  onCreateClick: Callback;
};

export function HeaderSection({ onCreateClick }: HeaderSectionProps) {
  return (
    <Stack
      direction='row'
      spacing={2}
      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Box>
        <Typography variant='h1'>Projects</Typography>
        <Typography variant='subtitle1'>
          Manage and track your team's initiatives.
        </Typography>
      </Box>

      <Can role='Manager'>
        <Button
          startIcon={<LuPlus />}
          sx={{ display: { xs: 'none', sm: 'inherit' } }}
          onClick={onCreateClick}
        >
          Create Project
        </Button>
      </Can>
    </Stack>
  );
}
