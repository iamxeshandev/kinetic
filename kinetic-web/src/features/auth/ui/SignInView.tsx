import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { NavLink } from 'react-router';
import z from 'zod';
import { CONFIG } from '../../../config';
import { paths } from '../../../routes/paths';
import {
  Form,
  FormCheckbox,
  FormTextField,
} from '../../../shared/components/form';
import { Logo } from '../../../shared/components/ui';
import { toast } from '../../../shared/toast';
import { authApi } from '../api';
import { useAuthContext } from '../context';

const SignInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
});
type SignInForm = z.infer<typeof SignInFormSchema>;

const defaultValues: SignInForm = {
  email: 'johndoe@example.com',
  password: 'Password@123',
  rememberMe: false,
};

export function SignInView() {
  const { setUser } = useAuthContext();

  const [password, setPassword] = useState<boolean>(true);

  const methods = useForm<SignInForm>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: SignInForm) =>
    authApi
      .login(data.email, data.password, data.rememberMe)
      .then((res) => setUser(res.data))
      .catch((error) => toast.error(error.message));

  return (
    <Card sx={{ width: 1, maxWidth: 'sm', textAlign: 'center' }}>
      <Form methods={methods} onSubmit={handleSubmit}>
        <CardHeader
          title={
            <>
              <Logo />
              <div>Sign in to {CONFIG.APP_NAME}</div>
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

          <FormTextField name='email' label='Email' required />
          <FormTextField
            name='password'
            label='Password'
            required
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
            <FormCheckbox
              name='rememberMe'
              label={<Typography variant='body2'>Remember me</Typography>}
            />
            <Link component={NavLink} to={paths.auth.resetPassword} replace>
              Forgot password?
            </Link>
          </Box>

          <Button
            size='large'
            type='submit'
            loading={methods.formState.isSubmitting}
          >
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
