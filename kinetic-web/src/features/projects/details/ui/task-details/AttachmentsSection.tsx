import { Box, Button, Stack } from '@mui/material';
import { LuFileUp } from 'react-icons/lu';
import { AttachmentIcon } from '../../../../../shared/icons';
import { Centered } from '../../../../../shared/ui';
import { FieldLabel } from './FieldLabel';

export function AttachmentsSection() {
  return (
    <Stack spacing={1}>
      <FieldLabel
        label='Attachments'
        icon={AttachmentIcon}
        action={
          <Button variant='text' startIcon={<LuFileUp />}>
            Upload
          </Button>
        }
      />

      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          backgroundColor: 'surface.subtle',
        }}
      >
        <Centered sx={{ height: 100 }}>No attachments</Centered>
      </Box>
    </Stack>
  );
}
