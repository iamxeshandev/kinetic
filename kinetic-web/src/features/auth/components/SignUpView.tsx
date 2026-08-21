import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router';
import { Logo } from '../../../components/ui/Logo';
import { paths } from '../../../routes/paths';

export function SignUpView() {
  return (
    <Card sx={{ width: 1, maxWidth: 'sm', textAlign: 'center' }}>
      <CardHeader
        title={
          <>
            <Logo />
            <div>Create an account</div>
          </>
        }
        subheader='Start managing your tasks efficiently today.'
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label='Full Name' fullWidth />
        <TextField label='Email' fullWidth />
        <TextField label='Password' fullWidth />
        <TextField label='Confirm Password' fullWidth />

        <Button size='large'>Create Account</Button>

        <Typography variant='subtitle2'>
          Already have an account?{' '}
          <Link component={NavLink} to={paths.auth.signIn} replace>
            Sign in
          </Link>
        </Typography>

        <Divider />

        <Typography variant='subtitle2'>
          By creating an account, you agree to our{' '}
          <Link
            component={NavLink}
            to={paths.about.root}
            color='textSecondary'
            underline='always'
          >
            Terms of Service
          </Link>
          {' and '}
          <Link
            component={NavLink}
            to={paths.about.root}
            color='textSecondary'
            underline='always'
          >
            Privacy Policy
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
