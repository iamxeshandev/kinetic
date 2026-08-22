import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import z from 'zod';
import { Form, FormTextField } from '../../../components/form';
import { toast } from '../../../components/toast';
import { Logo } from '../../../components/ui/Logo';
import { paths } from '../../../routes/paths';
import { authApi } from '../api/authApi';

const schema = z.object({
  email: z.email().max(256),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50),
});

const defaultValues: z.infer<typeof schema> = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

export function SignUpView() {
  const navigate = useNavigate();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof schema>) =>
    authApi
      .register(data.email, data.password, data.firstName, data.lastName)
      .then((response) => {
        toast.success(response.message ?? 'Account created successfully');
        navigate(paths.auth.signIn, { replace: true });
      })
      .catch(console.error);

  return (
    <Card sx={{ width: 1, maxWidth: 'sm', textAlign: 'center' }}>
      <Form methods={methods} onSubmit={handleSubmit}>
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
          <FormTextField name='email' label='Email' required />
          <FormTextField name='password' label='Password' required />
          <FormTextField name='firstName' label='First Name' required />
          <FormTextField name='lastName' label='Last Name' />

          <Button
            size='large'
            type='submit'
            loading={methods.formState.isSubmitting}
          >
            Create Account
          </Button>

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
      </Form>
    </Card>
  );
}
