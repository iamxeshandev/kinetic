import {
  Button,
  Card,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { LuListChecks, LuPlus, LuSquareCheck } from 'react-icons/lu';
import { FieldLabel } from './FieldLabel';

export function SubtasksSection() {
  return (
    <Stack spacing={1}>
      <FieldLabel
        label='Subtasks'
        icon={LuListChecks}
        action={
          <Button variant='text' size='small' startIcon={<LuPlus />}>
            Add Subtask
          </Button>
        }
      />

      <LinearProgress variant='determinate' value={60} max={100} />

      <List
        disablePadding
        sx={{
          p: 1,
          backgroundColor: 'surface.subtle',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <ListItem component={Card}>
          <ListItemIcon>
            <IconButton size='small'>
              <LuSquareCheck />
            </IconButton>
          </ListItemIcon>
          <ListItemText>Lorem ipsum, dolor sit amet consectetur.</ListItemText>
        </ListItem>
      </List>
    </Stack>
  );
}
