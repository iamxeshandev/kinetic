import { Box, type BoxProps } from '@mui/material';

export function Centered({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      sx={{
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
