import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { NavLink, useNavigate } from 'react-router';
import z from 'zod';
import { Form, FormTextField } from '../../../components/form';
import { Logo } from '../../../components/ui/Logo';
import { config } from '../../../config';
import { paths } from '../../../routes/paths';
import { signIn } from '../api/signIn';

const schema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const defaultValues: z.infer<typeof schema> = {
  email: 'admin@example.com',
  password: 'Password@123',
};

export function SignInView() {
  const navigate = useNavigate();

  const [password, setPassword] = useState<boolean>(true);

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = () => {
    signIn();
    navigate(paths.dashboard.root, { replace: true });
  };

  return (
    <Card sx={{ width: 1, maxWidth: 'sm', textAlign: 'center' }}>
      <Form methods={methods} onSubmit={handleSubmit}>
        <CardHeader
          title={
            <>
              <Logo />
              <div>Sign in to {config.appName}</div>
            </>
          }
          subheader='Welcome back. Please enter your details.'
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert
            severity='info'
            sx={{ mb: 2, textAlign: 'left' }}
            slotProps={{
              icon: {
                sx: {
                  my: 'auto',
                },
              },
            }}
            action={
              <Button
                size='small'
                variant='outlined'
                onClick={() => methods.setValues(defaultValues)}
                sx={{ my: 'auto' }}
              >
                Use
              </Button>
            }
          >
            <strong>Email:</strong> {defaultValues.email}
            <br />
            <strong>Password:</strong> {defaultValues.password}
          </Alert>

          <FormTextField name='email' label='Email' />
          <FormTextField
            name='password'
            label='Password'
            type={password ? 'password' : 'text'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setPassword((prev) => !prev)}>
                      {password ? <LuEye /> : <LuEyeOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
              textWrap: 'nowrap',
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label={<Typography variant='body2'>Remember me</Typography>}
            />
            <Link component={NavLink} to={paths.auth.resetPassword} replace>
              Forgot password?
            </Link>
          </Box>

          <Button size='large' type='submit'>
            Sign In
          </Button>

          <Divider>
            <Typography variant='subtitle2'>Or continue with</Typography>
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

          <Typography variant='subtitle2'>
            Don't have an account?{' '}
            <Link component={NavLink} to={paths.auth.signUp} replace>
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Form>
    </Card>
  );
}
