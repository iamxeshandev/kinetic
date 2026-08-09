import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'motion/react';
import { LuArrowLeft } from 'react-icons/lu';
import { NavLink } from 'react-router';
import { Logo } from '../../../components/ui/Logo';
import { paths } from '../../../routes/paths';

const arrowVariants = {
  rest: { x: 0 },
  hover: { x: -8 },
};

export function ResetPasswordView() {
  return (
    <>
      <Card sx={{ width: 1, maxWidth: 'sm', textAlign: 'center' }}>
        <CardHeader
          title={
            <>
              <NavLink to={paths.home.root}>
                <Logo />
              </NavLink>
              <Typography variant='inherit'>Reset Password</Typography>
            </>
          }
          subheader='Enter your email to receive a reset link.'
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label='Email' fullWidth />

          <Button size='large'>Send Reset Link</Button>
        </CardContent>
      </Card>

      <Link
        component={motion(NavLink)}
        to={paths.auth.signIn}
        initial='rest'
        whileHover='hover'
        sx={{ mt: 2, display: 'inline-flex', alignItems: 'center', gap: 1 }}
      >
        <Box
          component={motion.div}
          variants={arrowVariants}
          sx={{ display: 'flex' }}
        >
          <LuArrowLeft fontSize='1.25rem' />
        </Box>
        Back to Sign In
      </Link>
    </>
  );
}
