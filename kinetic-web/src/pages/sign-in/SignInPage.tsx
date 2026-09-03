import { CONFIG } from '../../config';
import { SignInView } from '../../features/auth/ui';

export function SignInPage() {
  return (
    <>
      <title>{`Sign In | ${CONFIG.APP_NAME}`}</title>
      <SignInView />
    </>
  );
}

export { SignInPage as Component };
