import { config } from '../config';
import { AboutView } from '../features/landing';

export function Component() {
  return (
    <>
      <title>{`About | ${config.appName}`}</title>
      <AboutView />
    </>
  );
}
