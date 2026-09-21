import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useBoolean } from '../../../../../shared/hooks';
import { AddIcon } from '../../../../../shared/icons';
import { toast } from '../../../../../shared/toast';
import { useCreateSection } from '../../hooks';

export function CreateSectionButton() {
  const { workspaceId, projectId } = useParams();

  const createMode = useBoolean();

  const [value, setValue] = useState('');

  const { trigger: createSection, isMutating: isCreating } = useCreateSection(
    workspaceId!,
    projectId!,
  );

  const cancelCreateSection = () => {
    createMode.setFalse();
    setValue('');
  };

  const handleAddColumn = async () => {
    const name = value.trim();
    if (!name) {
      cancelCreateSection();
      return;
    }
    await createSection({ name })
      .then((res) => {
        toast.success(res.message);
        cancelCreateSection();
      })
      .catch((err) => console.error(err));
  };

  return createMode.value ? (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder='Section name...'
      autoFocus
      sx={{ width: 300 }}
      disabled={isCreating}
      onBlur={isCreating ? undefined : handleAddColumn}
      onKeyDown={async (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          cancelCreateSection();
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          await handleAddColumn();
        }
      }}
      slotProps={{
        input: {
          endAdornment: isCreating && (
            <InputAdornment position='end'>
              <CircularProgress size={20} />
            </InputAdornment>
          ),
        },
      }}
    />
  ) : (
    <Button
      size='large'
      variant='secondary'
      onClick={createMode.setTrue}
      startIcon={<AddIcon />}
      sx={{ alignSelf: 'start' }}
    >
      Create Section
    </Button>
  );
}
