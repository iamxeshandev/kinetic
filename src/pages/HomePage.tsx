import { config } from '../config';
import { HomeView } from '../features/home';

export function Component() {
  return (
    <>
      <title>{`${config.appName}`}</title>
      <HomeView />
    </>
  );
}
