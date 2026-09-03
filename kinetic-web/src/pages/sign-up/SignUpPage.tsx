import { CONFIG } from '../../config';
import { SignUpView } from '../../features/auth/ui';

export function SignUpPage() {
  return (
    <>
      <title>{`Sign Up | ${CONFIG.APP_NAME}`}</title>
      <SignUpView />
    </>
  );
}

export { SignUpPage as Component };
