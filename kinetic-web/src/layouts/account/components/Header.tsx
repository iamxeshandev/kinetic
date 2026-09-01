import { Box, Container } from '@mui/material';
import { AccountAvatar, Logo, ThemeSwitcher } from '../../../shared/ui';

export function Header() {
  return (
    <Box component={'header'} sx={{ py: 2 }}>
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Logo full />

        <Box sx={{ flex: 1 }} aria-hidden />

        <ThemeSwitcher />

        <AccountAvatar />
      </Container>
    </Box>
  );
}
