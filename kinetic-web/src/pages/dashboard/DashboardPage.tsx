import { CONFIG } from '../../config';
import { DashboardView } from '../../features/dashboard/components';

export function DashboardPage() {
  return (
    <>
      <title>{`Dashboard | ${CONFIG.APP_NAME}`}</title>
      <DashboardView />
    </>
  );
}

export { DashboardPage as Component };
