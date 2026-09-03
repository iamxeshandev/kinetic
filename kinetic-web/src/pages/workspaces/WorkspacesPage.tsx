import { CONFIG } from '../../config';
import { WorkspacesView } from '../../features/workspaces/ui';

export function WorkspacesPage() {
  return (
    <>
      <title>{`Workspaces | ${CONFIG.APP_NAME}`}</title>
      <WorkspacesView />
    </>
  );
}

export { WorkspacesPage as Component };
