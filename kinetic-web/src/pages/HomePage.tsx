import { config } from '../config';
import { HomeView } from '../features/landing';

export function Component() {
  return (
    <>
      <title>{`${config.appName}`}</title>
      <HomeView />
    </>
  );
}
