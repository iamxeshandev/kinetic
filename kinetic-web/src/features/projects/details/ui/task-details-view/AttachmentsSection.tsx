import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { type TaskDto } from '../../../../../shared/api';
import { varAlpha } from '../../../../../shared/helpers';
import {
  AttachmentIcon,
  DownloadIcon,
  FileIcon,
  FileUpload,
  TrashIcon,
} from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { Centered, ConfirmDialog } from '../../../../../shared/ui';
import {
  useDeleteTaskAttachment,
  useDownloadTaskAttachment,
  useUploadTaskAttachment,
} from '../../hooks';
import { SectionLabel } from './SectionLabel';

export function AttachmentsSection({ task }: { task: TaskDto }) {
  const { workspaceId = '', projectId = '' } = useParams();

  const [attachment, setAttachment] = useState<string>();

  const { trigger: uploadTaskAttachment, isMutating: isUploading } =
    useUploadTaskAttachment(workspaceId, projectId, task.id);

  const { trigger: downloadTaskAttachment, isMutating: isDownloading } =
    useDownloadTaskAttachment(workspaceId, projectId, task.id);

  const { trigger: deleteTaskAttachment, isMutating: isDeleting } =
    useDeleteTaskAttachment(workspaceId, projectId, task.id);

  const handleUploadAttachment = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadTaskAttachment(file)
      .then((res) => toast.success(res.message))
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });
  };

  const handleDownloadAttachment = async (
    attachmentId: string,
    fileName: string,
  ) =>
    downloadTaskAttachment({ attachmentId, fileName }).catch((err) => {
      toast.error(err.message);
      console.error(err);
    });

  const handleDeleteAttachment = async () =>
    await deleteTaskAttachment(attachment!)
      .then((res) => {
        setAttachment(undefined);
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      });

  const attachmentCount = task.attachments.length ?? 0;

  return (
    <>
      <Stack spacing={1}>
        <SectionLabel
          icon={AttachmentIcon}
          label={
            attachmentCount ? `Attachments (${attachmentCount})` : 'Attachments'
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
          }}
        >
          {task.attachments.map((attachment) => (
            <Stack
              key={attachment.id}
              direction={'row'}
              spacing={1}
              sx={{
                p: 1,
                backgroundColor: 'background.neutral',
                borderRadius: 2,
                alignItems: 'center',
              }}
            >
              <Centered
                sx={{
                  p: 1,
                  color: 'primary.main',
                  backgroundColor: (theme) =>
                    varAlpha(
                      theme.vars!.palette.primary.mainChannel,
                      theme.vars!.palette.action.selectedOpacity,
                    ),
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'divider',
                  aspectRatio: 1,
                }}
              >
                <FileIcon fontSize={24} />
              </Centered>

              <Stack spacing={0.5} sx={{ overflow: 'hidden', flex: 1 }}>
                <Typography
                  variant='subtitle2'
                  noWrap
                  sx={{ textOverflow: 'ellipsis' }}
                >
                  {attachment.fileName}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  {(attachment.sizeBytes / 1024).toFixed()} KB
                </Typography>
              </Stack>

              <IconButton
                size='small'
                onClick={() =>
                  handleDownloadAttachment(attachment.id, attachment.fileName)
                }
                loading={isDownloading}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                size='small'
                color='error'
                onClick={() => setAttachment(attachment.id)}
              >
                <TrashIcon />
              </IconButton>
            </Stack>
          ))}

          <Button
            component={'label'}
            variant='outlined'
            startIcon={<FileUpload />}
            loading={isUploading}
            sx={{ height: 58 }}
          >
            Upload
            <input type='file' onChange={handleUploadAttachment} hidden />
          </Button>
        </Box>
      </Stack>

      <ConfirmDialog
        open={!!attachment}
        onClose={() => setAttachment(undefined)}
        title='Delete Attachment'
        content={`Are you sure you want to delete the attachment?`}
        action={
          <Button
            color='error'
            onClick={handleDeleteAttachment}
            loading={isDeleting}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
