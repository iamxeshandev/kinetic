import { Box, type BoxProps, type ButtonProps } from '@mui/material';
import { varAlpha } from '../../utils/helpers';

// ***************************************************************************
// * Label
// ***************************************************************************

const LABEL_SIZES: Record<
  string,
  { fontSize: string; px: number; py: number }
> = {
  small: { fontSize: '0.75rem', px: 0.5, py: 0.25 },
  medium: { fontSize: '0.875rem', px: 1, py: 0.5 },
  large: { fontSize: '1rem', px: 1, py: 0.5 },
};

export type LabelProps = Omit<BoxProps, 'color'> & {
  color?: Exclude<ButtonProps['color'], 'inherit'>;
  size?: 'small' | 'medium' | 'large';
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
  const { fontSize, px, py } = LABEL_SIZES[size];
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

// ***************************************************************************
// * IconLabel
// ***************************************************************************

const ICON_LABEL_SIZES: Record<string, { fontSize: string; p: number }> = {
  small: { fontSize: '0.75rem', p: 0.5 },
  medium: { fontSize: '1rem', p: 1 },
  large: { fontSize: '1.5rem', p: 1 },
};

export type IconLabelProps = Omit<BoxProps, 'color'> & {
  color?: Exclude<ButtonProps['color'], 'inherit'>;
  size?: 'small' | 'medium' | 'large';
};

export function IconLabel({
  color = 'primary',
  size = 'medium',
  children,
  ...props
}: IconLabelProps) {
  return (
    <Box
      {...props}
      sx={{
        ...ICON_LABEL_SIZES[size],
        aspectRatio: 1,
        lineHeight: 0,
        color: `${color}.main`,
        backgroundColor: (theme) =>
          varAlpha(
            theme.vars!.palette[color].mainChannel,
            theme.vars!.palette.action.selectedOpacity,
          ),
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
}
