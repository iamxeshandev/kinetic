import { config } from '../config';
import { AboutView } from '../features/about';

export function Component() {
  return (
    <>
      <title>{`About | ${config.appName}`}</title>
      <AboutView />
    </>
  );
}
