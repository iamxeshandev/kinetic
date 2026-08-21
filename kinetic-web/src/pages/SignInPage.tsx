import { config } from '../config';
import { SignInView } from '../features/auth';

export function Component() {
  return (
    <>
      <title>{`Sign In | ${config.appName}`}</title>
      <SignInView />
    </>
  );
}
