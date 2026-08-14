import { Box, type BoxProps, type ButtonProps } from '@mui/material';

const SIZES: Record<string, { fontSize: string; px: number; py: number }> = {
  small: { fontSize: '0.75rem', px: 1, py: 0.5 },
  medium: { fontSize: '0.875rem', px: 1, py: 0.5 },
  large: { fontSize: '1rem', px: 1, py: 0.5 },
};

export type LabelProps = Omit<BoxProps, 'color'> & {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  chip?: boolean;
};

export function Label({
  children,
  color = 'inherit',
  size = 'medium',
  chip = false,
  sx,
  ...props
}: LabelProps) {
  const isInherit = color === 'inherit';

  const { fontSize, px, py } = SIZES[size];
  return (
    <Box
      {...props}
      sx={{
        px: chip ? px + py : px,
        py,
        fontSize,
        borderRadius: chip ? 10 : 1,
        fontWeight: 'bold',
        color: isInherit ? 'inherit' : `${color}.main`,
        bgcolor: `rgb(var(--mui-palette-${color}-mainChannel) / var(--mui-palette-action-selectedOpacity))`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
