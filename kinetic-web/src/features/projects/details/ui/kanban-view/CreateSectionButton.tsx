import { Button, TextField } from '@mui/material';
import { useParams } from 'react-router';
import { AddIcon } from '../../../../../shared/icons';
import { useBoolean } from '../../../../../shared/hooks';
import { toast } from '../../../../../shared/toast';
import { useCreateSection } from '../../hooks';

export function CreateSectionButton() {
  const { workspaceId, projectId } = useParams();

  const showField = useBoolean();

  const { trigger: createSection } = useCreateSection(workspaceId!, projectId!);

  const handleAddColumn = (event: React.FocusEvent<HTMLInputElement>) => {
    const name = event.target.value.trim();

    if (name)
      createSection({ name })
        .then((res) => toast.success(res.message))
        .catch((err) => toast.error(err.message));

    showField.setFalse();
  };

  return showField.value ? (
    <TextField
      placeholder='Section name...'
      autoFocus
      onBlur={handleAddColumn}
      sx={{ width: 300 }}
    />
  ) : (
    <Button
      variant='secondary'
      onClick={showField.setTrue}
      startIcon={<AddIcon />}
      sx={{ alignSelf: 'start', width: 300, height: 56 }}
    >
      Create Section
    </Button>
  );
}
