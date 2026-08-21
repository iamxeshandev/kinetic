import {
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type ButtonProps,
  type ChipProps,
  type IconButtonProps,
  type MenuProps,
} from '@mui/material';
import { useState } from 'react';
import { LuChevronDown, LuEllipsisVertical } from 'react-icons/lu';

// ***************************************************************************
// * ActionMenu
// ***************************************************************************

export type ActionMenuProps = MenuProps & {
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    closeOnClick?: boolean;
    color?: ButtonProps['color'];
    onClick?: () => void;
  }>;
};

export function ActionMenu({ actions, ...props }: ActionMenuProps) {
  return (
    <Menu {...props}>
      {actions.map(
        ({ label, icon, closeOnClick = true, color, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              onClick?.();
              if (closeOnClick) props.onClose?.(e, 'backdropClick');
            }}
          >
            {icon && (
              <ListItemIcon sx={{ color: `${color}.main` }}>
                {icon}
              </ListItemIcon>
            )}
            <ListItemText sx={{ color: `${color}.main` }}>{label}</ListItemText>
          </MenuItem>
        ),
      )}
    </Menu>
  );
}

// ***************************************************************************
// * ActionMenuButton
// ***************************************************************************

export type ActionMenuButtonProps = Omit<ButtonProps, 'onClick'> & {
  actions: ActionMenuProps['actions'];
};

export function ActionMenuButton({
  actions,
  children,
  ...props
}: ActionMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        variant='outlined'
        endIcon={<LuChevronDown />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        {...props}
      >
        {children}
      </Button>

      <ActionMenu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        actions={actions}
      />
    </>
  );
}

// ***************************************************************************
// * ActionMenuIconButton
// ***************************************************************************

export type ActionMenuIconButtonProps = Omit<IconButtonProps, 'onClick'> & {
  actions: ActionMenuProps['actions'];
};

export function ActionMenuIconButton({
  actions,
  children = <LuEllipsisVertical />,
  ...props
}: ActionMenuIconButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton
        size='small'
        onClick={(e) => setAnchorEl(e.currentTarget)}
        {...props}
      >
        {children}
      </IconButton>

      <ActionMenu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        actions={actions}
      />
    </>
  );
}

// ***************************************************************************
// * ActionMenuChip
// ***************************************************************************

export type ActionMenuChipProps = Omit<ChipProps, 'onClick'> & {
  actions: ActionMenuProps['actions'];
};

export function ActionMenuChip({ actions, ...props }: ActionMenuChipProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Chip
        variant='outlined'
        onClick={(e) => setAnchorEl(e.currentTarget)}
        icon={<LuChevronDown />}
        {...props}
      />

      <ActionMenu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        actions={actions}
      />
    </>
  );
}
