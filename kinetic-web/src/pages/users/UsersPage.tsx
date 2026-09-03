import { CONFIG } from '../../config';
import { UsersView } from '../../features/users/ui';

export function UsersPage() {
  return (
    <>
      <title>{`Users | ${CONFIG.APP_NAME}`}</title>
      <UsersView />
    </>
  );
}

export { UsersPage as Component };
