import { config } from '../config';
import { UsersView } from '../features/users/components';

export function Component() {
  return (
    <>
      <title>{`Teams | ${config.appName}`}</title>
      <UsersView />
    </>
  );
}
