import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router';
import { Logo } from '../../../components/ui/Logo';
import { config } from '../../../config';
import { paths } from '../../../routes/paths';

export function SignInView() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(paths.dashboard.root, { replace: true });
  };

  return (
    <Card sx={{ width: 1, maxWidth: 'sm', textAlign: 'center' }}>
      <CardHeader
        title={
          <>
            <NavLink to={paths.home.root}>
              <Logo />
            </NavLink>
            <Typography variant='inherit'>
              Sign in to {config.appName}
            </Typography>
          </>
        }
        subheader='Welcome back. Please enter your details.'
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label='Email' fullWidth />
        <TextField label='Password' fullWidth />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <FormControlLabel control={<Checkbox />} label='Remember me' />
          <Link component={NavLink} to={paths.auth.resetPassword} replace>
            Forgot password?
          </Link>
        </Box>

        <Button size='large' onClick={handleSubmit}>
          Sign In
        </Button>

        <Divider>
          <Typography variant='caption'>Or continue with</Typography>
        </Divider>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <IconButton>
            <FaGoogle />
          </IconButton>
          <IconButton>
            <FaMicrosoft />
          </IconButton>
        </Box>

        <Typography variant='subtitle1'>
          Don't have an account?{' '}
          <Link component={NavLink} to={paths.auth.signUp} replace>
            Sign up
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
