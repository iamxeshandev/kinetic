import { Box, type BoxProps, type ButtonProps } from '@mui/material';
import { varAlpha } from '../../utils/helpers';

const SIZES: Record<string, { fontSize: string; px: number; py: number }> = {
  small: { fontSize: '0.75rem', px: 0.5, py: 0.25 },
  medium: { fontSize: '0.875rem', px: 1, py: 0.5 },
  large: { fontSize: '1rem', px: 1, py: 0.5 },
};

export type LabelProps = Omit<BoxProps, 'color'> & {
  color?: Exclude<ButtonProps['color'], 'inherit'>;
  size?: ButtonProps['size'];
  chip?: boolean;
};

export function Label({
  children,
  color = 'primary',
  size = 'medium',
  chip = false,
  sx,
  ...props
}: LabelProps) {
  const { fontSize, px, py } = SIZES[size];
  return (
    <Box
      {...props}
      sx={{
        px: chip ? px + py : px,
        py,
        fontSize,
        fontWeight: 'bold',
        borderRadius: chip ? 10 : 1,
        color: `${color}.main`,
        backgroundColor: (theme) =>
          varAlpha(
            theme.vars!.palette[color].mainChannel,
            theme.vars!.palette.action.selectedOpacity,
          ),
        textWrap: 'nowrap',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
