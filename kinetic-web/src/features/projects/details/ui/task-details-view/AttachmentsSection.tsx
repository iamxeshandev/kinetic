import { Box, Button, Card, Stack, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useParams } from 'react-router';
import type { TaskDto } from '../../../../../shared/api';
import { AttachmentIcon, FileUpload } from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { Centered } from '../../../../../shared/ui';
import { useUploadTaskAttachment } from '../../hooks';
import { FieldLabel } from './FieldLabel';

export function AttachmentsSection({ task }: { task: TaskDto }) {
  const { workspaceId, projectId } = useParams();

  const { trigger: uploadTaskAttachment, isMutating: isUploading } =
    useUploadTaskAttachment(workspaceId!, projectId!, task.id);

  const handleUploadAttachment = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadTaskAttachment(file)
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err.message));
  };

  return (
    <Stack spacing={1}>
      <FieldLabel
        label='Attachments'
        icon={AttachmentIcon}
        action={
          <Button
            component={'label'}
            variant='text'
            startIcon={<FileUpload />}
            loading={isUploading}
          >
            Upload
            <input type='file' onChange={handleUploadAttachment} hidden />
          </Button>
        }
      />

      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          backgroundColor: 'background.neutral',
        }}
      >
        {!task.attachments.length ? (
          <Centered sx={{ height: 50 }}>No attachments</Centered>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {task.attachments.map((attachment) => (
              <Card key={attachment.id} sx={{ p: 2 }}>
                <Typography>{attachment.fileName}</Typography>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
}
