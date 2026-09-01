import { CONFIG } from '../../config';
import { AboutView } from '../../features/landing';

export function AboutPage() {
  return (
    <>
      <title>{`About | ${CONFIG.APP_NAME}`}</title>
      <AboutView />
    </>
  );
}

export { AboutPage as Component };
