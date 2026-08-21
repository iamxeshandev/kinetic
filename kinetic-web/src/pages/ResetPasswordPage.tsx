import { config } from '../config';
import { ResetPasswordView } from '../features/auth';

export function Component() {
  return (
    <>
      <title>{`Reset Password | ${config.appName}`}</title>
      <ResetPasswordView />
    </>
  );
}
