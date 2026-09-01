import { CONFIG } from '../../config';
import { ResetPasswordView } from '../../features/auth/components';

export function ResetPasswordPage() {
  return (
    <>
      <title>{`Reset Password | ${CONFIG.APP_NAME}`}</title>
      <ResetPasswordView />
    </>
  );
}

export { ResetPasswordPage as Component };
