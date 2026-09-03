import { CONFIG } from '../../config';
import { HomeView } from '../../features/landing/ui';

export function HomePage() {
  return (
    <>
      <title>{`${CONFIG.APP_NAME}`}</title>
      <HomeView />
    </>
  );
}

export { HomePage as Component };
