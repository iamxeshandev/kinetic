import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type ButtonProps,
  type MenuProps,
} from '@mui/material';

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
            <ListItemIcon sx={{ color: `${color}.main` }}>{icon}</ListItemIcon>
            <ListItemText sx={{ color: `${color}.main` }}>{label}</ListItemText>
          </MenuItem>
        ),
      )}
    </Menu>
  );
}
