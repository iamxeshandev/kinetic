import { Box, type BoxProps } from '@mui/material';

export function Centered({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
