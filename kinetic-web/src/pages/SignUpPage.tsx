import { config } from '../config';
import { SignUpView } from '../features/auth';

export function Component() {
  return (
    <>
      <title>{`Sign Up | ${config.appName}`}</title>
      <SignUpView />
    </>
  );
}
