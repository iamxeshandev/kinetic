import { config } from '../config';
import { SignUpView } from '../features/auth/components';

export function Component() {
  return (
    <>
      <title>{`Sign Up | ${config.appName}`}</title>
      <SignUpView />
    </>
  );
}
