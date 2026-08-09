import { config } from '../config';
import { ResetPasswordView } from '../features/auth';

export function Component() {
  return (
    <>
      <title>{`Forgot Password | ${config.appName}`}</title>
      <ResetPasswordView />
    </>
  );
}
