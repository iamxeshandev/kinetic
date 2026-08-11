import { config } from '../config';
import { TeamsView } from '../features/teams';

export function Component() {
  return (
    <>
      <title>{`Teams | ${config.appName}`}</title>
      <TeamsView />
    </>
  );
}
