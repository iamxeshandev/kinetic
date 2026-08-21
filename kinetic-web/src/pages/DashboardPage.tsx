import { config } from '../config';
import { DashboardView } from '../features/dashboard';

export function Component() {
  return (
    <>
      <title>{`Dashboard | ${config.appName}`}</title>
      <DashboardView />
    </>
  );
}
